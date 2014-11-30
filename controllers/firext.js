var build = require('../build');
var fs = require('fs');

var runBuild = function (params) {
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
        fs.truncate('./output.log', 0, function(){console.log('done')});
        console.log("Llamada a generateRelease");
        console.log(req.body);
        var branch = 'master'
        var runParams = {
            pushData: {
                branch: branch
            }
        };

        runBuild(runParams);
        res.send()
    };

    var getLog = function (req, res) {
        console.log("Llamada a getLog");

        fs.readFile("./output.log", {encoding: "UTF8"}, function (err, data) {
            var result = {
                log: data
            };
            res.send(result);
        });
    };

    var getApk = function (req, res) {
        console.log("Llamada a getAPK");

        var apk = fs.readFileSync('./android/apk/Firext-release.apk');
        res.attachment('Firext.apk');
        res.end(apk);
    };

    var getVersion = function (req, res) {
        console.log("Llamada a getVersion");

        fs.readFile("./android/apk/version.txt", {encoding: "UTF8"}, function (err, data) {
            var result = {
                version: data
            };
            res.send(result);
        });
    };

    var registerGcm = function (req, res, next) {
        console.log("Llamada a registerGCM");

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