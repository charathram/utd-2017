const express = require('express');
let app = express();
let path = require('path');
let http = require('http').Server(app);
let io = require('socket.io')(http);
const bitwise = require('bitwise');
const Gpio = require('onoff').Gpio;
const EventEmitter = require('events');
const emitter = new EventEmitter();
const ledGpio = [18, 23, 24, 25, 20];
let leds = [];
let button = {};

// Initialize GPIO
function init() {
    ledGpio.forEach((gpio, index) => {
        leds[index] = new Gpio(gpio, 'out');
    });
    button = new Gpio(16, 'in', 'rising', {
        debounceTimeout: 300
    });
}

// This is the actual timer function
function timer(seconds) {
    let iv = setInterval(() => {
        setLeds(seconds, leds);
        io.emit('timer_tick', seconds);
        seconds = seconds - 1;
        if (seconds < 0) {
            clearInterval(iv);
            emitter.emit('done');
            io.emit('timer_done');
        }
    }, 1000);
}

emitter.on('button', function (seconds) {
    timer(seconds);
});

emitter.on('done', function () {
    console.log('TIMER ENDED');
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

// app.get('/', function (req, res) {
//     res.send('<h1>Hello World</h1>');
// });

init();

io.on('connection', function (socket) {
    console.log('Someone connected');
    socket.on('clicked', function (msg) {
        console.log('BUTTON WAS CLICKED! Timer for ' + msg + ' sec.');
        emitter.emit('button', parseInt(msg, 10));
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

http.listen(8080, function () {
    console.log('Server Initialized on port 8080');
});

process.on('SIGINT', function () {
    io.close();
    leds.forEach((element) => {
        element.writeSync(0);
    });
    console.log("Received SIGINT. Goodbye!");
    process.exit(0);
});