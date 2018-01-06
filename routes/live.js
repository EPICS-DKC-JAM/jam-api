var express = require('express');
var router = express.Router();
var sizes = require('./sizes');
var modifiers = require('./modifiers');
var jsonify = require('jsonify');
var shortid = require('shortid');

router.get('/initialize', function (request, response, next) {
    response.io.emit("receiveItems", cart);
    response.send({data: cart});
});

router.get('/delete/:id', function (request, response) {
    var id = request.params.id;
    var index=cart.map(function(x){ return x.id; }).indexOf(id);
    cart.splice(index,1);

    response.io.emit("receiveItems", cart);
    response.send({data: cart});
});

router.post('/add', function (request, response) {
    request.body['id'] = shortid.generate();
    cart = cart.concat(request.body);

    response.io.emit("receiveItems", cart);
    response.send({data: cart});
});

module.exports = router;
