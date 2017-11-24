'use strict';

var fs = require("fs");

function read(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path,{encoding:"utf-8"}, (err, data) => {
            if (err){
                reject(err);
            }else{
                resolve({ root: JSON.parse(data) });
            }            
        });
    });
}

function save(path, json) {
    return new Promise(function (resolve, reject) {
    fs.appendFile(path, json, (err) => {
        if (err){
            reject(err);
        }else{
            resolve({"response":"success"})
            console.log('The "data to append" was appended to file!');
        }
    });
    });
}


module.exports = { "read": read, "save": save }


/*HOW TO USE THIS 

// Get db
var db = require("./db")

// Find correct the path to save or read
const path = "./management/devices/data/devices.json";

var devicesData ={};

//  Call the function as a Promise and set the then to do what you need in the API
db.read(path).then(function(resolve, reject){
devicesData = resolve;
console.log(devicesData);
});

// Same for Save
db.read(path, jsondata).then(function(resolve, reject){
console.log(resolve);
});


*/