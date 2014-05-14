'use strict';
/* global createjs, Hero */

(function(window) {
  var Game = function() {
    this.initialize();
  };

  Game.prototype.initialize = function() {
    var self = this;
    this.stage = new createjs.Stage('mainCanvas');
    this.world = new createjs.Container();
    this.stage.addChild(this.world);
    this.hero = new Hero();
    this.hero.x = 100;
    this.hero.y = 100;
    this.world.addChild(this.hero);

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