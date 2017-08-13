const button = require('./button-event.js');
const Gpio = require('onoff').Gpio;

let led = new Gpio(18, 'out');


button.on('button_pressed', (value) => {
    console.log('Button Pressed: ' + value);
	led.writeSync(value);
});

process.on('SIGINT', function () {
    led.writeSync(0);
    console.log("\nGot SIGINT. Exiting...");
    process.exit(0);
});


