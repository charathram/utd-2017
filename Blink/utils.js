function pulse(led) {
    led.writeSync(1);
    setTimeout(function () {
        led.writeSync(0);
    }, 150);
}

// Helper function to force program to block
function sleep(milliseconds) {
    let start = Date.now();
    let currentTime = Date.now();
    do {
        currentTime = Date.now();
    } while ((currentTime - start) < milliseconds);
}

// Blink an LED a maximum of 5 times
function blink(led, times) {
    if (times <= 0) {
        times = 1;
    }

    if (times > 5) {
        times = 5;
    }

    for (var i = 0; i < times; i++) {
        led.writeSync(1);
        sleep(150);
        led.writeSync(0);
        sleep(200);
    }
}

module.exports = {
    pulse: pulse,
    sleep: sleep,
    blink: blink
};