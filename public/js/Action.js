var Action = function (oriX, oriY, timeStamp) {
  this.oriX = oriX;
  this.oriY = oriY;
  this.timeStamp = timeStamp;

 var getOriX = function(){
    return this.oriX;
  };

 var getOriY = function(){
    return this.oriY;
  };

 var getTimeStamp = function(){
    return this.timeStamp;
  };

}

MovementAction.prototype = new Action();
MovementAction.constructor = MovementAction;

var MovementAction = function(oriX, oriY, timeStamp, endStamp, key){
  Action.call(this, oriX, oriY, timeStamp);
  this.duration = timeStamp - endStamp;
  this.key = key;
}
