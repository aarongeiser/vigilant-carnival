const http = require('http');
const express = require('express');
const gpio = require('rpi-gpio');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

gpio.setup(14, gpio.DIR_IN, readInput);

function readInput() {
    gpio.read(14, function(err, value) {
        console.log('The value is ' + value);
    });
}

app.use('/', (req, res) => {
  res.send('Hello World!');
  //console.log(`Reading input.`);
  //readInput();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

/*
server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
  */