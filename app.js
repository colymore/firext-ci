var express = require('express');
var server = express();
var path = require('path');
var mongodb = require('mongodb');

server.use(require('morgan')());
server.use(require('compression')());
server.use(require('method-override')());
server.use(require('body-parser')());
server.use(require('cookie-parser')());
server.use(express.static(path.join(__dirname, 'html')));

var mongoClient = mongodb.MongoClient;

mongoClient.connect('mongodb://127.0.0.1/firext', function (err, db) {
    if (err) {
        throw err;
    }
    require('./controllers/firext')(db, server);
});


server.get('/', function (req, res) {
    var html_dir = './html/';
    res.sendfile(html_dir + 'index.html');
});

server.listen(8089);
