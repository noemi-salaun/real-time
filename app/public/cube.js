'use strict';
/* global createjs */

(function(window) {
  var Cube = function() {
    this.initialize();
  };

  Cube.prototype = new createjs.Shape();

  Cube.prototype.Shape_initialize = Cube.prototype.initialize;

  Cube.prototype.initialize = function() {
    this.Shape_initialize();
    this.graphics.beginFill('red').drawRect(-20, -20, 40, 40);
    this.setBounds(-20, -20, 40, 40);
  };

  window.Cube = Cube;
}(window));