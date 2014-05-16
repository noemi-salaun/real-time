'use strict';

var Cube = require('./cube');

function Game(frequency, sockets) {
  this.initialize(frequency, sockets);
}

Game.prototype.initialize = function(frequency, sockets) {
  this.sockets = sockets;
  this.cube = null;
  this.timestep = (1 / frequency) * 1000;
  this.interval = null;
  this.lastTick = new Date().getTime();

  // Last processed input.
  this.lastProcessedInput = null;
};

Game.prototype.start = function() {
  var self = this;
  this.interval = setInterval(function() {
    self.tick();
  }, this.timestep);
};

Game.prototype.tick = function() {
  var current = new Date().getTime();

  if (this.cube instanceof Cube) {
    this.cube.process(this.lastTick, current);
  }

  this.broadcast();
  this.lastTick = current;
};

Game.prototype.broadcast = function() {
  this.sockets.emit('world', this.getWorld());
};

Game.prototype.stop = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
};

Game.prototype.handleInput = function(input) {
  this.cube.inputs.push(input);
};

Game.prototype.getWorld = function() {
  if (this.cube === null) {
    return null;
  } else {
    return {
      cube: this.cube.stats,
      lastProcessedInput: this.cube.lastProcessedInput
    };
  }
};

module.exports = Game;
