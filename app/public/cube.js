'use strict';
/* global createjs, cubeShare */

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
    
    this.setBounds(-20, -20, 40, 40);
    world.addChild(this);
  };

  Cube.prototype.renderCanvas = function() {
    if (!this.filled) {
      this.graphics.beginFill(this.states.color).drawRect(-20, -20, 40, 40);
      this.filled = true;
    }
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
    var threshold = Math.min(1, time / 200);
    var scale = states.scale < threshold ? 0 : states.scale;
    if (scale < 1) {
      createjs.Tween.get(this.states).to({scale: scale}, time, createjs.Ease.linear);
      if (states.teleport.moved) {
        this.states.x = states.x;
        this.states.y = states.y;
      }
    } else {
      createjs.Tween.get(this.states).to({x: states.x, y: states.y, scale: scale}, time, createjs.Ease.linear);
    }

  };

  window.Cube = Cube;
}(window));