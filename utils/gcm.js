var GCM = require('gcm').GCM;

var apiKey = 'AIzaSyCY-MWEWRlk6bvzZJcastb7H7eIcxyJO2g';
var gcm = new GCM(apiKey);

module.exports = function (gcmId, version, success, error) {
    "use strict";

    var message = {
        registration_id: gcmId,
        collapse_key: 'newVersion',
        'data.action': 'newVersionAvaiable',
        'data.orderId': version
    };

    gcm.send(message, function (e, messageId) {
        if (e) {
            error(e);
        } else {
            success(messageId);
        }
    });

};