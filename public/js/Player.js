/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, stage) {
	var moveAmount = 2;
	var id;

	var texture = PIXI.Texture.fromImage("samurai.png");
	var samurai = new PIXI.Sprite(texture);
	samurai.position.y = startY;
	samurai.position.x = startX;
	stage.addChild(samurai);
		
		
	var getX = function(){
		return samurai.position.x;
	};

	var getY = function(){
		return samurai.position.y;
	}; 
	var setX = function(newX){
		samurai.position.x = newX;
	};
	var setY = function(newY){
		samurai.position.y = newY;
	};
	var getSamurai = function(){
		return samurai;
	};

	var update = function(keys) {
		var prevX = samurai.position.x;
		prevY = samurai.position.y;

		// Up key takes priority over down
		if (keys.up) {
			samurai.position.y -= moveAmount;
		} else if (keys.down) {
			samurai.position.y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			samurai.position.x -= moveAmount;
		} else if (keys.right) {
			samurai.position.x += moveAmount;
		};

		return (prevX != samurai.position.x || prevY != samurai.position.y) ? true : false;
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		id: id,
		getSamurai:getSamurai,
		update: update
	}
};
