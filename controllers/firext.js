var build = require('../build');
var fs = require('fs');
var firextRepository = require('../repositories/firextRepository'),
    gcm = require('../utils/gcm');
var runBuild = function (db, params) {
    "use strict";

    var pushData = params.pushData;

    build({branch: pushData.branch},
        function (err, stdout, path) {

        });
};

module.exports = function (db, server) {
    "use strict";

    var generateRelease = function (req, res) {
        "use strict";
        console.log(req.body);
        var data = req.body.payload;
        var json = JSON.parse(data);
        var author = json.user;
        var branch = json.commits[0].branch;
        var messages = [];

        json.commits.forEach(function (c) {
            messages.push(c.message);
        });

        var runParams = {
            pushData: {
                as: false,
                branch: branch,
                author: author,
                messages: []
            }
        };

        runBuild(db, runParams);

        var errorGcm = function (error) {
            next(error);
        };

        var successGcm = function () {
        };

        firextRepository.getAll(db, function (docs) {
            for (var i = 0; i < docs.length; i++) {
                gcm(docs[i].gcmId, 1, successGcm, errorGcm);
                console.log("GCM:" + docs[i].gcmId);
            }
            res.send();
        });
        res.send()
    };

    var getLog = function (req, res) {
        fs.readFile("./output.log", {encoding: "UTF8"}, function (err, data) {
            var result = {
                log: data
            };
            res.send(result);
        });
    };

    var getApk = function (req, res) {
        var apk = fs.readFileSync('./android/apk/Firext-release.apk');
        res.attachment('Firext.apk');
        res.end(apk);
    };

    var getVersion = function (req, res) {
        fs.readFile("./android/apk/version.txt", {encoding: "UTF8"}, function (err, data) {
            var result = {
                version: data
            };
            res.send(result);
        });
    };

    var registerGcm = function (req, res, next) {

        var data = req.body;

        var error = function (error) {
            next(error);
            log.error('tablet', 'registerGcm', error);
        };

        var success = function () {
            res.send({
                "status": "ok"
            });
        };

        firextRepository.updateGcm(db, data.deviceId, data.regId, success, error);
    };

    server.put('/firext/gcm', registerGcm);
    server.post('/firext/generateRelease', generateRelease);
    server.get('/firext/getapk', getApk);
    server.get('/firext/getversion', getVersion);
    server.get('/firext/getlog', getLog);

};