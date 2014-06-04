'use strict';

var cubeShare = require(global.SHARED_DIR + '/cube');
var utilsShare = require(global.SHARED_DIR + '/utils');

var colors = ['red', 'blue', 'green', 'grey'];

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  var random = Math.floor(Math.random() * (colors.length - 1));
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
  this.resetDisplay();
};

Cube.prototype.resetDisplay = function() {
  var self = this;
  this.display = {
    x: self.states.x,
    y: self.states.y,
    scale: self.states.scale
  };
};

Cube.prototype.applyInput = function(input, world) {
  var shared = {
    cube: cubeShare,
    utils: utilsShare
  };
  cubeShare.applyInput(this, input, world, shared);
};

module.exports = Cube;
