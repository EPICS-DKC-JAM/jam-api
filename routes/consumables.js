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
    'modifiers': Array,
    'size': Number,
    'category': String,
    'shot': {enabled: Boolean, price: Number},
    'cream': {enabled: Boolean, price: Number}
});


ConsumableSchema.plugin(autoIncrement.plugin, 'Consumable');
var Consumable = mongoose.model('Consumable', ConsumableSchema);

// Add consumable to database
router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = saveConsumable(data);
    var payload = responseBuilder.buildResponse(response, null, false);

    payload = responseBuilder.buildResponse(response, data, true);
    response.json(payload)
});

router.post('/upsert', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var query = {'_id': data._id};

    if (!data._id) {
        var status = saveConsumable(data);
        var payload = responseBuilder.buildResponse(response, null, false);

        payload = responseBuilder.buildResponse(response, data, true);
        response.json(payload)
    } else {
        Consumable.findOneAndUpdate(query, data, {upsert: false}, function (err, doc) {
            var payload = responseBuilder.buildResponse(response, err, false);

            if (err) {
                response.json(payload)
            } else {
                payload = responseBuilder.buildResponse(response, data, true);
                response.json(payload)
            }
        });
    }
});

// Get consumables raw from database
router.get('/getRaw/:id', function (request, response) {
    var payload = responseBuilder.buildResponse(response, null, false);

    if (request.params.id == 'all') {
        Consumable.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json(payload)
            }
            payload = responseBuilder.buildResponse(response, result, true);
            response.json(payload)
        });
    } else {
        Consumable.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                response.json(payload)
            }
            payload = responseBuilder.buildResponse(response, result, true);
            response.json(payload)
        });
    }
});

// Get consumables from database
router.get('/get/:id', function (request, response) {
    var payload = responseBuilder.buildResponse(response, null, false);

    if (request.params.id == 'all') {
        Consumable.find(function (err, result) {
            if (err) {
                console.error(err);
                payload = responseBuilder.buildResponse(response, 'Error getting consumable', false, err);
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
                    payload = responseBuilder.buildResponse(response, newResult, true);
                    response.json(payload)
                }
            };
        });
    } else {
        Consumable.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                payload = responseBuilder.buildResponse(response, 'Error getting consumable', false, err);
                response.json(payload);
            }

            prepareConsumable(result.toObject(), function (res) {
                payload = responseBuilder.buildResponse(response, res, true);
                response.json(payload)
            });
        });
    }
});

router.get('/delete/:id', function (request, response) {
    var query = {'_id': request.params.id};
    Consumable.remove(query, function (err, result) {
        if (err) {
            console.log(err);
            response.json({'data': null, 'success': false})
        }
        response.json({'data': result, 'success': true})
    });
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


    res.json({'success': 'OK'})
});


function prepareConsumable(consumable, callback) {
    var sizeId = consumable.size;
    var modifiersId = consumable.modifiers;


    sizes.getSizeById(sizeId, function (sizeResult) {
        var completed = 0;
        for (var i = 0; i < modifiersId.length; i++) {
            modifiers.getModifiersById(modifiersId, function (modifiersResult) {
                consumable.size = sizeResult.sizes;
                consumable.modifiers = consumable.modifiers.concat(modifiersResult.modifiers);
                completed++;
                if (completed == modifiersId.length) {
                    callback(consumable);
                }
            })
        }
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
