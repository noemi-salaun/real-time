'use strict';
/* jshint unused: false */

(function(exports) {

  exports.calculateIntersection = function(rect1, rect2, x, y) {
    // prevent x|y from being null||undefined
    x = x || 0;
    y = y || 0;

    // first we have to calculate the
    // center of each rectangle and half of
    // width and height
    var dx, dy, r1 = {}, r2 = {};
    r1.hw = (rect1.width / 2);
    r1.hh = (rect1.height / 2);
    r1.cx = rect1.x + x + (r1.hw);
    r1.cy = rect1.y + y + (r1.hh);

    r2.hw = (rect2.width / 2);
    r2.hh = (rect2.height / 2);
    r2.cx = rect2.x + (r2.hw);
    r2.cy = rect2.y + (r2.hh);

    dx = Math.abs(r1.cx - r2.cx) - (r1.hw + r2.hw);
    dy = Math.abs(r1.cy - r2.cy) - (r1.hh + r2.hh);
    if (dx < 0 || dy < 0) {
      return {width: -dx, height: -dy, collision: (dx < 0 && dy < 0)};
    } else {
      return null;
    }
    
  };

})(typeof exports === 'undefined' ? this['utilsShare'] = {} : exports);