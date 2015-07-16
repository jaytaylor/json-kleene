#!/usr/bin/env iojs
'use strict';

var fs = require('fs'),
    jsdom = require('jsdom'),
    t2j = require('./jquery.tabletojson.js');

var jquerySrc = fs.readFileSync('./lib/jquery.js', 'utf-8');


// Transform all discovered HTML tables into JSON.
var transform = function(htmlContent, opts) {

    var jsonData;

    jsdom.env({
        html: htmlContent,
        //:['http://code.jquery.com/jquery.js'],
        src: [jquerySrc],
        done: function(errors, window) {
            if (errors) {
                console.log('errors:');
                console.dir(errors);
                return;
            }
            //window.$('html').html(htmlContent);
            t2j.init(window.$); // NB: Our special little hack to get it working server-side here in node-land.

            if (opts.strip) {
                var stripTags = opts.strip;
                for (var i = 0, len1 = stripTags.length; i < len1; ++i) {
                    var tags = stripTags[i].split(',');
                    for (var j = 0, len2 = tags.length; j < len2; ++j) {
                        //console.log('tags[' + j + '] = /' + tags[j] + '/');
                        window.$(tags[j]).html('');
                    }
                }
            }

            var obj = window.$('table').tableToJSON();
            if (opts.pretty) {
                jsonData = JSON.stringify(obj, null, opts.numSpaces || 4);
            } else {
                jsonData = JSON.stringify(obj);
            }

            if (opts.skipEmpty && (jsonData === '[]' || jsonData === '{}')) {
                jsonData = '';
            }

            if (typeof opts.output === 'string') {
                fs.writeFileSync(opts.output, jsonData);
            } else if (opts.output) { // Assume they want is to write to stdout.
                //console.log('jsonData='+jsonData);
                process.stdout.write(jsonData);
            } else if (opts.callback) {
                opts.callback(jsonData);
            } else {
                console.log(jsonData);
                return jsonData;
            }
        }
    });
};

exports.transform = transform;

