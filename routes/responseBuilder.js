var exports = module.exports = {};

exports.buildResponse = function prepareResponse(response, content, success, errorMsg) {
    var response = {
        'status': 'error',
        'message': 'Error generating response',
        'data': ''
    };

    if (!success) {
        response.message = content;
        delete response.data;
        return response
    } else {
        response.status = success;
        response.data = content;
        delete response.message;
        return response
    }
};