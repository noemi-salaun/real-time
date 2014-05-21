'use strict';
/* global createjs */

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
    this.x = this.states.x;
    this.y = this.states.y;
  };

  Cube.prototype.applyInput = function(input) {
    var self = this;
    if (this.states.teleport) {
      // Nothing else during teleportation.
    } else {
      if (input.teleport) {
        this.states.teleport = true;
        setTimeout(function() {
          // Enter teleportation.
          setTimeout(function() {
            // Teleportation.
            self.states.y -= 100;
            setTimeout(function() {
              // Leave teleportation.
              self.states.teleport = false;
            }, self.teleport.leave);
          }, self.teleport.travel);
        }, self.teleport.enter);
      } else {
        this.states.y += (-input.up + input.down) * this.states.speed * input.meta.interval / 1000;
        this.states.x += (-input.left + input.right) * this.states.speed * input.meta.interval / 1000;
      }
    }
  };

  Cube.prototype.interpolate = function(states, time) {
    createjs.Tween.removeTweens(this);
    createjs.Tween.get(this.states).to({x: states.x, y: states.y}, time, createjs.Ease.linear);
  };

  window.Cube = Cube;
}(window));