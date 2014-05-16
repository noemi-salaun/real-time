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

/* jshint unused: false */
function updateParameters() {
  var cb_prediction = document.getElementById("prediction");
  var cb_reconciliation = document.getElementById("reconciliation");
  var cb_interpolation = document.getElementById("interpolation");

  // Client Side Prediction disabled => disable Server Reconciliation.
  if (window.CLIENT_SIDE_PREDICTION && !cb_prediction.checked) {
    cb_reconciliation.checked = false;
  }

  // Server Reconciliation enabled => enable Client Side Prediction.
  if (!window.SERVER_RECONCILIATION && cb_reconciliation.checked) {
    cb_prediction.checked = true;
  }

  window.CLIENT_SIDE_PREDICTION = cb_prediction.checked;
  window.SERVER_RECONCILIATION = cb_reconciliation.checked;
  window.ENTITY_INTERPOLATION = cb_interpolation.checked;
}

