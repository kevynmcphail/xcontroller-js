var util              = require('util');
var SerialPort        = require('serialport');
var events            = require('events');
var winston           = require('winston');

// Logger -----------------------------------------------------------------------------------------

var logger = new (winston.Logger)({
    levels: {info: 0, notice: 1, warning: 2, success: 3, error: 4},
    colors: {info: "blue", notice: "yellow", warning: "magenta", success:"green", error: "red"},
    transports: [
        new winston.transports.Console({
            level: "error",
            colorize: true
        })
    ]
});

let Serial = function() {
    let _this = this; 

    this.initialize = function(number, _port, _baudRate=115200){
		_this.serial = new SerialPort(_port, {
			baudRate: _baudRate,
			dataBits: 8,
			parity: 'none',
			stopBits: 1,
			flowControl: false,
			lock: false,
			//parser: serial.parsers.byteLength(packet_length),
			disconnectedCallback: function(e) {
				_this.open = false;
				logger.error('=== DRIVE ' + number.toString() + ' ==', 'Serial port: '+ port +' disconnected');
				_this.emit('disconnected');
			}
		});

		_this.serial.on('open', function() {
			_this.open = true;
			logger.info('== DRIVE ' + number.toString() + ' ==', 'Serial Port Opened');
			_this.emit("open");
		});

		_this.serial.on('data', function(data) {
			var msg = data.toString();
			_this.response = _this.response + msg

			if (msg.substr(msg.length - 1) == '\r') {
                console.log(msg);           
				_this.response = '';
				this.flush();
			}	
		});
	}

	this.write = function(data, cb) {
		//console.log("Sending: " + data.toString())
		_this.serial.write(data);
		if (cb != null) {
			cb();
		}
	}
}

util.inherits(Serial, events.EventEmitter);
module.exports = Serial; 