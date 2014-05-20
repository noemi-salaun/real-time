'use strict';
/* global createjs */

(function(window) {
  var colors = ['red', 'blue', 'green', 'grey'];

  var Cube = function(world) {
    this.initialize(world);
  };

  Cube.prototype = new createjs.Shape();

  Cube.prototype.Shape_initialize = Cube.prototype.initialize;

  Cube.prototype.initialize = function(world) {
    this.Shape_initialize();

    this.states = null;
    var random = Math.floor(Math.random() * (colors.length - 1));
    this.graphics.beginFill(colors[random]).drawRect(-20, -20, 40, 40);
    this.setBounds(-20, -20, 40, 40);
    world.addChild(this);
  };

  Cube.prototype.renderCanvas = function() {
    this.x = this.states.x;
    this.y = this.states.y;
  };

  Cube.prototype.applyInput = function(input) {
    this.states.y += (-input.up + input.down) * this.states.speed;
    this.states.x += (-input.left + input.right) * this.states.speed;
  };

  Cube.prototype.interpolate = function(states, time) {
    createjs.Tween.removeTweens(this);
    createjs.Tween.get(this.states).to({x: states.x, y: states.y}, time, createjs.Ease.linear);
  };

  window.Cube = Cube;
}(window));