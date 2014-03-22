/**************************************************
** GAME VARIABLES
**************************************************/
var stage,			// Canvas DOM element
	keys,			// Keyboard input
	localPlayer,		// Local player
	remotePlayers,
	socket,
	renderer,
	width,
	height;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the stage and rendering context
	stage = new PIXI.Stage(0x66FF99);
	width = $(window).width();
	height = $(window).height();

	renderer = PIXI.autoDetectRenderer(width,height);
	document.body.appendChild(renderer.view);

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(window.innerWidth-5)),
	    startY = Math.round(Math.random()*(window.innerHeight-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY, stage);
	requestAnimFrame(animate);

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

	//listen for socket events and setup handlers
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
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

function onResize(e) {
	// Maximise the renderer
	var screenW = window.innerWidth,
	screenH = window.innerHeight;
	renderer.resize(screenW,screenH);
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
	var newPlayer = new Player(data.x, data.y, stage);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
	console.log(newPlayer.getSamurai());
	stage.addChild(newPlayer.getSamurai());
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if(!movePlayer) {
		console.log("Player not found: " + data.id);
		return;
		};

	movePlayer.getSamurai().position.x = data.x;
	movePlayer.getSamurai().position.y = data.y;
};

function onRemovePlayer(data){
	var removePlayer = playerById(data.id);

	if(!removePlayer) {
		console.log("Player not found: " + data.id);
		return;
	};

	stage.removeChild(removePlayer.getSamurai());
	//Can't just do the above.
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/**************************************************
 ** GAME ANIMATION LOOP
 **************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	requestAnimFrame(animate);
};

/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	if(localPlayer.update(keys)) {
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};

};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Draw the sum of players
	renderer.render(stage);
};

/**************************************************
** MISC UTILITES
**************************************************/

function playerById(id){
	var i;
	for(i = 0; i < remotePlayers.length; i++){
		if(remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	return false;
};
