const http = require('http');
const express = require('express');
const gpio = require('rpi-gpio');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(5, gpio.DIR_IN, gpio.EDGE_BOTH);
