const bitwise = require('bitwise');
const Gpio = require('onoff').Gpio;

const ledGpio = [18, 23, 24, 25, 20];
let leds = [];
let button = {};

// Initialize GPIO
function init() {
    ledGpio.forEach((gpio, index) => {
        leds[index] = new Gpio(gpio, 'out');
    });
    button = new Gpio(16, 'in', 'rising', {
        debounceTimeout: 200
    });
}

// This is the actual timer function
function timer(seconds) {
    let iv = setInterval(() => {
        setLeds(seconds, leds);
        seconds = seconds - 1;
        if (seconds < 0) {
            clearInterval(iv);
        }
    }, 1000);
}

function countUp(seconds) {
    let maxCount = seconds;
    let count = 0;
    let iv1 = setInterval(() => {
        console.log(count);
        count++;
        if (count > maxCount) {
            clearInterval(iv1);
        }
    }, 1000);
}

init();
button.watch((err, value) => {
        console.log('Button Pressed');
        timer(31);
});

button.watch((err, value) => {
        countUp(31);
});

// Exit gracefully
process.on('SIGINT', function () {
    leds.forEach((element) => {
        element.writeSync(0);
    });
    console.log("Received SIGINT. Goodbye!");
    process.exit(0);
});

// Convert an integer to an array of bits
function numToBitArray(value) {
    let bitArray = bitwise.readByte(value);
    let maxBits = ledGpio.length;
    return bitArray.slice(-1 * maxBits);
}

// Display an integer as a binary number 
// using a set of LEDs
function setLeds(value, leds) {
    let bits = numToBitArray(value);
    bits.forEach((bit, index) => {
        leds[index].writeSync(bit);
    });
}
