var Player = function(startX, startY) {
	var x = startX,
	    y = startY,
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

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getMouseX: getMouseX,
		getMouseY: getMouseY,
		setMouseX: setMouseX,
		setMouseY: setMouseY,
		id: id
	}
};

exports.Player = Player;
