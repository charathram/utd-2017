const Gpio = require('onoff').Gpio;
const EventEmitter = require('events');

const emitter = new EventEmitter();

let button = new Gpio(16, 'in', 'both');

button.watch((err, value) => {
	emitter.emit('button_pressed', value);
});

module.exports = emitter;
