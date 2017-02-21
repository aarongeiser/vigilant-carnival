const http = require('http');
const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const PORT = 3002;
const server = http.createServer(app);
const io = require('socket.io')(server); //so we can serve the io client;

app.set('view engine', 'ejs');
app.use(serveStatic(__dirname + '/'));
app.use('/', (req, res) => {
  res.render('main');
});

server.listen(PORT, () => {
  console.log(`Visualization Service up and running on port: ${PORT}`);
});
