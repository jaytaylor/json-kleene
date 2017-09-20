#!/usr/bin/env node
'use strict';

////
// This is the command-line json-kleene (json-*) application.
//
// If you're looking for where all the magic of this system happens, check out ./lib/kleene.js.
//
// If you're after the server, look in ./server.js.
//
// Cheers,
// Jay
// 2015-07-16
//

var fs = require('fs'),
    flags = require('flags'),
    kleene = require('./lib/kleene.js');

var cli = function() {
    // Define and parse command-line flag options.
    flags.defineString('output', '', 'Write output to <file> instead of stdout.');
    flags.defineBoolean('pretty', true, 'Pretty print JSON output.');
    flags.defineInteger('num-spaces', 4, 'Number of spaces to use for pretty-printed JSON output.');
    flags.defineBoolean('skip-empty', false, 'Writing output will be skipped if the generated JSON is empty.');
    flags.defineMultiString(
        'strip',
        null,
        'Specify jQuery-compatible filter criteria for element(s) to remove/eliminate.\ne.g.:\n    --strip button\n    --strip a,span --strip=button'
    );
    flags.defineBoolean('server', false, 'Starts in web-server mode.');

    flags.parse(null, false);

    if (flags.get('help')) {
        flags.help();
        return;
    }

    // Now for the fun part!

    // Read the HTML content
    var htmlContent = '';

    var opts = {
        output: flags.isSet('output') ? flags.get('output') : true,
        strip: flags.isSet('strip') ? flags.get('strip') : [],
        pretty: flags.isSet('pretty') ? flags.get('pretty') : false,
        numSpaces: flags.isSet('num-spaces') ? flags.get('num-spaces') : 4,
        skipEmpty: flags.isSet('skip-empty') ? flags.get('skip-empty') : false
    };

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        //console.log(chunk);
        if (typeof chunk !== 'undefined' && chunk !== null) {
            htmlContent += chunk;
        }
    });
    process.stdin.on('end', function() {
        kleene.transform(htmlContent, opts);
    });
};

if (process.argv && process.argv.length > 1 && process.argv[1].replace(/^.*\//, '') === 'json-kleene.js') {
    cli();
}
