'use strict';

function Cube() {
  this.initialize();
}

Cube.prototype.initialize = function() {
  this.teleport = {
    enter: 200,
    travel: 100,
    leave: 200
  };
  this.states = {
    x: 200,
    y: 100,
    speed: 100,
    teleport: {
      inProgress: false
    }
  };
};

Cube.prototype.applyInput = function(input) {
  var interval = input.meta.interval;

  if (!this.states.teleport.inProgress && input.teleport) {
    // Initialize the teleportation.
    this.states.teleport = {
      inProgress: true,
      enter: 0,
      travel: 0,
      leave: 0
    };
  }
  // If teleportation is in progress.
  if (this.states.teleport.inProgress) {
    var tempInterval;
    // Consume interval time to advance the teleportation.
    if (interval > 0 && this.states.teleport.enter < this.teleport.enter) {
      tempInterval = Math.min(interval, this.teleport.enter - this.states.teleport.enter);
      this.states.teleport.enter += tempInterval;
      interval -= tempInterval;
    }
    if (interval > 0 && this.states.teleport.enter === this.teleport.enter && this.states.teleport.travel < this.teleport.travel) {
      tempInterval = Math.min(interval, this.teleport.travel - this.states.teleport.travel);
      this.states.teleport.travel += tempInterval;
      interval -= tempInterval;
    }
    if (this.states.teleport.travel === this.teleport.travel && this.states.teleport.leave === 0) {
      this.states.y -= 100;
    }
    if (interval > 0 && this.states.teleport.travel === this.teleport.travel && this.states.teleport.leave < this.teleport.leave) {
      tempInterval = Math.min(interval, this.teleport.leave - this.states.teleport.leave);
      this.states.teleport.leave += tempInterval;
      interval -= tempInterval;
    }
    if (this.states.teleport.leave >= this.teleport.leave) {
      this.states.teleport.inProgress = false;
    }
  }

  // Use the remaining time yo move.
  if (interval > 0) {
    this.states.y += (-input.up + input.down) * this.states.speed * interval / 1000;
    this.states.x += (-input.left + input.right) * this.states.speed * interval / 1000;
  }

};

module.exports = Cube;
