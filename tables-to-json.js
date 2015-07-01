#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    flags = require('flags'),
    $ = require('jquery')(require('jsdom').jsdom().parentWindow),
    t2j = require('./lib/jquery.tabletojson.js');

t2j.init($); // NB: Our special little hack to get it working server-side.


// Define and parse command-line flag options.
flags.defineString('output', '', 'Write output to <file> instead of stdout.');
flags.defineBoolean('pretty', true, 'Pretty print JSON output.');
flags.defineInteger('num-spaces', 4, 'Number of spaces to use for pretty-printed JSON output.');
flags.defineBoolean('skip-empty', false, 'Writing output will be skipped if the generated JSON is empty.');
flags.defineMultiString('strip', null, 'Specify jQuery-compatible filter criteria for element(s) to remove/eliminate.\ne.g.:\n    --strip button\n    --strip a,span --strip=button');
flags.defineBoolean('server', false, 'Starts in web-server mode.');

flags.parse(null, false);

if (flags.get('help')) {
    flags.help();
}

// Now for the fun part!

if (flags.get('server')) {
    // Server mode.

    throw 'not yet implemented';
    /*//We need a function which handles requests and send response
    function handleRequest(request, response) {
        //response.end('It Works!! Path Hit: ' + request.url);
        response.end($($('table')[0]).tableToJSON());
    }

    var PORT = 8080;

    //Create a server
    var server = http.createServer(handleRequest);

    //Lets start our server
    server.listen(PORT, function() {
        //Callback triggered when server is successfully listening. Hurray!
        console.log('Server listening on: http://localhost:%s', PORT);
    });
    */

} else {
    // Command-line mode.

    // Read the HTML content
    var htmlContent = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if (chunk !== null) {
            htmlContent += chunk;
        }
    });
    process.stdin.on('end', function() {
        convert();
    });

    // Convert all discovered tables to JSON.
    var convert = function() {
        $('html').html(htmlContent);

        if (flags.isSet('strip')) {
            var stripTags = flags.get('strip');
            for (var i = 0, len1 = stripTags.length; i < len1; ++i) {
                var tags = stripTags[i].split(',');
                for (var j = 0, len2 = tags.length; j < len2; ++j) {
                    $(tags[j]).html('');
                }
            }
        }

        var obj = $('table').tableToJSON();
        var data;
        if (flags.get('pretty')) {
            data = JSON.stringify(obj, null, flags.get('num-spaces'));
        } else {
            data = JSON.stringify(obj);
        }

        if (flags.get('skip-empty') && (data === '' || data === '[]' || data === '{}')) {
            process.exit(0);
        }

        if (flags.isSet('output')) {
            fs.writeFileSync(flags.get('output'), data); 
        } else {
            process.stdout.write(data);
        }
        process.exit(0);
    };
}

