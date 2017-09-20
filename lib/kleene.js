'use strict';

// var fs = require('fs'),
//     jsdom = require('jsdom/lib/old-api'),
//     t2j = require('./jquery.tabletojson.js'),
//     jquerySrc = fs.readFileSync('./lib/jquery.js', 'utf-8');

var himalaya = require('himalaya');

// Transform all discovered HTML tables into JSON.
var transform = function(htmlContent) {
    var json = himalaya.parse(htmlContent),
        out = JSON.stringify(json);
    return out;
};

exports.transform = transform;
