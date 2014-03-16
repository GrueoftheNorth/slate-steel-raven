/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		moveAmount = 2,
		id,
		mousePosX = startX,
		mousePosY = startY;

	var getX = function(){
		return x;
	};

	var getY = function(){
		return y;
	}; 
	var setX = function(newX){
		x = newX;
	};
	var setY = function(newY){
		y = newY;
	};

	var getMouseY = function(){
		return mousePosY;
	};

	var getMouseX = function(){
		return mousePosX;
	};

	var setMouseX = function(newX){
		mousePosX = newX;
	};

	var setMouseY = function(newY){
		mousePosY = newY;
	};

	var mouseUpdate = function(mousePos) {
		var prevX = mousePosX,
		    prevY = mousePosY;
		
		mousePosX = mousePos.x;
		mousePosY = mousePos.y;

		return (prevX != mousePosX || prevY != mousePosY) ? true: false;
	};
	var update = function(keys) {
		var prevX = x;
		prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};

		return (prevX != x || prevY != y) ? true : false;
	};


	var draw = function(ctx) {
		ctx.fillRect(x-5, y-5, 10, 10);
		ctx.fillRect(mousePosX-2,mousePosY-2, 4, 4);
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getMouseX: getMouseX,
		getMouseY: getMouseY,
		setMouseX: setMouseX,
		setMouseY: setMouseY,
		id: id,
		update: update,
		mouseUpdate: mouseUpdate,
		draw: draw
	}
};
