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

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Welcome to the JAM API home page! There is nothing here. No work has been done. Oops.');
});

router.get('/get/all', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

router.post('/authenticate', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({success: false, message: 'Authentication failed.'});
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Authentication failed.'});
            } else {
                const payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, config.sercret, {
                    expiresIn: 60 * 60 * 24 * 7 // expires in 7 days
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

module.exports = router;
