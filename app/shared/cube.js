(function(exports) {

  var teleport = {
    enter: 200,
    travel: 100,
    leave: 200
  };

  exports.getBounds = function(self) {
    var bounds = {x: self.states.x, y: self.states.y, width: 40, height: 40};
    return bounds;
  };

  exports.applyInput = function(self, input, world, shared) {
    var interval = input.meta.interval;

    if (!self.states.teleport.inProgress) {
      if (input.teleport) {
        var x = -input.left + input.right;
        var y = -input.up + input.down;
        if ((x !== 0 || y !== 0) && self.states.teleport.ready) {
          // Initialize the teleportation.
          self.states.teleport = {
            ready: false,
            inProgress: true,
            enter: 0,
            travel: 0,
            leave: 0,
            moved: false,
            x: x,
            y: y
          };
        }
        self.states.teleport.ready = false;
      } else {
        self.states.teleport.ready = true;
      }
    }

    // If teleportation is in progress.
    if (self.states.teleport.inProgress) {
      var tempInterval;
      // Consume interval time to advance the teleportation.
      if (interval > 0 && self.states.teleport.enter < teleport.enter) {
        tempInterval = Math.min(interval, teleport.enter - self.states.teleport.enter);
        self.states.teleport.enter += tempInterval;
        self.states.scale = 1 - (self.states.teleport.enter / teleport.enter);
        interval -= tempInterval;
      }
      if (interval > 0 && self.states.teleport.enter === teleport.enter && self.states.teleport.travel < teleport.travel) {
        tempInterval = Math.min(interval, teleport.travel - self.states.teleport.travel);
        self.states.teleport.travel += tempInterval;
        interval -= tempInterval;
      }
      if (self.states.teleport.travel === teleport.travel && !self.states.teleport.moved) {
        self.states.x += self.states.teleport.x * 100;
        self.states.y += self.states.teleport.y * 100;
        self.states.teleport.moved = true;
      }
      if (interval > 0 && self.states.teleport.travel === teleport.travel && self.states.teleport.leave < teleport.leave) {
        tempInterval = Math.min(interval, teleport.leave - self.states.teleport.leave);
        self.states.teleport.leave += tempInterval;
        self.states.scale = self.states.teleport.leave / teleport.leave;
        interval -= tempInterval;
      }
      if (self.states.teleport.leave >= teleport.leave) {
        self.states.teleport.inProgress = false;
      }
    }

    console.log(shared.cube.getBounds(self));

    self.states.hit = Math.max(self.states.hit - input.meta.interval, 0);
    self.states.fire = input.fire && !self.states.teleport.inProgress;
    if (self.states.fire) {
      var fBounds = {
        x: self.states.x + 120,
        y: self.states.y,
        width: 200,
        height: 4
      };
      console.log(fBounds);
      for (var i in world) {
        var cube = world[i];
        if (cube !== self) {
          var cBounds = shared.cube.getBounds(cube);
          var intersection = shared.utils.calculateIntersection(fBounds, cBounds);
          if (intersection !== null && intersection.collision) {
            cube.states.hit = 500;
          }
        }
      }
    }

    // Use the remaining time yo move.
    if (interval > 0) {
      var y = (-input.up + input.down) * self.states.speed * interval / 1000;
      var x = (-input.left + input.right) * self.states.speed * interval / 1000;
      if (x !== 0 || y !== 0) {
        for (var i in world) {
          var cube = world[i];
          if (cube !== self) {
            var sBounds = shared.cube.getBounds(self);
            var cBounds = shared.cube.getBounds(cube);
            var intersectionBefore = shared.utils.calculateIntersection(sBounds, cBounds);
            var intersectionAfter = shared.utils.calculateIntersection(sBounds, cBounds, x, y);

            if (intersectionAfter !== null && intersectionAfter.collision) {
              if (intersectionBefore !== null) {
                if (intersectionBefore.height > 0.1) {
                  // Horizontal alignement.
                  x -= x < 0 ? -intersectionAfter.width : intersectionAfter.width;
                }
                if (intersectionBefore.width > 0.1) {
                  // Vertical alignement.
                  y -= y < 0 ? -intersectionAfter.height : intersectionAfter.height;
                }
              } else {
                x -= x < 0 ? -intersectionAfter.width : intersectionAfter.width;
                y -= y < 0 ? -intersectionAfter.height : intersectionAfter.height;
              }
            }

          }
        }
        self.states.y += y;
        self.states.x += x;
      }

    }
    self.resetDisplay();
  };

})(typeof exports === 'undefined' ? this['cubeShare'] = {} : exports);