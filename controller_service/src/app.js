// MCP ADC Setup
var mcpadc = require('mcp-spi-adc');



// Web Sockets Setup
var socket = require('socket.io-client')(process.env.SOCKET_ADDRESS);  /* http:// required */
socket.on("event", function(data) { console.log(data); });

// GPIO Setup
var rpio = require('rpio');
rpio.init({gpiomem: false}); /* Use /dev/mem */
rpio.open(3, rpio.OUTPUT, rpio.LOW);

// Flash LED
function flashLed() {
    rpio.write(3, rpio.HIGH);
	setInterval(ledOff, 250);
}

function ledOff() {
  rpio.write(3, rpio.LOW);
}

// Poll GPIO Pins
function pollPin(gpioPin, inputName) {
    rpio.open(gpioPin, rpio.INPUT, rpio.PULL_UP);
    rpio.poll(gpioPin, function (pin) {
        var value = rpio.read(pin);
        var state = value ? 'released' : 'pressed';
        console.log('Button event on P%d (button currently %s)', pin, state);
        socket.emit('input', {
            'name': inputName,
            'source': process.env.CONTROLLER_NAME,
            'value': value
        });
        flashLed();
    });
}

// Poll Joystick
function pollJoystick(gpioPin, inputName) {
	rpio.open(gpioPin, rpio.INPUT, rpio.PULL_UP);
	rpio.poll(gpioPin, function (pin) {
		var value = rpio.read(pin);
		var state = value ? 'released' : 'pressed';
		console.log('Button event on P%d (button currently %s)', pin, state);
		socket.emit('input', {
			'name': inputName,
			'source': process.env.CONTROLLER_NAME,
			'value': value
		});
		flashLed();
	});
}

// Poll Potentiometers
function pollPot(adcChannel, inputName) {
    const value_diff = 0.02;
    var buffer = 0.00;
    var pot = mcpadc.open(adcChannel, {speedHz: 1300000}, function (err) {
        setInterval(function () {
            pot.read(function (err, reading) {

                var value = parseFloat(reading.value.toFixed(2), 10);
                var diff = buffer > value ? buffer - value : value - buffer;

                if (diff && (diff > value_diff) && (value != buffer)) {
                  console.log({ value });
                  buffer = value;
                  socket.emit('input', {
                    'name': inputName,
                    'source': process.env.CONTROLLER_NAME,
                    'value': value
                  });
                  flashLed();
                }
            });
        }, 30);
    });
}

// Check config for number of potentiometers
if (process.env.NUM_POTS == 2) {
    pollPot(0, "pot1");
    pollPot(1, "pot2");
} else {
    pollPot(0, "pot1");
}

// Poll button states
pollPin(7, "button1");
pollPin(8, "button2");
pollJoystick(10, "left");
pollJoystick(11, "right");
pollJoystick(12, "up");
pollJoystick(13, "down");

// Initial console log
console.log('Running...');
