/* globals Game, io */
'use strict';

var host = location.origin;
var socket = io.connect(host);

// Connexion au socket.
socket.on('connect', function() {

  var game = new Game(socket);

  var keyBind = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  var keyHandler = function(e) {
    e = e || window.event;
    if (e.keyCode in keyBind) {
      e.preventDefault();
      game.input[keyBind[e.keyCode]] = (e.type === "keydown");
    }
  };

  document.body.onkeydown = keyHandler;
  document.body.onkeyup = keyHandler;
});

