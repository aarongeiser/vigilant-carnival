// MCP ADC Setup
var mcpadc = require('mcp-spi-adc');
var buffer = 0.00;

// Web Sockets Setup
var socket = require('socket.io-client')('http://10.119.82.39:3001/input');  /* http:// required */
socket.on("event", function(data) { console.log(data); })
socket.emit('input-a-1', false);
socket.emit('input-a-2', false);
socket.emit('input-a-3', buffer);

// GPIO Setup
var rpio = require('rpio');
rpio.init({gpiomem: false}); /* Use /dev/mem */
rpio.open(7, rpio.INPUT, rpio.PULL_UP);
rpio.open(8, rpio.INPUT, rpio.PULL_UP);

// Poll pin
rpio.poll(7, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit('input-a-1', {'value':rpio.read(pin)});
});

// Poll pin
rpio.poll(8, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit('input-a-2', {'value':rpio.read(pin)});
});

// Poll ADC Channel 0
var pot = mcpadc.open(0, {speedHz: 1300000}, function (err) {
  setInterval(function () {
    pot.read(function (err, reading) {
      var value = reading.value.toFixed(2);
      if (value != buffer) {
        console.log('Pot value: %d', value);
        socket.emit('input-a-3', {'value':value});
        buffer = value;
      }
    });
  }, 30);
});

// Initial console log
console.log('Running...');