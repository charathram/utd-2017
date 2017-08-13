const Gpio = require('onoff').Gpio;

let button = new Gpio(16, 'in', 'both');
let led = new Gpio(18, 'out');

button.watch((err, value) => {
    led.writeSync(value);
});

process.on('SIGINT', function () {
    button.unwatchAll();
    led.writeSync(0);
    console.log("\nGot SIGINT. Exiting...");
    process.exit(0);
});


