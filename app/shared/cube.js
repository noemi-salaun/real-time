(function(exports) {

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
      if (interval > 0 && self.states.teleport.enter < self.teleport.enter) {
        tempInterval = Math.min(interval, self.teleport.enter - self.states.teleport.enter);
        self.states.teleport.enter += tempInterval;
        self.states.scale = 1 - (self.states.teleport.enter / self.teleport.enter);
        interval -= tempInterval;
      }
      if (interval > 0 && self.states.teleport.enter === self.teleport.enter && self.states.teleport.travel < self.teleport.travel) {
        tempInterval = Math.min(interval, self.teleport.travel - self.states.teleport.travel);
        self.states.teleport.travel += tempInterval;
        interval -= tempInterval;
      }
      if (self.states.teleport.travel === self.teleport.travel && !self.states.teleport.moved) {
        self.states.x += self.states.teleport.x * 100;
        self.states.y += self.states.teleport.y * 100;
        self.states.teleport.moved = true;
      }
      if (interval > 0 && self.states.teleport.travel === self.teleport.travel && self.states.teleport.leave < self.teleport.leave) {
        tempInterval = Math.min(interval, self.teleport.leave - self.states.teleport.leave);
        self.states.teleport.leave += tempInterval;
        self.states.scale = self.states.teleport.leave / self.teleport.leave;
        interval -= tempInterval;
      }
      if (self.states.teleport.leave >= self.teleport.leave) {
        self.states.teleport.inProgress = false;
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
              if (intersectionBefore !== null && !intersectionBefore.collision) {
                if (intersectionBefore.height > 0 && intersectionBefore.width > 0) {
                  console.log('PROBLEME');
                }
                if (intersectionBefore.height > 0) {
                  // Horizontal alignement.
                  x -= x < 0 ? -intersectionAfter.width : intersectionAfter.width;
                } else {
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

  };

})(typeof exports === 'undefined' ? this['cubeShare'] = {} : exports);