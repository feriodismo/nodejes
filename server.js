const express = require('express');
const socketIO = require('socket.io');
const mysql = require('mysql');
const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// Primero creamos la conexion (recordar instalar el modulo de mysql y requirlo al inicio de server.js)
// Usar una cuenta de phpmyadmin con contrasenia
var con = mysql.createConnection({
  host: "localhost",
  user: "FabioNode",
  password: "hola12",
  database: "nodejes",
});

// 
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");

});

 // con.query("SELECT nombre FROM prueba WHERE id='1'", function (err, result, fields) {
 //    if (err) throw err;
    
 //    console.log(result[0].nombre);
 // });
  function searchingMaxLive(){
  
  con.query("SELECT MAX(pixel) AS maximo FROM max_live", function (err, result, fields) {
    if (err) throw err;
    io.sockets.emit('printMaxLive', result)
  });

  con.query("SELECT MAX(id) AS relive FROM max_live", function (err, result, fields) {
    if (err) throw err;
    io.sockets.emit('printRelive', result)
    console.log(result)
  });

  }


const io = socketIO(server);

io.on('connection', newConnection);





workingMachines = []
const lineLiveSpeedConst = 5;
var increment = 1;
var lineWidth = 0;
var growingInterval;
var exponent;
var loopTimer;
var speed;
function newConnection(socket){
searchingMaxLive();
	workingMachines.push(socket.id);
	lineLiveSpeed = lineLiveSpeedConst*workingMachines.length;
	clearInterval(growingInterval);
	exponent = Math.pow(.80, workingMachines.length);
	loopTimer = Math.floor(exponent * 500);
	growTheLine();
	speed = 1000/loopTimer;
	speed = speed.toFixed(2);
	io.sockets.emit('workingMachinesCant', workingMachines, speed)

	socket.on('disconnect', function(){
		var index = workingMachines.indexOf(socket.id);
		workingMachines.splice(index, 1);
		clearInterval(growingInterval);
		exponent = Math.pow(.80, workingMachines.length);
		loopTimer = Math.floor(exponent * 500);
		speed = 1000/loopTimer;
		speed = speed.toFixed(2);
		io.sockets.emit('workingMachinesCant', workingMachines, speed)
		growTheLine();

		if(workingMachines.length === 0){
			var sql = "INSERT INTO max_live (id, pixel) VALUES ('', '"+lineWidth+"')";
			con.query(sql, function (err, result) {
    			if (err) throw err;
    			console.log(result);
  			});
			clearInterval(growingInterval);
			lineWidth = 0;
		}
	})
	

	function growTheLine(){
	growingInterval = setInterval(function(){
		lineWidth += increment;
		io.sockets.emit('shareLineWidth', lineWidth);
		console.log(lineWidth);
	},loopTimer)
	}

}
