'use strict';

var fs = require("fs");

function read(path, filter, value) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path,{encoding:"utf-8"}, (err, data) => {
            if (err){
                reject(err);
            }else{
                var objects = data.split('|');
                var json = [];
                objects.forEach(function(item){
                     var parsedJson = JSON.parse(item);
                     if (filter && value == undefined){
                     json.push(parsedJson);
                     }else{
                         if (parsedJson[filter] === value )
                         {
                            json.push(parsedJson); 
                         }
                     }
                });
                var dat = { "root": json};
                resolve(dat);
            }            
        });
    });
};

function save(path, json) {
    return new Promise(function (resolve, reject) {
    fs.appendFile(path, `|${json}`, (err) => {
        if (err){
            reject.catch(err => console.log(err));
        }else{
            resolve({"response":"success"})
            console.log('The "data to append" was appended to file!');
        }
    });
    });
};

function update(path, type, id, key, value){
    return new Promise(function (resolve, reject) {

        fs.readFile(path,{encoding:"utf-8"}, (err, data) => {
            if (err){
                reject(err);
            }else{
                var objects = data.split('|');
                var json = "";
                objects.forEach(function(item){
                     var parsedJson = JSON.parse(item);
                     if (parsedJson[type] === id )
                     {
                         parsedJson[key]=value;
                     }
                     json += '|' + JSON.stringify(parsedJson);   

                });

                fs.writeFile(path, json.substring(1), (err) => {
                    if (err){
                        reject.catch(err => console.log(err));
                    }else{
                        resolve({"response":"success"})
                        console.log('The "data to update" was updated to file!');
                    }
                });
              

            }            
        });

    });  
};



function idExist(key, value, path){
    let idExists = false;
    return new Promise(function (resolve, reject) {
        fs.readFile(path,{encoding:"utf-8"}, (err, data) => {
            if (err){
                reject(err);
            }else{
                var objects = data.split('|');
                var json = [];
                objects.forEach(function(item){
                    console.log(JSON.parse(item)[key]);
                     if (JSON.parse(item)[key] === value){
                        idExists = true;;
                     }else{
                        idExists = false;
                     }
                });
                resolve(idExists);
            }            
        });
    });
};


module.exports = { "read": read, "save": save, "idExist": idExist, "update":update }


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