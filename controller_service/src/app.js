// Web Sockets Setup
var socket = require('socket.io-client')('192.168.0.180');
socket.emit('input1', false);
socket.emit('input2', false);

// GPIO Setup
var rpio = require('rpio');
rpio.init({gpiomem: false}); /* Use /dev/mem */
rpio.open(7, rpio.INPUT);
rpio.open(8, rpio.INPUT);

// Poll pin
rpio.poll(7, function emitState(pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  if (state) {
    socket.emit('input1', false);
  } else {
    socket.emit('input1', true);
  }
});

// Poll pin
rpio.poll(8, function emitState(pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  if (state) {
    socket.emit('input2', false);
  } else {
    socket.emit('input2', true);
  }
});

// Initial console log
console.log('Running...');