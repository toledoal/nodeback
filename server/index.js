'use strict'

// Instance for express
var express = require('express');
var app = express();

// Features
var users = require("../management/users/models")
var devices = require('../management/devices/models');

app.use('/users', users);
app.use('/devices', devices);

module.exports = app;