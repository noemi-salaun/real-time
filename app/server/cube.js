'use strict';

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  //SHARED
  this.stats = {
    x: 200,
    y: 100,
    speed: 40
  };
  this.inputs = [];
};

Cube.prototype.validateInput = function() {
  /*input.forEach(function(key, value) {
    if (value > interval) {
      return false;
    }
  });*/
  return true;
};

Cube.prototype.process = function(start, stop) {
  var self = this;
  var interval = stop - start;
  this.inputs.forEach(function(input) {    
    if (self.validateInput(interval, input)) {
      self.stats.y += (-input.up + input.down) * self.stats.speed;
      self.stats.x += (-input.left + input.right) * self.stats.speed;
      self.lastProcessedInput = input.inputSequenceNumber;
    }
  });
  this.inputs = [];
};

module.exports = Cube;
