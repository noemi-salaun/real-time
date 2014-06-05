'use strict';

var cubeShare = require(global.SHARED_DIR + '/cube');
var utilsShare = require(global.SHARED_DIR + '/utils');

var colors = ['red', 'blue', 'green'];

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  var random = Math.floor(Math.random() * (colors.length));
  this.states = {
    hit: 0,
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
    scale: self.states.scale,
    hit: self.states.hit,
    fire: self.states.fire
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
