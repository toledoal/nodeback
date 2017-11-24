'use strict';

var fs = require("fs");

function read(path) {

    fs.readFile(path, (err, data) => {
        if (err) throw err;
        console.log(data);
    });

    var json_wrapper = { root: data}

    return json_wrapper;
}

function save(path, json) {


    fs.appendFile(path, json, (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });

}


module.exports = { "read": read, "save": save }


/*var db = require('../../../db');
const path = "../data/devices.json";
var devicesData = db.read(path);
var devicesData = db.save(path, "{deviceinfo}");
console.log(devicesData);*/