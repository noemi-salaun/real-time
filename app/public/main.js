/* globals Game, io */
'use strict';

var game = new Game();

var host = location.origin;
var socket = io.connect(host);

// Connexion au socket.
socket.on('connect', function() {

  socket.on('world', function(data) {
    game.cube.x = data.world.cube.position.x;
    game.cube.y = data.world.cube.position.y;
  });

  // Création du cube.
  socket.emit('newCube');

  var keyBind = {
    37: {action: 'left', press: false},
    38: {action: 'up', press: false},
    39: {action: 'right', press: false},
    40: {action: 'down', press: false}
  };

  document.onkeydown = function(e) {
    if (e.keyCode in keyBind) {
      e.preventDefault();
      if (!keyBind[e.keyCode].press) {
        keyBind[e.keyCode].press = true;
        socket.emit('input', {action: keyBind[e.keyCode].action, press: true});
      }
    }
  };
  document.onkeyup = function(e) {
    if (e.keyCode in keyBind) {
      e.preventDefault();
      keyBind[e.keyCode].press = false;
      socket.emit('input', {action: keyBind[e.keyCode].action, press: false});
    }
  };
});

