// Controller Config
var button1 = process.env.CONTROLLER_NAME + "-button1";
var button2 = process.env.CONTROLLER_NAME + "-button2";
var pot = process.env.CONTROLLER_NAME + "-pot";
var up = process.env.CONTROLLER_NAME + "-up";
var right = process.env.CONTROLLER_NAME + "-right";
var down = process.env.CONTROLLER_NAME + "-down";
var left = process.env.CONTROLLER_NAME + "-left";

// MCP ADC Setup
var mcpadc = require('mcp-spi-adc');
var buffer = 0.00;

// Web Sockets Setup
var socket = require('socket.io-client')(process.env.SOCKET_ADDRESS);  /* http:// required */
socket.on("event", function(data) { console.log(data); });
socket.emit(button1, false);
socket.emit(button2, false);
socket.emit(pot, buffer);

// GPIO Setup
var rpio = require('rpio');
rpio.init({gpiomem: false}); /* Use /dev/mem */
rpio.open(7, rpio.INPUT, rpio.PULL_UP);  /* button1 */
rpio.open(8, rpio.INPUT, rpio.PULL_UP);  /* button2 */
rpio.open(10, rpio.INPUT, rpio.PULL_UP);  /* stick_up */
rpio.open(11, rpio.INPUT, rpio.PULL_UP);  /* stick_right */
rpio.open(12, rpio.INPUT, rpio.PULL_UP);  /* stick_down */
rpio.open(13, rpio.INPUT, rpio.PULL_UP);  /* stick_left */

// Poll pin
function pollPin (gpioPin, inputName) {
    rpio.poll(gpioPin, function (pin) {
        var state = rpio.read(pin) ? 'released' : 'pressed';
        console.log('Button event on P%d (button currently %s)', pin, state);
        socket.emit(inputName, {
            'source' : process.env.CONTROLLER_NAME,
            'value':rpio.read(pin)
        });
    });
}

pollPin(7, button1);
pollPin(8, button2);
pollPin(10, up);
pollPin(11, right);
pollPin(12, down);
pollPin(13, left);

// Poll ADC Channel 0
mcpadc.open(0, {speedHz: 1300000}, function (err) {
    setInterval(function () {
        pot.read(function (err, reading) {
            var value = reading.value.toFixed(2);
            if (value != buffer) {
                console.log('Pot value: %d', value);
                socket.emit(pot, {
                    'source' : process.env.CONTROLLER_NAME,
                    'value' : value
                });
                buffer = value;
            }
        });
    }, 30);
});

// Initial console log
console.log('Running...');