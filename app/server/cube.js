'use strict';

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  this.stats = {
    x: 200,
    y: 100,
    speed: 40
  };
};

Cube.prototype.applyInput = function(input) {
  this.stats.y += (-input.up + input.down) * this.stats.speed;
  this.stats.x += (-input.left + input.right) * this.stats.speed;
};

module.exports = Cube;
