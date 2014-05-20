'use strict';

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  this.states = {
    x: 200,
    y: 100,
    speed: 100
  };
};

Cube.prototype.applyInput = function(input) {
  this.states.y += (-input.up + input.down) * this.states.speed;
  this.states.x += (-input.left + input.right) * this.states.speed;
};

module.exports = Cube;
