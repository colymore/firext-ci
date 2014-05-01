var build = require('../build');
var fs = require('fs');
var path = require('path');

var runBuild = function (params) {
    "use strict";

    var pushData = params.pushData;

    build({branch: pushData.branch},
        function (err, stdout, path) {

        });
};

module.exports = function (server) {
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
                messages: messages
            }
        };

        runBuild(runParams);
        res.send();
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

    server.post('/firext/generateRelease', generateRelease);
    server.get('/firext/getapk', getApk);
    server.get('/firext/getversion', getVersion);

};