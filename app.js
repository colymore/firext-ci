/**
 * @typedef {Object} pushData
 * @property {string} branch La rama que hay que clonar
 * @property {string} author El autor del push
 * @property {Array} messages Los mensajes de los commits del push
 */

/**
 * @typedef {Object} runParams
 * @property {pushData} pushData
 * @property {bool} sendMail
 */

var express = require('express');
var server = express();
var build = require('./build');
var logger = require('morgan');
var compress = require('compression');
var fs = require('fs');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
server.use(logger());
server.use(compress());
server.use(methodOverride());
server.use(bodyParser());
server.use(cookieParser());


/**
 * Ejecuta una build con los parametros especificados
 * @param {runParams} params
 */
var runBuild = function (params) {
    "use strict";

    var pushData = params.pushData;

    build({branch: pushData.branch},
        function (err, stdout, path) {

        });
};

server.post('/AndroidCIServer', function (req, res) {
    "use strict";

    var data = req.body.payload;

    /**
     * @property {Array} commits
     */
    var json = JSON.parse(data);

    /**
     * @type {string}
     */
    var author = json.user;

    /**
     * @type {string}
     */
    var branch = json.commits[0].branch;

    /**
     * @type {Array}
     * */
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
});

server.get('/', function(req, res) {
    res.render('Colymore.es', { title: 'Express' });
});

server.get('/firextapk',function(req,res){
var apk = fs.readFileSync('./android/apk/Firext-release.apk');
     	//res.writeHead(200, {'Content-Type': 'application/vnd.android.package-archive' });
	res.attachment('Firext.apk');
	res.end(apk, 'binary');
});
server.listen(8089);

runBuild({
    pushData: {
        branch: 'master'
    }
});
