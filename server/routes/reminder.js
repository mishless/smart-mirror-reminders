var express = require('express');
var router = express.Router();
var passport = require('passport');

var Reminder = require('../models/reminder.js');

router.get('/:id', function(request, response) {
    if (!request.isAuthenticated()) {
        return response.status(200).json({
            authenticated: false
        });
    }
    var userId = request.params.id;
    Reminder.findAll({
        where: {
            userId: userId
        }
    }).then(function(reminders) {
        console.log(reminders);
        return response.status(200).json({
            authenticated: true,
            reminders: reminders
        });
    });
});

router.post('/:id', function(request, response) {
    var reminderId = request.params.id;
    if (!request.isAuthenticated()) {
        return response.status(200).json({
            authenticated: false
        });
    }
    Reminder.update(request.body, {
            where: {
                id: request.body.id
            }
        })
        .then(function(data) {
            console.log(data);
            response.status(200).json({
                authenticated: true,
                data: data
            });
        }).catch(function(err) {
            console.log(err);
            response.status(200).json({
                authenticated: true,
                err: err
            });
        });
});

router.put('/', function(request, response) {
    if (!request.isAuthenticated()) {
        return response.status(200).json({
            authenticated: false
        });
    }
    Reminder.create(request.body).then(function(data) {
        response.status(200).json({
            authenticated: true,
            reminder: data.dataValues
        });
    });
});

router.delete('/:id', function(request, response) {
    var reminderId = request.params.id;
    if (!request.isAuthenticated()) {
        return response.status(200).json({
            authenticated: false
        });
    }
    Reminder.findOne({
        where: {
            id: reminderId
        }
    }).then(function(reminder) {
        reminder.destroy().then(function(data) {
            response.status(200).json({
                deleted: true
            });
        }).catch(function(data) {
            response.status(200).json({
                deleted: false
            });
        }).catch(function(data) {
            response.status(200).json({
                deleted: false
            });
        });
    });
});

module.exports = router;
