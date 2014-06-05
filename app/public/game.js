'use strict';
/* global createjs, Cube */

var i = 0;

(function(window) {
  var Game = function(socket) {
    this.initialize(socket);
  };

  Game.prototype.initialize = function(socket) {
    this.id = i++;
    this.initCanvas();
    this.initSocket(socket);

    this.cube = null;
    this.others = {};

    // Input state.
    this.input = {
      up: false,
      down: false,
      right: false,
      left: false,
      teleport: false
    };

    this.pendingInputs = [];
    this.inputSequenceNumber = 0;
  };

  var handleTick;

  Game.prototype.initCanvas = function() {
    var self = this;

    this.stage = new createjs.Stage('mainCanvas');
    this.world = new createjs.Container();
    this.stage.addChild(this.world);

    createjs.Ticker.setFPS(60);

    handleTick = function() {
      self.tick();
    };
    createjs.Ticker.addEventListener('tick', handleTick);
  };

  Game.prototype.stop = function() {
    createjs.Ticker.removeEventListener('tick', handleTick);
  };

  Game.prototype.initSocket = function(socket) {
    this.socket = socket;
    this.serverMessages = [];
    var self = this;
    this.socket.emit('new', null, function(id) {
      self.cubeId = id;
      self.socket.on('world', function(data) {
        self.serverMessages.push(data);
      });
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
    var message;
    var lastProcessedInput = null;
    while (message = this.serverMessages.shift()) {
      for (var id in message) {
        var states = message[id];

        if (id === this.cubeId) {
          // Me.
          if (this.cube === null) {
            this.cube = new Cube(this.world);
          }
          this.cube.states = states.cube;
          lastProcessedInput = states.lastProcessedInput;
        } else {
          // The others.
          if (!(id in this.others)) {
            this.others[id] = new Cube(this.world);
          }
          if (window.ENTITY_INTERPOLATION) {
            this.others[id].states = states.cube;
            this.others[id].interpolate(states.interval);
          } else {
            this.others[id].states = states.cube;
            this.others[id].resetDisplay();
          }
        }
      }
    }

    if (this.cube !== null) {
      if (window.SERVER_RECONCILIATION) {
        if (lastProcessedInput !== null) {
          // Server Reconciliation. Re-apply all the inputs not yet processed by
          // the server.
          var i = 0;
          while (i < this.pendingInputs.length) {
            var input = this.pendingInputs[i];
            if (input.meta.inputSequenceNumber <= lastProcessedInput) {
              // Already processed. Its effect is already taken into account
              // into the world update we just got, so we can drop it.
              this.pendingInputs.splice(i, 1);
            } else {
              // Not processed by the server yet. Re-apply it.
              this.cube.applyInput(input, this.others);
              i++;
            }
          }
        }
      } else {
        this.cube.resetDisplay();
        // Reconciliation is disabled, so drop all the saved inputs.
        this.pendingInputs = [];
      }
    }
  };

  Game.prototype.processInputs = function() {
    // Compute interval since last update.
    var now = new Date().getTime();
    var last = this.last || now;
    var interval = now - last;
    this.last = now;

    // Package player's input.
    var input = {
      meta: {
        inputSequenceNumber: this.inputSequenceNumber++
      },
      up: this.input.up ? 1 : 0,
      right: this.input.right ? 1 : 0,
      down: this.input.down ? 1 : 0,
      left: this.input.left ? 1 : 0,
      teleport: this.input.teleport ? 1 : 0,
      fire: this.input.fire ? 1 : 0
    };

    this.socket.emit('input', input);

    input.meta.interval = interval;

    if (window.CLIENT_SIDE_PREDICTION) {
      this.cube.applyInput(input, this.others);
    }

    // Save this input for later reconciliation.
    this.pendingInputs.push(input);
  };

  Game.prototype.renderCanvas = function() {
    this.cube.renderCanvas();

    for (var id in this.others) {
      var other = this.others[id];
      other.renderCanvas();
    }

    this.stage.update();
  };

  window.Game = Game;
}(window));