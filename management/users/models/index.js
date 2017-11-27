'use strict'

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const db = require("../../../db");
const usersPath = "./management/users/data/accounts.json";
const activityLog = "./management/users/data/activity_log.json";
const creationLog = "./management/users/data/creation_log.json";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



router.get('/', function (req, res) {
    db.read(usersPath).then(function(resolve, reject){
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



router.get('/activity/:username', function (req, res) {
    var userName = req.params.username;
    db.read(activityLog, "username",userName ).then(function(resolve, reject){
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


router.post('/new/:username', function (req, res) {
    if (!req.body.first_name) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad request',
        message: 'Not first name provided'
      })
    }
  
    if (!req.body.last_name) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad request',
        message: 'Not last name provided'
      })
    }
  
    var userName = req.params.username;
   

    db.idExist("username",userName, usersPath).then(function(resolve, reject){
        console.log("Is is there!" + resolve);
        if (resolve) {
            return res.status(400).send({
              statusCode: 400,
              error: 'Bad request',
              message: 'The username ' + userName + ' already exists'
            })
          }else{
            var newUser = {
                _id: uuid(),
                username: userName,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: "1234",
                sex: (!req.body.sex) ? null : req.body.sex
              }

              db.save(usersPath, JSON.stringify(newUser)).then(function(resolve, reject){
                var activity = {type: "user created",createdAt: new Date(),username: userName};
                db.save(creationLog, JSON.stringify(activity)).then(function(resolve, reject){
                }).catch(function(error) {console.error(error);});   
                return res.json({
                      success: true,
                      messages: 'User created successfully',
                      user: newUser
                    });
              }).catch(function(error) {
                  console.error(error);
                  return res.status(400).send({
                      statusCode: 400,
                      error: 'Bad request',
                      message: 'Something went wrong creating new user!'
                    }); }); 

                
                   

          }
    }).catch((error) => {console.error(error);});
    
    
  



  });
  
  module.exports = router;