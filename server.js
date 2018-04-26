const express = require('express');
const socketIO = require('socket.io');
const mysql = require('mysql');
const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// Primero creamos la conexion (recordar instalar el modulo de mysql y requirlo al inicio de server.js)
// Usar una cuenta de phpmyadmin con contrasenia
var con = mysql.createPool({
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "beea010e225dca",
  password: "e3268919",
  database: "heroku_2b6cf2fafd8e77a",
});
// mysql://beea010e225dca:e3268919@us-cdbr-iron-east-05.cleardb.net/heroku_2b6cf2fafd8e77a?reconnect=true
// mysql --host=us-cdbr-iron-east-05.cleardb.net --user=beea010e225dca --password=e3268919 --reconnect heroku_2b6cf2fafd8e77a < nodejes.sql
// 
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to database!");

// });

 // con.query("SELECT nombre FROM prueba WHERE id='1'", function (err, result, fields) {
 //    if (err) throw err;
    
 //    console.log(result[0].nombre);
 // });
  function searchingMaxLive(){
con.getConnection(function(err, connection) {
	console.log("Pooling | max_live query");
	con.query("SELECT MAX(pixel) AS maximo FROM max_live", function (err, result, fields) {
    	io.sockets.emit('printMaxLive', result)
    	connection.release();
    	console.log("Releasing | max_live query")
    	if (err) throw err;
    
  	});
});
con.getConnection(function(err, connection) {
	console.log("Pooling | times relive query");
	con.query("SELECT * FROM max_live", function (err, result, fields) {
		io.sockets.emit('printRelive', result)
		connection.release();
		console.log("Releasing | times relive query")
    	if (err) throw err;
	});
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
			con.getConnection(function(err, connection) {
				var sql = "INSERT INTO max_live (id, pixel) VALUES ('', '"+lineWidth+"')";
				console.log("Pooling | max_live insert");
				con.query(sql, function (err, result) {
					connection.release();
					console.log("Releasing | max_live insert")
    				if (err) throw err;
    				// console.log(result);
  				});
			});
			clearInterval(growingInterval);
			lineWidth = 0;
		}
	})
	

	function growTheLine(){
	growingInterval = setInterval(function(){
		lineWidth += increment;
		io.sockets.emit('shareLineWidth', lineWidth);
		// console.log(lineWidth);
	},loopTimer)
	}

}
