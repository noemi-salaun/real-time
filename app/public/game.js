'use strict';
/* global createjs, Cube */

(function(window) {
  var Game = function() {
    this.initialize();
  };

  Game.prototype.initialize = function() {
    var self = this;
    this.stage = new createjs.Stage('mainCanvas');
    this.world = new createjs.Container();
    this.stage.addChild(this.world);
    this.cube = new Cube();
    this.cube.x = 100;
    this.cube.y = 100;
    this.world.addChild(this.cube);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', function() {
      self.tick();
    });
  };

  Game.prototype.tick = function() {
    this.stage.update();
  };

  window.Game = Game;
}(window));