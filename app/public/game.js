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
    this.others = {};

    // Input state.
    this.input = {
      up: false,
      down: false,
      right: false,
      left: false
    };

    this.pendingInputs = [];
    this.inputSequenceNumber = 0;
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
    while (message = this.serverMessages.shift()) {
      console.log(this.cubeId);
      for (var id in message) {
        var stats = message[id];
        console.log('id:' + id);

        if (id === this.cubeId) {
          
          console.log('MEEEEEE');
          // Me.
          if (this.cube === null) {
            this.cube = new Cube(this.world);
          }
          this.cube.stats = stats.cube;

          if (window.SERVER_RECONCILIATION) {
            // Server Reconciliation. Re-apply all the inputs not yet processed by
            // the server.
            var i = 0;
            while (i < this.pendingInputs.length) {
              var input = this.pendingInputs[i];
              if (input.inputSequenceNumber <= stats.lastProcessedInput) {
                // Already processed. Its effect is already taken into account
                // into the world update we just got, so we can drop it.
                this.pendingInputs.splice(i, 1);
              } else {
                // Not processed by the server yet. Re-apply it.
                this.cube.applyInput(input);
                i++;
              }
            }
          } else {
            // Reconciliation is disabled, so drop all the saved inputs.
            this.pendingInputs = [];
          }
        } else {
          // The others.
          if (!(id in this.others)) {
            this.others[id] = new Cube(this.world);
          }
          this.others[id].stats = stats.cube;
        }
      }

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

    input.inputSequenceNumber = this.inputSequenceNumber++;
    this.socket.emit('input', input);

    if (window.CLIENT_SIDE_PREDICTION) {
      this.cube.applyInput(input);
    }

    // Save this input for later reconciliation.
    this.pendingInputs.push(input);
  };

  Game.prototype.renderCanvas = function() {
    for (var id in this.others) {
      var other = this.others[id];
      other.renderCanvas();
    }
    this.cube.renderCanvas();
    this.stage.update();
  };

  window.Game = Game;
}(window));