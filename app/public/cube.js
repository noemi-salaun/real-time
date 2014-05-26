'use strict';
/* global createjs, cubeShare, utilsShare */

(function(window) {

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
    this.filled = false;
    this.interpolation = null;

    this.setBounds(-20, -20, 40, 40);
    world.addChild(this);
  };

  Cube.prototype.renderCanvas = function() {
    if (!this.filled) {
      this.graphics.beginFill(this.states.color).drawRect(-20, -20, 40, 40);
      this.filled = true;
    }
    if (this.interpolation !== null) {
      this.scaleX = this.interpolation.scale;
      this.scaleY = this.interpolation.scale;
      this.x = this.interpolation.x;
      this.y = this.interpolation.y;
    } else {
      this.scaleX = this.states.scale;
      this.scaleY = this.states.scale;
      this.x = this.states.x;
      this.y = this.states.y;
    }
  };

  Cube.prototype.applyInput = function(input, world) {
    var shared = {
      cube: cubeShare,
      utils: utilsShare
    };
    cubeShare.applyInput(this, input, world, shared);
  };

  Cube.prototype.interpolate = function(states, time) {
    var self = this;
    createjs.Tween.removeTweens(this);
    var threshold = Math.min(1, time / 200);
    var scale = states.scale < threshold ? 0 : states.scale;
    this.interpolation = this.states;
    this.states = states;

    var callback = function() {
      self.interpolation = null;
    };

    if (scale < 1) {
      createjs.Tween.get(this.interpolation).to({scale: scale}, time, createjs.Ease.linear).call(callback);
    } else {
      createjs.Tween.get(this.interpolation).to({x: states.x, y: states.y, scale: scale}, time, createjs.Ease.linear).call(callback);
    }

  };

  window.Cube = Cube;
}(window));