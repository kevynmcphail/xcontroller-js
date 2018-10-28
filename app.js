const Drive             = require("./drive.js")
const expressLayouts    = require("express-ejs-layouts");
const emitter           = require("events");
const express           = require('express');
const http 			  = require("http");
const path              = require('path');
const app               = express();
const winston           = require('winston');
const XController       = require('./xcontroller.js')

// Logger -----------------------------------------------------------------------------------------

let logger = new (winston.Logger)({
    levels: {info: 0, notice: 1, warning: 2, success: 3, error: 4},
    colors: {info: "blue", notice: "yellow", warning: "magenta", success:"green", error: "red"},
    transports: [
        new winston.transports.Console({
            level: "error",
            colorize: true
        })
    ]
});

let xcarve = new XController ('COM3', 115200);

setTimeout(() => {
    xcarve.send_gcode("G0 X100");
}, 1000);

// Server/App -------------------------------------------------------------------------------------

app.set('views', path.join(__dirname, 'views')); // set the views folder in this directory as the one the app references
app.set('view engine', 'ejs'); // set the views engine to look for .ejs files
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
server.listen(8003, function() {
	logger.info('==== APP ====', 'Server Created')
});

var router = express.Router();

app.get('/', function(req,res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// // Socket IO --------------------------------------------------------------------------------------

// var io = require("socket.io")(server);

// var socket = io.of('/controller');

// socket.on('connection', function(socket) {
// 	logger.info('==== APP ====', 'Page Conencted to Socket');

// 	socket.on('query', function(data) {
// 		//logger.notice('== APP ====', 'Received Query')
// 		drive0.write(data+'\r');
// 	})

// 	socket.on('move-velocity', function(data) {
// 		velocityMove(drive0, data.velocity, data.acceleration, data.deceleration, function() {
// 			logger.notice('== APP ====', 'Performing Velocity Move')
// 		})
// 	})

// 	socket.on('move-position-abs', function(data) {
// 		positionMove_ABS(drive0, data.position, data.velocity, data.acceleration, data.deceleration, function() {
// 			logger.notice('== APP ====', 'Performing Absolute Position Move')
// 		})
// 	})

// 	socket.on('move-position-rel', function(data) {
// 		positionMove_REL(drive0, data.position, data.velocity, data.acceleration, data.deceleration, function() {
// 			logger.notice('== APP ====', 'Performing Relative Position Move')
// 		})
// 	})

// 	socket.on('jog-cw', function(data) {
// 		jog(drive0, data.direction, data.velocity, data.acceleration, data.deceleration, function() {
// 			logger.notice('== APP ====', 'Performing Clockwise Jog')
// 		})
// 	})

// 	socket.on('jog-ccw', function(data) {
// 		jog(drive0, data.direction, data.velocity, data.acceleration, data.deceleration, function() {
// 			logger.notice('== APP ====', 'Performing  Counter Clockwise Jog')
// 		})
// 	})

// });



// // Drive ------------------------------------------------------------------------------------------

// var drive0 = new Drive();
// drive0.initialize(0, 'COM3', 115200);
// drive0.on('open', function() {
// 	logger.notice('== APP ====', 'Drive Connected');
// 	drive0.write('ME'+'\r');
// 	drive0.write('EP'+'\r');
// 	drive0.write('IV'+'\r');
// 	drive0.write('AC'+'\r');
// 	drive0.write('DE'+'\r');
// })

// // Motion -----------------------------------------------------------------------------------------

// var velocityMove = function(drive, velocity, acceleration, deceleration, cb) {
// 	if (velocity < 0){
// 		drive.write('DI' + (-1).toString() +'\r');
// 	} else if (velocity >= 0){
// 		drive.write('DI' + (1).toString() +'\r');
// 	}
// 	drive.write('JA' + acceleration.toString() +'\r');
// 	drive.write('JS' + Math.abs(velocity).toString() +'\r');
// 	drive.write('JL' + deceleration.toString() +'\r');
// 	drive.write('CJ'+'\r');

// 	if (cb != null) {
// 		cb();
// 	}
// }

// var jog = function(drive, direction, velocity, acceleration, deceleration, cb) {
// 	if (direction == 'CW'){
// 		drive.write('DI' + (1).toString() +'\r');
// 	} else if (direction == 'CCW'){
// 		drive.write('DI' + (-1).toString() +'\r');
// 	}
// 	drive.write('JA' + acceleration.toString() +'\r');
// 	drive.write('JS' + velocity.toString() +'\r');
// 	drive.write('JL' + deceleration.toString() +'\r');
// 	drive.write('CJ'+'\r');

// 	if (cb != null) {
// 		cb();
// 	}
// }

// var positionMove_ABS = function(drive, position, velocity, acceleration, deceleration, cb) {
// 	drive.write('DI' + position.toString() +'\r');
// 	drive.write('AC' + acceleration.toString() +'\r');
// 	drive.write('VE' + velocity.toString() +'\r');
// 	drive.write('DE' + deceleration.toString() +'\r');
// 	drive.write('FP'+'\r');
	
// 	if (cb != null) {
// 		cb();
// 	}
// }

// var positionMove_REL = function(drive, position, velocity, acceleration, deceleration, cb) {
// 	drive.write('DI' + position.toString() +'\r');
// 	drive.write('AC' + acceleration.toString() +'\r');
// 	drive.write('VE' + velocity.toString() +'\r');
// 	drive.write('DE' + deceleration.toString() +'\r');
// 	drive.write('FL'+'\r');
	
// 	if (cb != null) {
// 		cb();
// 	}
// }

// // App Close --------------------------------------------------------------------------------------
// process.on('SIGINT', function() {
//     console.log("Caught interrupt signal");
//     drive0.write('MD'+'\r');
//     setTimeout(function() {
//     	process.exit();
//     },500);
// });