'use strict';

var Cube = require('./cube');

function Game(frequency, sockets, lag) {
  this.lag = lag || false;
  this.initialize(frequency, sockets);
}

Game.prototype.initialize = function(frequency, sockets) {
  this.cube = null;

  this.initSockets(sockets);

  this.timestep = (1 / frequency) * 1000;
};

Game.prototype.start = function() {
  var self = this;
  this.interval = setInterval(function() {
    self.tick();
  }, this.timestep);
};

Game.prototype.stop = function() {
  if (this.interval) {
    clearInterval(this.interval);
  }
};

Game.prototype.tick = function() {
  var now = new Date().getTime();
  var last = this.lastTick || now;
  this.interval = (now - last) / 1000.0;
  this.lastTick = now;

  this.processInputs();
  this.broadcast();
};

Game.prototype.initSockets = function(sockets) {
  this.sockets = sockets;
  this.serverMessages = [];
  var self = this;
  this.sockets.on('connection', function(socket) {
    if (self.cube === null) {
      self.cube = new Cube();
    }
    socket.on('input', function(data) {
      // Lag simulation on demand.
      if (self.lag) {
        setTimeout(function() {
          self.serverMessages.push(data);
        }, self.lag);
      } else {
        self.serverMessages.push(data);
      }
    });
  });

};

Game.prototype.validateInput = function(/* input */) {
  // this.interval
  return true;
};

Game.prototype.processInputs = function() {
  // Process all pending messages from clients.
  var message;
  while (message = this.serverMessages.shift()) {

    // Update the state of the entity, based on its input.
    // We just ignore inputs that don't look valid; this is what prevents
    // clients from cheating.
    if (this.validateInput(message)) {
      this.cube.applyInput(message);
      this.lastProcessedInput = message.inputSequenceNumber;
    }
  }
};

Game.prototype.broadcast = function() {
  this.sockets.emit('world', this.getWorld());
};

Game.prototype.getWorld = function() {
  if (this.cube === null) {
    return null;
  } else {
    return {
      cube: this.cube.stats,
      lastProcessedInput: this.lastProcessedInput
    };
  }
};

module.exports = Game;
