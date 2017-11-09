var express = require('express');
var router = express.Router();
var responseBuilder = require('./responseBuilder');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var exports = module.exports = router;


// Mongo declarations
var ModifierSchema = new mongoose.Schema({
    'modifiers': Array
});

ModifierSchema.plugin(autoIncrement.plugin, 'Modifier');
var Modifier = mongoose.model('Modifier', ModifierSchema);


// Modifiers Rest API Calls
router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = exports.saveModifiers(data);
    response.json({'data': data, 'success': status})
});

// Upsert Modifier
router.post('/upsert', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var query = {'_id': data._id};

    if (!data._id) {
        var status = exports.saveModifiers(data);
        var payload = responseBuilder.buildResponse(response, null, 'error');

        payload = responseBuilder.buildResponse(response, data, 'success');
        response.json(payload)
    } else {
        Modifier.findOneAndUpdate(query, data, {upsert: false}, function (err, doc) {
            var payload = responseBuilder.buildResponse(response, err, 'error');

            if (err) {
                response.json(payload)
            } else {
                payload = responseBuilder.buildResponse(response, data, 'success');
                response.json(payload)
            }
        });
    }
});

router.get('/get/:id', function (request, response) {
    if (request.params.id == 'all') {
        Modifier.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    } else {
        Modifier.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    }
});

router.get('/testAdd', function (req, res) {

    var modifiers = {
        'modifiers': ['mocha', 'vanilla', 'ice', 'no ice']
    };

    exports.saveModifiers(modifiers);

    res.json({'status': 'OK'})
});

router.get('/delete/:id', function(request, response) {
    var query = {'_id': id};
    Modifier.remove(query, function (err, result) {
        if (err) {
            console.log(err);
            response.json({'data': null, 'success': false})
        }
        response.json({'data': result, 'success': true})
    });
});

// Modifiers Controller Calls
exports.getModifiersById = function (id, callback) {
    Modifier.findById(id, function (err, result) {
        if (err) {
            console.error(err);
            callback(null);
        }
        callback(result)
    });
};

exports.saveModifiers = function (modifier) {
    var ModifierToSave = new Modifier(modifier);
    ModifierToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(modifier);
            return true;
        }
    });
};

