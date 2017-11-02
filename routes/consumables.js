var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var responseBuilder = require('./responseBuilder');
var autoIncrement = require('mongoose-auto-increment');
var sizes = require('./sizes');
var modifiers = require('./modifiers');
var jsonify = require('jsonify');


// Mongo Object Declaration
var ConsumableSchema = new mongoose.Schema({
    'name': String,
    'description': String,
    'price': Number,
    'jslImage': String,
    'itemImage': String,
    'caffeine': Boolean,
    'modifiers': Number,
    'size': Number
});


ConsumableSchema.plugin(autoIncrement.plugin, 'Consumable');
var Consumable = mongoose.model('Consumable', ConsumableSchema);

// Add consumable to database
router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = saveConsumable(data);
    var payload = responseBuilder.buildResponse(response, null, 'error');

    payload = responseBuilder.buildResponse(response, data, 'success');
    response.json(payload)
});

router.post('/upsert', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var query = {'_id': data._id};

    if (data._id) {
        var status = saveConsumable(data);
        var payload = responseBuilder.buildResponse(response, null, 'error');

        payload = responseBuilder.buildResponse(response, data, 'success');
        response.json(payload)
    } else {
        Consumable.findOneAndUpdate(query, data, {upsert: false}, function (err, doc) {
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

// Get consumables raw from database
router.get('/getRaw/:id', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    var payload = responseBuilder.buildResponse(response, null, 'error');

    if (request.params.id == 'all') {
        Consumable.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json(payload)
            }
            payload = responseBuilder.buildResponse(response, result, 'success');
            response.json(payload)
        });
    } else {
        Consumable.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                response.json(payload)
            }
            payload = responseBuilder.buildResponse(response, result, 'success');
            response.json(payload)
        });
    }
});

// Get consumables from database
router.get('/get/:id', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    var payload = responseBuilder.buildResponse(response, null, 'error');

    if (request.params.id == 'all') {
        Consumable.find(function (err, result) {
            if (err) {
                console.error(err);
                payload = responseBuilder.buildResponse(response, 'Error getting consumable', 'error', err);
                response.json(payload);
            }

            var newResult = [];
            var waiting = 0;
            for (var i = 0; i < result.length; i++) {
                waiting++;
                prepareConsumable(result[i].toObject(), function (res) {
                    waiting--;
                    newResult.push(res);
                    complete();
                });
            }

            var complete = function () {
                if (waiting == 0) {
                    payload = responseBuilder.buildResponse(response, newResult, 'success');
                    response.json(payload)
                }
            };
        });
    } else {
        Consumable.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                payload = responseBuilder.buildResponse(response, 'Error getting consumable', 'error', err);
                response.json(payload);
            }

            prepareConsumable(result.toObject(), function (res) {
                payload = responseBuilder.buildResponse(response, res, 'success');
                response.json(payload)
            });
        });
    }
});

router.get('/testAdd', function (req, res) {

    var jamaicanJoe = {
        'name': 'Cup of Jamaican Joe',
        'description': 'The cup of Jamaican Joe is our rendition of the classic cup of Joe, one of the most popular drinks in the world. It has a slightly nutty, mellow flavor, as well as acidic, sweet, and winey nuances.',
        'price': 4.00,
        'jslImage': 'https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG',
        'itemImage': 'https://www.deafcancoffee.com/images/portfolio/IMG_6369.JPG',
        'caffeine': true,
        'modifiers': 0,
        'size:': 0
    };


    saveConsumable(jamaicanJoe);


    res.json({'status': 'OK'})
});


function prepareConsumable(consumable, callback) {
    var sizeId = consumable.size;
    var modifiersId = consumable.modifiers;

    sizes.getSizeById(sizeId, function (sizeResult) {
        modifiers.getModifiersById(modifiersId, function (modifiersResult) {
            consumable.size = sizeResult.sizes;
            consumable.modifiers = modifiersResult.modifiers;
            callback(consumable);
        })
    });
    //consumable.modifers = modifiers.getModifiersById(modifiersId);
}


function saveConsumable(consumable) {
    var consumableToSave = new Consumable(consumable);
    consumableToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(consumableToSave);
            return true;
        }
    });
}

module.exports = router;
