const Gpio = require('onoff').Gpio;
const utils = require('../Blink/utils.js');

const button = new Gpio(16, 'in', 'rising');
const yellow = new Gpio(19, 'out');
const red = new Gpio(18, 'out');

console.log(button.readSync());

button.watch((err, value) => {
    console.log(button.readSync());
    if (value === 1) {
        utils.blink(red, 5);
        utils.blink(yellow, 5);
    }
});

process.on('SIGINT', function () {
    button.unwatchAll();
    red.writeSync(0);
    yellow.writeSync(0);
    console.log("Received SIGINT. Goodbye!");
    process.exit(0);
});