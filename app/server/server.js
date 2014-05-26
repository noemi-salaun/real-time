'use strict';

var path = require('path');
var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Set global const.
global.ROOT_DIR = path.resolve(__dirname + '/../..');
global.APP_DIR = path.resolve(global.ROOT_DIR + '/app');
global.SERVER_DIR = path.resolve(global.APP_DIR + '/server');
global.PUBLIC_DIR = path.resolve(global.APP_DIR + '/public');
global.SHARED_DIR = path.resolve(global.APP_DIR + '/shared');
global.BOWER_DIR = path.resolve(global.ROOT_DIR + '/bower_components');

// Page routing.
app.get('/', function(req, res) {
  res.sendfile(global.SERVER_DIR + '/index.html');
});

// Static resources routing.
app.use('/public', express.static(global.PUBLIC_DIR));
app.use('/shared', express.static(global.SHARED_DIR));
app.use('/bower', express.static(global.BOWER_DIR));

var Game = require('./game');
var game = new Game(20, io.sockets, 200);
game.start();

// Start listening.
server.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});