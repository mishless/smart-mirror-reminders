var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');

router.post('/register', function(request, response) {
    User.register(request.body.username, request.body.password, function(err, registeredUser) {
        if (err) {
            return response.status(500).json({
                err: err,
                msg: "Sorry. That username already exists. Try again."
            });
        }
        registeredUser.fullName = request.body.fullName;
        registeredUser.gender = request.body.gender;
        registeredUser.year = request.body.year;
        registeredUser.email = request.body.email;
        registeredUser.height = request.body.height;
        registeredUser.weight = request.body.weight;
        registeredUser.save();
        passport.authenticate('local')(request, response, function() {
            return response.status(200).json({
                status: 'Registration successful!',
                user: registeredUser
            });
        });
    });
});

router.post('/login', function(request, response, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return response.status(401).json({
                err: info
            });
        }
        request.logIn(user, function(err) {
            if (err) {
                return response.status(500).json({
                    err: 'Could not log in user'
                });
            }
            response.status(200).json({
                status: 'Login successful!',
                user: user
            });
        });
    })(request, response, next);
});

router.get('/logout', function(request, response) {
    request.logout();
    response.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(request, response) {
    if (!request.isAuthenticated()) {
        return response.status(200).json({
            status: false
        });
    }
    response.status(200).json({
        status: true,
        user: request.user.dataValues
    });
});

module.exports = router;
