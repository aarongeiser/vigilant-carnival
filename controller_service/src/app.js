// Controller Config
require('dotenv').config();
var button1 = process.env.CONTROLLER_NAME + "-1";
var button2 = process.env.CONTROLLER_NAME + "-2";
var pot = process.env.CONTROLLER_NAME + "-3";
var stick_up = process.env.CONTROLLER_NAME + "-4";
var stick_right = process.env.CONTROLLER_NAME + "-5";
var stick_down = process.env.CONTROLLER_NAME + "-6";
var stick_left = process.env.CONTROLLER_NAME + "-7";

// MCP ADC Setup
var mcpadc = require('mcp-spi-adc');
var buffer = 0.00;

// Web Sockets Setup
var socket = require('socket.io-client')(process.env.DISTRIBUTOR_LOCATION);  /* http:// required */
socket.on("event", function(data) { console.log(data); });
socket.emit(button1, false);
socket.emit(button2, false);
socket.emit(pot, buffer);

// GPIO Setup
var rpio = require('rpio');
rpio.init({gpiomem: false}); /* Use /dev/mem */
rpio.open(7, rpio.INPUT, rpio.PULL_UP);  /* button */
rpio.open(8, rpio.INPUT, rpio.PULL_UP);  /* button */

rpio.open(10, rpio.INPUT, rpio.PULL_UP);  /* joystick */
rpio.open(11, rpio.INPUT, rpio.PULL_UP);  /* joystick */
rpio.open(12, rpio.INPUT, rpio.PULL_UP);  /* joystick */
rpio.open(13, rpio.INPUT, rpio.PULL_UP);  /* joystick */

// Poll pin
rpio.poll(7, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit(button1, {'value':rpio.read(pin)});
});

// Poll pin
rpio.poll(8, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit(button2, {'value':rpio.read(pin)});
});

// Poll ADC Channel 0
var readpot = mcpadc.open(0, {speedHz: 1300000}, function (err) {
  setInterval(function () {
    pot.read(function (err, reading) {
      var value = reading.value.toFixed(2);
      if (value != buffer) {
        console.log('Pot value: %d', value);
        socket.emit(pot, {'value':value});
        buffer = value;
      }
    });
  }, 30);
});

// Poll pin
rpio.poll(10, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit(stick_up, {'value':rpio.read(pin)});
});
// Poll pin
rpio.poll(11, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit(stick_right, {'value':rpio.read(pin)});
});
// Poll pin
rpio.poll(12, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit(stick_down, {'value':rpio.read(pin)});
});
// Poll pin
rpio.poll(13, function (pin) {
  var state = rpio.read(pin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', pin, state);
  socket.emit(stick_left, {'value':rpio.read(pin)});
});

// Initial console log
console.log('Running...');