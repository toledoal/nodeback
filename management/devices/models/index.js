'use strict'

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const db = require("../../../db");
const devicesPath = "./management/devices/data/devices.json";
const usersPath = "./management/users/data/accounts.json";
const activityLog = "./management/users/data/activity_log.json";
const creationLog = "./management/users/data/creation_log.json";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', function (req, res) {
    db.read(devicesPath).then(function(resolve, reject){
        return res.json(resolve);
    }).catch(function(error) {
        console.error(error);
        return res.status(400).send({
            statusCode: 400,
            error: 'Bad request',
            message: 'Wrong File!'
          });
    });; 
  });




router.post('/new/:name', function (req, res) {
    if (!req.body.username) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad request',
        message: 'Not first name provided'
      });
    }
  
    var userName = req.body.username;
    var deviceName = req.params.name;


        db.idExist("name", deviceName, devicesPath).then(function(resolve, reject){
            console.log("It is there!" + resolve);
            if (resolve) {
                return res.status(400).send({
                  statusCode: 400,
                  error: 'Bad request',
                  message: 'The device name ' + deviceName + ' already exists'
                })
              }else{
                var newDevice = {
                    _id: uuid(),
                    name: deviceName,
                    owner: userName,
                    accessTo: [
                      {
                        user: userName
                      }
                    ],
                    locked: false,
                    createdAt: new Date(),
                    modifiedAt: new Date()
                  }

                  db.save(devicesPath, JSON.stringify(newDevice)).then(function(resolve, reject){
                    var activity = {type: "device created",createdAt: new Date(),devicename: deviceName,username: userName }
                    db.save(creationLog, JSON.stringify(activity)).then(function(resolve, reject){
                    }).catch(function(error) {console.error(error);}); 
                    return res.json({
                        success: true,
                        messages: 'Device created successfully',
                        user: newDevice
                      })
                }).catch(function(error) {
                    console.error(error);
                    return res.status(400).send({
                        statusCode: 400,
                        error: 'Bad request',
                        message: 'Something went wrong creatig device!'
                      }); }); 
  
              }

        }).catch((error) => {console.error(error);});

  });

  router.post('/:devicename/:status', function (req, res) {
    
   if (!req.body.username) {
        return res.status(400).send({
          statusCode: 400,
          error: 'Bad request',
          message: 'Not username provided'
        })
};

    var userName = req.body.username;
    var deviceName = req.params.devicename;
    var status = req.params.status == 'true' ? true : false;

    db.update(devicesPath, "name", deviceName, "locked", status ).then(function(resolve, reject){
        var activity = {type: "device update",createdAt: new Date(),devicename: deviceName,username: userName, locked: status }
        db.save(activityLog, JSON.stringify(activity)).then(function(resolve, reject){
        }).catch(function(error) {console.error(error);}); 
        return res.json({
            success: true,
            messages: 'Device updated successfully',
            user: userName
          })
    }).catch(function(error) {
        console.error(error);
        return res.status(400).send({
            statusCode: 400,
            error: 'Bad request',
            message: 'Something went wrong updating device!'
          }); }); 


  });
  
module.exports = router;
