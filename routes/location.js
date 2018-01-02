//var express = require('express');
//var router = express.Router();
//var responseBuilder = require('./responseBuilder');
//var jsonify = require('jsonify');
//var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-auto-increment');
//
//var LocationSchema = new mongoose.Schema({
//    'name': String,
//    'address': String,
//    'city': String,
//    'country': String
//});
//
//LocationSchema.plugin(autoIncrement.plugin, 'Location');
//var Location = mongoose.model('Location', LocationSchema);
//
//
//router.get('/update', function (request, response) {
//    var data = request.body.data;
//    Location.remove({}, function () {
//        var status = saveLocation(data);
//        var payload = responseBuilder.buildResponse(response, null, false);
//
//        payload = responseBuilder.buildResponse(response, data, true);
//        response.json(payload)
//    })
//
//});
//
//router.get('/current', function (request, response) {
//    Location.count(function (err, count) {
//        if (!err && count === 0) {
//            var locationToSave = new Location({
//                name: 'E3 Cafe',
//                address: '4 Cassia Park Road',
//                city: 'Kingston 10',
//                country: 'Jamaica'
//            });
//            locationToSave.save(function (err) {
//                Location.find(function (err, result) {
//                    if (err) {
//                        console.error(err);
//                        response.json({'data': null, 'success': false})
//                    }
//                    response.json({'data': result, 'success': true})
//                });
//            });
//        }
//        Location.find(function (err, result) {
//            if (err) {
//                console.error(err);
//                response.json({'data': null, 'success': false})
//            }
//            response.json({'data': result, 'success': true})
//        });
//    });
//});
//
//function saveLocation(location) {
//    var locationToSave = new Location(location);
//    locationToSave.save(function (err) {
//        if (err) {
//            console.log(err);
//            return false;
//        }
//        else {
//            console.log(locationToSave);
//            return true;
//        }
//    });
//}
//module.exports = router;
