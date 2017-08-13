const Gpio = require('onoff').Gpio

let led = new Gpio(23, 'out');

function pulse() {
    led.writeSync(1);

    setTimeout(function () {
        led.writeSync(0);
    }, 150);
}

setInterval(pulse, 1000);

process.on('SIGINT', function () {
    led.writeSync(0);
    console.log("Received SIGINT. Goodbye!");
    process.exit(0);
});

module.exports = { pulse: pulse };
