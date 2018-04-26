var socket = io();

var machine = document.querySelector('.machine');
var theLine = document.querySelector('.mi-linea');
var info = document.querySelector('.info');
var live = document.querySelector('.max-live');
var relive = document.querySelector('.re-live');
var actualSpeed = document.querySelector('.actual-speed');
relive.innerHTML = 'holas'

socket.on('workingMachinesCant', function(workingMachines, speed){
	machine.innerHTML = 'maquinas trabajando en la vida de la linea: '+workingMachines.length;
	actualSpeed.innerHTML = 'velocidad de vida de la linea: '+speed+'px por segundos';
})

socket.on('shareLineWidth', function(lineWidth){
	info.innerHTML = 'ancho de la linea: '+lineWidth+'px';
	theLine.style.width = ''+lineWidth+'px';
	// if (lineWidth === 50){
	// 	let voice = new p5.Speech
	// 	voice.speak('llegue a cincuenta adriana adriana adriana adriana adriana adriana');
	// } 
})

socket.on('printMaxLive', function(result){
	live.innerHTML = 'maximo trayecto de vida: '+result[0].maximo+'px'
})

socket.on('printRelive', function(result){
	relive.innerHTML = 'veces que ha resusitado la linea: '+result.length
})



