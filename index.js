'use strict'

var server = require('./server')
var port = process.env.PORT || 3000

server.listen(port, function () {
  console.log('API is running on port ' + port)
})


var db = require("./db")
const path = "./management/devices/data/devices.json";
var devicesData ={};

db.read(path).then(function(resolve, reject){
devicesData = resolve;
console.log(devicesData);
});
//var devicesData = db.save(path, "{deviceinfo}");
