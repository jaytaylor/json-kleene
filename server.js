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
//    https = require('https'),

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

var xform = function(htmlContent, callback) {
    var xformOpts = {
        output: false,
        strip: ['<button>'], //flags.isSet('strip') ? flags.get('strip') : [],
        pretty: true, //flags.isSet('pretty') ? flags.get('pretty') : false,
        numSpaces: 4, //flags.isSet('num-spaces') ? flags.get('num-spaces') : 4,
        skipEmpty: true, //flags.isSet('skip-empty') ? flags.get('skip-empty') : false
        callback: callback
    };
    kleene.transform(htmlContent, xformOpts);
};

var urlHandler = function(req, res) {
    //console.log(req);
    var url = (req.params && req.params[0]) ? req.params[0].replace(/^\/u\//, '') : req.query.url;

    rp({uri: url})
        .then(function(responseHtml) {
            responseHtml = responseHtml.replace(/^([^<]|<[^h]|<h[^t]|<ht[^m]|<htm[^l]|<html[^>])+/i, '');
            //console.log('responseHtml:');
            //console.dir(responseHtml);
            xform(responseHtml, function(jsonData) {
                //console.log('jsonResult:');
                //console.dir(jsonData);
                res.send(jsonData);
            });
        })
        .catch(console.error);

/*    var port = url.toLowerCase().split(':')[0] === 'https' ? 443 : 80;
    var hostname = url.replace(/^[^:]+:\/\/([^\/]+)\/.*$/, '$1');
    if (/:[1-9][0-9]*$/.test(hostname)) {
        port = parseInt(hostname.replace(/^[^:]+:/, ''));
    }
    var path = url.replace(/^[^\/]+\/\/[^\/]+(\/.*)$/, '$1');

    var get = port === 443 ? https.get : http.get;

    var htmlContent = '';

    get(url, function(response) {
        //console.log(response);
        if (response.statusCode >= 200 && response.statusCode <= 299) {
            console.log('RESPONSE: ' + url + ': OK status code=' + response.statusCode);
        } else {
            console.log('RESPONSE: ' + url + ': NON-OK response status code=' + response.statusCode + ', will respond with the error');
        }
    }).on('data', function(chunk) {
        console.log('CHUNK: ' + chunk);
        htmlContent += chunk;
    }).on('end', function(e) {
        console.log('END: all done!');
        xform(htmlContent, function(jsonData) {
            console.log('jsonResult:');
            console.log(jsonData);
            response.send(jsonData);
        });
    }).on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });*/

    /*var options = {
      hostname: hostname,
      port: port,
      path: path,
      method: 'GET',
      //This is the only line that is new. `headers` is an object with the headers to request
      headers: {} //'custom': 'Custom Header Demo works'}
    };

    console.log('OPTIONS: ');
    console.log(options);

    var r = http.request(options, function(response) {
        console.log('STATUS: ' + response.statusCode);

        var htmlContent = '';

        response.on('data', function(chunk) {
            console.log('CHUNK: ' + chunk);
            htmlContent += chunk;
        });

        response.on('end', function() {
            xform(function(jsonData) {
                response.send(jsonData);
            });
        });
    });

    r.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    r.end();*/
};

app.get('/u/:url', urlHandler);
app.get('/u', urlHandler);



// Now for the fun part!

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

