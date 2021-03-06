Real Time
=========
[![Dependency Status](https://david-dm.org/Duvo/real-time.svg?theme=shields.io)](https://david-dm.org/Duvo/real-time)
[![devDependency Status](https://david-dm.org/Duvo/real-time/dev-status.svg?theme=shields.io)](https://david-dm.org/Duvo/real-time#info=devDependencies)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> JS implementation of online multiplayer game architecture. Based on [Gabriel Gambetta tutorial](http://www.gabrielgambetta.com/fast_paced_multiplayer.html).

## Installation

### Requirements

- Node.js - [nodejs.org](http://nodejs.org/)
- npm - [www.npmjs.org](https://www.npmjs.org/)

### Clone the repository

    git clone https://github.com/Duvo/real-time
    
### Install Node modules dependencies

    npm install
    
### To build, test, make coffee and start the server

    npm start

It is possible to setup the refresh rate and latency in the file [`app/server/server.js`](https://github.com/Duvo/real-time/blob/master/app/server/server.js) :

    var game = new Game(<refresh rate>, io.sockets, <latency>);

## Todos

- [x] ~~Client-side prediction~~
- [x] ~~Server reconciliation~~
- [x] ~~Separate client~~
- [x] ~~Multiplayer~~
- [x] ~~Interpolation~~
- [x] ~~Collision~~
  - [x] ~~Server side~~
  - [x] ~~Prediction~~
  - [x] ~~Reconciliation~~
  - [x] ~~Bugs~~
    - [x] ~~Dodge from bot to top~~
    - [x] ~~Flickering with reconciliation~~
- [x] ~~Fire !!!~~
- [ ] Lag compensation
