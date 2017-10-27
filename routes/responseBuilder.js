var exports = module.exports = {};

exports.buildResponse = function prepareResponse(response, content, type, errorMsg) {
    var response = {
        'status': 'error',
        'message': 'Error generating response',
        'data': ''
    };

    if (type === 'error') {
        response.message = content;
        delete response.data;
        return response
    } else if (type === 'success' || type === 'fail') {
        response.status = type;
        response.data = content;
        delete response.message;
        return response
    } else {
        delete response.data;
        return response
    }
};