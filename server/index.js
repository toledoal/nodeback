'use strict'

// Instance for express
var express = require('express');
var app = express();

// Features
var users = require('../management/users');
var devices = require('../management/devices');

app.use('/users', users);
app.use('/devices', devices);

module.exports = app;