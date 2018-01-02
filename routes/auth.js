var express = require('express');
var router = express.Router();
var config = require('../config');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var User = require('./user');
var jwt = require('jsonwebtoken');
var responseBuilder = require('./responseBuilder');

var mongoUrl = config.mongoUrl;

mongoose.connect(mongoUrl);
autoIncrement.initialize(mongoose);

var LocationSchema = new mongoose.Schema({
    'name': String,
    'address': String,
    'city': String,
    'country': String,
    'traveling': false
});

LocationSchema.plugin(autoIncrement.plugin, 'Location');
var Location = mongoose.model('Location', LocationSchema);

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

// Location

router.get('/location/show', function (request, response) {
    Location.count(function (err, count) {
        if (!err && count === 0) {
            var locationToSave = new Location({
                name: 'E3 Cafe',
                address: '4 Cassia Park Road',
                city: 'Kingston 10',
                country: 'Jamaica',
                traveling: false
            });
            locationToSave.save(function (err) {
                Location.find(function (err, result) {
                    if (err) {
                        console.error(err);
                        response.json({'data': null, 'success': false})
                    }
                    response.render('location', { location: result[0] })
                });
            });
        } else {
            Location.find(function (err, result) {
                if (err) {
                    console.error(err);
                    response.json({'data': null, 'success': false})
                }
                response.render('location', { location: result[0] })
            });
        }
    });
});

router.get('/location/current', function (request, response) {
    Location.count(function (err, count) {
        if (!err && count === 0) {
            var locationToSave = new Location({
                name: 'E3 Cafe',
                address: '4 Cassia Park Road',
                city: 'Kingston 10',
                country: 'Jamaica'
            });
            locationToSave.save(function (err) {
                Location.find(function (err, result) {
                    if (err) {
                        console.error(err);
                        response.json({'data': null, 'success': false})
                    }
                    response.json({'data': result, 'success': true})
                });

            });
        } else {
            Location.find(function (err, result) {
                if (err) {
                    console.error(err);
                    response.json({'data': null, 'success': false})
                }
                response.json({'data': result, 'success': true})
            });
        }
    });
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

// Location
router.post('/location/update', function (request, response) {
    var data = request.body.data;
    Location.remove({}, function () {
        var status = saveLocation(data);
        var payload = responseBuilder.buildResponse(response, null, false);

        payload = responseBuilder.buildResponse(response, data, true);
        response.json(payload)
    })

});


function saveLocation(location) {
    var locationToSave = new Location(location);
    locationToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(locationToSave);
            return true;
        }
    });
}
module.exports = router;
