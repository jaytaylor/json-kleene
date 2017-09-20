#!/usr/bin/env iojs
'use strict';

////
// This is the server code for the json-kleene (json-*) web-application.
//
// If you're looking for where all the magic of this system happens, check out ./lib/kleene.js.
//
// If you're after the client, look in ./json-kleene.js.
//
// Cheers,
// Jay
// 2015-07-16
//

var http = require('http'),
    express = require('express'),
    rp = require('request-promise'),
    kleene = require('./lib/kleene.js');

var app = express();
var router = express.Router();
var path = __dirname + '/views/';

router.use(function(req, res, next) {
    console.log('/' + req.method);
    next();
});

app.get('/', function(req, res) {
    res.sendFile(path + 'index.html');
});

var urlHandler = function(request, response) {
    // console.log(request);
    var url = request.params && request.params.url ? request.params.url : request.query.url;

    rp({ uri: url }) // , resolveWithFullResponse: true })
        .then(function(html) {
            // html = html.replace(/^([^<]|<[^h]|<h[^t]|<ht[^m]|<htm[^l]|<html[^>])+/i, '');
            //console.log('html:');
            //console.dir(html);
            // console.log('hi /' + JSON.stringify(html) + '/');
            var jsonData = kleene.transform(html);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(jsonData);
            response.end();
        })
        .catch(function(err) {
            console.error(err);
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(err));
            response.end();
        });
};

app.get('/u/:url', urlHandler);
app.get('/u', urlHandler);

app.use('/', router);

/*app.use('*', function(req, res) {
    //console.log(req);
    res.sendFile(path + '404.html');
});*/

var server = app.listen(process.env.PORT || 8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening on ' + host + ':' + port);
});
