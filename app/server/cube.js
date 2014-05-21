'use strict';

var cubeShare = require(global.SHARED_DIR + '/cube');

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  this.teleport = {
    enter: 200,
    travel: 100,
    leave: 200
  };
  this.states = {
    x: 200,
    y: 100,
    speed: 100,
    scale: 1,
    teleport: {
      ready: true,
      inProgress: false
    }
  };
};

Cube.prototype.applyInput = function(input) {
  cubeShare.applyInput(this, input);
};

module.exports = Cube;
