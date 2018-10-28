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

var Drive = function() {
	var _this = this; 
	_this.open = false;

	_this.sentCommands = [];
	//var packet_length 
	_this.response = ""; 
	//_this.jogging = false;

	this.initialize = function(number, _port, _baudRate){
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
				//console.log(_this.response);
				if ((_this.response[0] == 'A') && (_this.response[1] == 'C')){
					var acceleration = parseInt(_this.response.split('=')[1]);
					logger.notice('= DRIVE ' + number.toString() + ' =','Current Acceleration : ' + acceleration.toString());
				} 
				else if ((_this.response[0] == 'E') && (_this.response[1] == 'P')){
					var position = parseInt(_this.response.split('=')[1]);
					logger.notice('= DRIVE ' + number.toString() + ' =','Current Position     : ' + position.toString());
				}
				else if ((_this.response[0] == 'D') && (_this.response[1] == 'E')){
					var deceleration = parseInt(_this.response.split('=')[1]);
					logger.notice('= DRIVE ' + number.toString() + ' =','Current Deceleration : ' + deceleration.toString());
				}
				else if ((_this.response[0] == 'V') && (_this.response[1] == 'E')){
					var velocity = parseInt(_this.response.split('=')[1]);
					logger.notice('= DRIVE ' + number.toString() + ' =','Current Velocity     : ' + velocity.toString());
				}
				else if ((_this.response[0] == 'I') && (_this.response[1] == 'V')){
					var velocity = parseInt(_this.response.split('=')[1]);
					logger.notice('= DRIVE ' + number.toString() + ' =','Current Velocity     : ' + velocity.toString());
				}
				else if((_this.response != '*\r') && (_this.response != '%\r')){
					logger.notice('= DRIVE ' + number.toString() + ' =','Query Response       : ' + _this.response);
				}


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

util.inherits(Drive, events.EventEmitter);

module.exports = Drive;