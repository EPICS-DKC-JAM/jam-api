var express = require('express');
var router = express.Router();
var config = require('../config');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var User = require('./user');
var jwt = require('jsonwebtoken');

var mongoUrl = config.mongoUrl;

mongoose.connect(mongoUrl);
autoIncrement.initialize(mongoose);


router.get('/me', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.sercret, function (err, decoded) {
            if (err) {
                res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                res.json({success: true, message: 'You are authenticated'});
            }
        });

    } else {
        res.json({
            success: false,
            message: 'No token provided.'
        });
    }
});


/* GET home page. */
router.post('/auth', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({success: false, message: 'Incorrect username or password'});
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Incorrect username or password'});
            } else {
                const payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, config.sercret, {
                    expiresIn: 60 * 60 * 24 * 7 // expires in 7 days
                });

                res.json({
                    success: true,
                    message: 'App has been authenticated!',
                    token: token
                });
            }
        }
    });
});

// Middleware to verify token
router.use(function (req, res, next) {
    if (config.env == 'dev') {
        next();
    } else {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, config.sercret, function (err, decoded) {
                if (err) {
                    res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
});

module.exports = router;
