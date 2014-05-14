'use strict';

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  this.position = {x: 200, y: 100}; // px
  this.speed = 40;
  this.velocity = {x: 0, y: 0}; // px/s
  this.lifeTime = 0;
  this.inputs = [];
};

Cube.prototype.tick = function(interval) {
  this.lifeTime += interval;
  this.position.x += (this.velocity.x * interval / 1000);
  this.position.y += (this.velocity.y * interval / 1000);
};

Cube.prototype.process = function(start, stop) {
  var self = this;
  var lastInputTime = start;
  this.inputs.forEach(function(input) {
    var interval = input.time - lastInputTime;
    self.tick(interval);
    switch (input.action) {
      case 'up':
        self.velocity.y += input.press ? -self.speed : self.speed;
        break;
      case 'down':
        self.velocity.y += input.press ? self.speed : -self.speed;
        break;
      case 'right':
        self.velocity.x += input.press ? self.speed : -self.speed;
        break;
      case 'left':
        self.velocity.x += input.press ? -self.speed : self.speed;
        break;
    }
    lastInputTime = input.time;
  });
  this.inputs = [];
  var interval = stop - lastInputTime;
  this.tick(interval);
};

module.exports = Cube;
