var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoUrl = 'mongodb://localhost:27017/jam';

mongoose.connect(mongoUrl);
autoIncrement.initialize(mongoose);

var ConsumableSchema = new mongoose.Schema({
    'name': String,
    'description': String,
    'price': Number,
    'jslImage': String,
    'itemImage': String,
    'caffeine': Boolean,
    'modifiers': Number,
    'size:': Number
});

ConsumableSchema.plugin(autoIncrement.plugin, 'Consumable');
var Consumable = mongoose.model('Consumable', ConsumableSchema);

router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = saveConsumable(data);
    response.json({'data': data, 'success': status})
});

router.get('/get/:id', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");

    if (request.params.id == 'all') {
        Consumable.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    } else {
        Consumable.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
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
        'modifiers': -1,
        'size:': -1
    };

    saveConsumable(jamaicanJoe);

    res.json({'status': 'OK'})
});


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
