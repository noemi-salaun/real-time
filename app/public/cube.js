'use strict';
/* global createjs, cubeShare */

(function(window) {
  var colors = ['red', 'blue', 'green', 'grey'];

  var Cube = function(world) {
    this.initialize(world);
    this.teleport = {
      enter: 200,
      travel: 100,
      leave: 200
    };
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
    this.scaleX = this.states.scale;
    this.scaleY = this.states.scale;
    this.x = this.states.x;
    this.y = this.states.y;
  };

  Cube.prototype.applyInput = function(input) {
    cubeShare.applyInput(this, input);
  };

  Cube.prototype.interpolate = function(states, time) {
    createjs.Tween.removeTweens(this);
    var threshold = time / 200;
    var scale = states.scale < threshold ? 0 : states.scale;
    createjs.Tween.get(this.states).to({x: states.x, y: states.y, scale: scale}, time, createjs.Ease.linear);
  };

  window.Cube = Cube;
}(window));