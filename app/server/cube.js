'use strict';

var cubeShare = require(global.SHARED_DIR + '/cube');

var colors = ['red', 'blue', 'green', 'grey'];

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  var random = Math.floor(Math.random() * (colors.length - 1));
  this.teleport = {
    enter: 200,
    travel: 100,
    leave: 200
  };
  this.states = {
    color: colors[random],
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
