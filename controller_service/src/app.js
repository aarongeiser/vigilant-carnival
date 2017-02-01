const gpio = require('rpi-gpio');

console.log('Running...');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);