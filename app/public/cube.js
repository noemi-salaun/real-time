'use strict';
/* global createjs, cubeShare, utilsShare */

(function(window) {

  var Cube = function(world) {
    this.initialize(world);
  };

  Cube.prototype = new createjs.Shape();

  Cube.prototype.Shape_initialize = Cube.prototype.initialize;

  Cube.prototype.initialize = function(world) {
    this.Shape_initialize();

    // The real server states, use by physics.
    this.states = null;

    // The drawn states.
    this.display = null;

    this.notFilled = true;
    this.setBounds(-20, -20, 40, 40);
    world.addChild(this);
  };

  Cube.prototype.renderCanvas = function() {
    if (this.notFilled) {
      this.graphics.beginFill(this.states.color).drawRect(-20, -20, 40, 40);
      delete this.notFilled;
    }
    this.scaleX = this.display.scale;
    this.scaleY = this.display.scale;
    this.x = this.display.x;
    this.y = this.display.y;
  };

  Cube.prototype.resetDisplay = function() {
    var self = this;
    this.display = {
      x: self.states.x,
      y: self.states.y,
      scale: self.states.scale
    };
  };

  Cube.prototype.applyInput = function(input, world) {
    var shared = {
      cube: cubeShare,
      utils: utilsShare
    };
    cubeShare.applyInput(this, input, world, shared);
  };

  Cube.prototype.interpolate = function(time) {
    createjs.Tween.removeTweens(this);
    var threshold = Math.min(1, time / 200);
    var scale = this.states.scale < threshold ? 0 : this.states.scale;


    createjs.Tween.get(this.display).to({x: this.states.x, y: this.states.y, scale: scale}, time, createjs.Ease.linear);

  };

  window.Cube = Cube;
}(window));