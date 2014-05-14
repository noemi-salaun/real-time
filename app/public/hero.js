'use strict';
/* global createjs */

(function(window) {
  var Hero = function() {
    this.initialize();
  };

  Hero.prototype = new createjs.Shape();

  Hero.prototype.Shape_initialize = Hero.prototype.initialize;

  Hero.prototype.initialize = function() {
    this.Shape_initialize();
    this.graphics.beginFill('red').drawRect(-20, -20, 40, 40);
    this.setBounds(-20, -20, 40, 40);
  };

  window.Hero = Hero;
}(window));