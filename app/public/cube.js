'use strict';
/* global createjs */

(function(window) {
  var Cube = function(world) {
    this.initialize(world);
  };

  Cube.prototype = new createjs.Shape();

  Cube.prototype.Shape_initialize = Cube.prototype.initialize;

  Cube.prototype.initialize = function(world) {
    this.Shape_initialize();

    this.stats = null;

    this.graphics.beginFill('red').drawRect(-20, -20, 40, 40);
    this.setBounds(-20, -20, 40, 40);
    world.addChild(this);
  };

  Cube.prototype.renderCanvas = function() {
    this.x = this.stats.x;
    this.y = this.stats.y;
  };

  Cube.prototype.applyInput = function(input) {
    this.stats.y += (-input.up + input.down) * this.stats.speed;
    this.stats.x += (-input.left + input.right) * this.stats.speed;
  };

  window.Cube = Cube;
}(window));