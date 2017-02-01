const http = require('http');
const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const getVisualization = require('./getVisualization');
const PORT = 4000;
const server = http.createServer(app);
const io = require('socket.io')(server); //so we can serve the io client;

app.set('view engine', 'ejs');
app.use(serveStatic(__dirname + '/'));

app.param('id', getVisualization);

app.use('/viz/:id', (req, res) => {
  const { viz } = req;
  console.log(viz);
  res.render(`viz/${req.viz}`, { viz });
});

app.use('/viz', (req, res) => {
  getVisualization(req, res, () => {
    res.render('index', { all_viz: req.all_viz });
  });
});

server.listen(PORT, () => {
  console.log(`Distributor up and running on port: ${PORT}`);
});
