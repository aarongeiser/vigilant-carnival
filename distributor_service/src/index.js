const http = require('http');
const express = require('express');
const app = express();
const serveStatic = require('serve-static');

const PORT = 3001;
const VISUALIZERS = 'visualizers';
const VISUALIZATION_DURATION = 180000;

const server = http.createServer(app);

const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(serveStatic(__dirname + '/'));
app.use('/', (req, res) => res.render('index'));

const viz = io.of('/viz');
viz.on('connection', client => {
  client.emit('event', { message: 'connected to audio distributor' });
});

const inputs = io.of('/input');
inputs.on('connection', client => {
  console.log("I have an input...");
  client.emit('event', { message: "You are now connected!" })
  client.on('input', data => {
    console.log({ data });
    viz.emit('input', data);
  });
});

const dist = io.of('/distributor');
dist.max_connections = 1;
dist.current_connections = 0;
dist.on('connection', function (d) {

  let timeout = null;

  if (this.current_connections >= this.max_connections) {
    dist.emit('disconnect', 'I\'m sorry, too many connections');
    d.disconnect();
  } else {
    this.current_connections++;

    d.on('audio', data => {
      viz.emit('audio', data);
    });

    d.on('disconnect', d => {
      viz.emit('down');
      this.current_connections--;
      clearTimeout(timeout);
    });
  }

  const autoAdvance = function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (Object.keys(viz.sockets).length) {
        viz.emit('switch');
      }
      autoAdvance();
    }, VISUALIZATION_DURATION);
  }

  autoAdvance();

});

server.listen(PORT, () => {
  console.log(`Distributor up and running on port: ${PORT}`);
});
