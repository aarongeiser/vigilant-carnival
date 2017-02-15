const http = require('http');
const express = require('express');
const app = express();
const serveStatic = require('serve-static');

const PORT = 3001;
const VISUALIZERS = 'visualizers';

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
  client.on('input-a-pot', data => {
    viz.emit('input-a-pot', data);
  });
  client.on('input-b-pot', data => {
    viz.emit('input-b-pot', data);
  });
});

const dist = io.of('/distributor');
dist.max_connections = 1;
dist.current_connections = 0;
dist.on('connection', function (d) {
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
    });
  }
});

server.listen(PORT, () => {
  console.log(`Distributor up and running on port: ${PORT}`);
});
