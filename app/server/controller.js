'use strict';

/* jshint unused: false */

var Cube = require('./cube');
var Game = require('./game');

var controller = {
  initialize: function(frequency, sockets) {
    this.game = new Game(frequency, sockets);
  },
  start: function() {
    this.game.start();
  },
  stop: function() {
    this.game.stop();
  },
  newCube: function() {
    this.game.cube = new Cube();
  },
  handleInput: function(input) {
    var self = this;
    setTimeout(function() {
      self.game.handleInput(input);
    }, 500);
  }
};


module.exports = controller;