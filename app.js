var express = require('express');
var server = express();
var path = require('path');

server.use(require('morgan')());
server.use(require('compression')());
server.use(require('method-override')());
server.use(require('body-parser')());
server.use(require('cookie-parser')());
server.use(express.static(path.join(__dirname, 'html')));

require('./controllers/firext')(server);

server.get('/', function (req, res) {
    var html_dir = './html/';
    res.sendfile(html_dir + 'index.html');
});

server.listen(8089);
