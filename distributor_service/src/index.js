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
  client.join(VISUALIZERS);
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
      let containsRooms = Object.keys(io.nsps['/viz'].adapter.rooms).length;
      if (containsRooms) {
        io.to(VISUALIZERS).emit('audio', data);
        dist.emit('update_count', { connectionCount });
      }
    });
    d.on('disconnect', d => {
      io.to(VISUALIZERS).emit('down');
      this.current_connections--;
    });
  }
});

server.listen(PORT, () => {
  console.log(`Distributor up and running on port: ${PORT}`);
});
