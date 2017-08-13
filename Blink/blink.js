const Gpio = require('onoff').Gpio

let led = new Gpio(19, 'out');
let state = 1;
led.writeSync(state);

setInterval(function () {
    state === 0 ? state = 1 : state = 0;
    led.writeSync(state);
}, 1000);

process.on('SIGINT', function () {
    led.writeSync(0);
    console.log("Received SIGINT. Goodbye!");
    process.exit(0);
});
