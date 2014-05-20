'use strict';

var Cube = require('./cube');

function Game(frequency, sockets, lag) {
  this.lag = lag || false;
  this.initialize(frequency, sockets);
}

Game.prototype.initialize = function(frequency, sockets) {
  this.lastId = 0;
  this.cubes = [];
  this.lastProcessedInput = [];

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
  this.tickInterval = (now - last) / 1000.0;
  this.lastTick = now;

  this.processInputs();
  this.broadcast();
};

Game.prototype.initSockets = function(sockets) {
  this.sockets = sockets;
  this.serverMessages = [];
  var self = this;
  this.sockets.on('connection', function(socket) {
    socket.on('new', function(data, callback) {
      var socketId = socket.id;
      self.cubes[socketId] = new Cube();

      socket.on('input', function(data) {
        data.meta.id = socketId;
        self.handleInput(data);
      });

      callback(socketId);
    });
  });

};

Game.prototype.validateInput = function(input) {
  // Check if all inputs time is under the input interval.
  for (var key in input) {
    if (key !== 'meta') {
      if (input[key] > input.meta.interval) {
        return false;
      }
    }
  }

  return true;
};

Game.prototype.handleInput = function(input) {
  // Lag simulation on demand.
  var self = this;
  if (this.lag) {
    setTimeout(function() {
      self.serverMessages.push(input);
    }, this.lag);
  } else {
    this.serverMessages.push(input);
  }
};

Game.prototype.processInputs = function() {
  // Process all pending messages from clients.
  var message;
  while (message = this.serverMessages.shift()) {

    // Update the state of the entity, based on its input.
    // We just ignore inputs that don't look valid; this is what prevents
    // clients from cheating.
    if (this.validateInput(message)) {
      this.cubes[message.meta.id].applyInput(message);
      this.lastProcessedInput[message.meta.id] = message.meta.inputSequenceNumber;
    } else {
      console.log('CHEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAT !!!!!!!!!!!!!!');
    }
  }
};

Game.prototype.broadcast = function() {
  this.sockets.emit('world', this.getWorld());
};

Game.prototype.getWorld = function() {
  var result = {};
  for (var id in this.cubes) {
    var cube = this.cubes[id];
    result[id] = {
      cube: cube.stats,
      lastProcessedInput: this.lastProcessedInput[id]
    };
  }
  return result;
};

module.exports = Game;
