var gpio = require('rpi-gpio');

gpio.setup(14, gpio.DIR_IN, readInput);

function readInput() {
    gpio.read(14, function(err, value) {
        console.log('The value is ' + value);
    });
}