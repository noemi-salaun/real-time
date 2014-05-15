'use strict';
/* global createjs, Cube */

(function(window) {
  var Game = function(socket) {
    this.initialize(socket);
  };

  Game.prototype.initialize = function(socket) {
    this.initCanvas();
    this.initSocket(socket);

    this.cube = null;

    // Input state.
    this.input = {
      up: false,
      down: false,
      right: false,
      left: false
    };
  };

  Game.prototype.initCanvas = function() {
    var self = this;

    this.stage = new createjs.Stage('mainCanvas');
    this.world = new createjs.Container();
    this.stage.addChild(this.world);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', function() {
      self.tick();
    });
  };

  Game.prototype.initSocket = function(socket) {
    this.socket = socket;
    this.serverMessages = [];
    var self = this;
    self.socket.on('world', function(data) {
      self.serverMessages.push(data);
    });
  };

  Game.prototype.tick = function() {
    // Process server messages.
    this.processServerMessages();

    if (this.cube === null) {
      return;  // Not connected yet.
    }

    // Process inputs.
    this.processInputs();

    // Render the world.
    this.renderCanvas();
  };

  Game.prototype.processServerMessages = function() {
    while (true) {
      var message = this.serverMessages.shift();
      if (!message) {
        break;
      }

      if (this.cube === null) {
        this.cube = new Cube(this.world);
      }

      this.cube.stats = message.cube;
    }
  };

  Game.prototype.processInputs = function() {
    // Compute interval since last update.
    var now = new Date().getTime();
    var last = this.last || now;
    var interval = (now - last) / 1000.0;
    this.last = now;

    // Package player's input.
    var input = {
      up: this.input.up ? interval : 0,
      right: this.input.right ? interval : 0,
      down: this.input.down ? interval : 0,
      left: this.input.left ? interval : 0
    };

    this.socket.emit('input', input);
  };

  Game.prototype.renderCanvas = function() {
    this.cube.renderCanvas();
    this.stage.update();
  };

  window.Game = Game;
}(window));