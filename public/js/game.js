/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,		// Local player
	remotePlayers,
	socket,
	mousePos;	


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
	    startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY);

	// The second parameter of io.connect is an options object.
	socket = io.connect("http://192.168.1.7", {port: 3000, transports: ["websocket"]});

	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};



/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	//Move Mouse
	canvas.addEventListener('mousemove', onLocalMouse, false);

	//listen for socket events and setup handlers
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("move mouse", onMoveMouse);
	socket.on("remove player", onRemovePlayer);
	
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

function onLocalMouse(e) {
	if (localPlayer) {
		mousePos = getMousePos(canvas, e);	
	};
};
// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
	console.log("Connected to socket server");
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
	console.log("New player connected: " + data.id);
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if(!movePlayer) {
		console.log("Player not found: " + data.id);
		return;
		};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

function onMoveMouse(data) {
	var mousePlayer = playerById(data.id);

	if(!mousePlayer) {
		console.log('Player: ' + data.id + ' attempted to move mouse but cannot be found.');
		return;
	};

	mousePlayer.setMouseX(data.x);
	mousePlayer.setMouseY(data.y);
};

function onRemovePlayer(data){
	var removePlayer = playerById(data.id);

	if(!removePlayer) {
		console.log("Player not found: " + data.id);
		return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/**************************************************
 ** GAME ANIMATION LOOP
 **************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};

/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	if(localPlayer.update(keys)) {
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};

	if(mousePos != null && localPlayer.mouseUpdate(mousePos)) {
		socket.emit("move mouse", {x: localPlayer.getMouseX(), y: localPlayer.getMouseY()});
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);

	var i;
	for(i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	};
};

/**************************************************
** MISC UTILITES
**************************************************/

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
	};
};

function playerById(id){
	var i;
	for(i = 0; i < remotePlayers.length; i++){
		if(remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	return false;
};

