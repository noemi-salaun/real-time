(function(exports) {

  exports.applyInput = function(self, input) {
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
      self.states.y += (-input.up + input.down) * self.states.speed * interval / 1000;
      self.states.x += (-input.left + input.right) * self.states.speed * interval / 1000;
    }

  };

})(typeof exports === 'undefined' ? this['cubeShare'] = {} : exports);