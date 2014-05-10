var ObjectID = require('mongodb').ObjectID;

var updateGcm = function (db, deviceId, gcmId, success, error) {
    "use strict";
    var collection = db.collection('firext');
    collection.update(
        { "_id": new ObjectID(deviceId) },
        { $set: { "gcmId": gcmId } },
        {upsert: true},
        function (e) {
            if (e) {
                error(e);
            }

            success();
        });
};

var getAll = function (db, success, error) {
    "use strict";
    var collection = db.collection('firext');
    collection.find(function (e, result) {
        if (e) {
            error(e);
        }
        result.toArray(function (e2, docs) {
            if (e2) {
                error(e2);
                return;
            }
            success(docs);
        });
    });
};

module.exports = {
    updateGcm: updateGcm,
    getAll: getAll
};