var arduino = require('duino');
var board   = new arduino.Board({debug: true});
var http    = require('http');
var url     = require('url');
var fs      = require('fs');
var qs      = require('querystring');

board.on('ready', function() {
  console.log('Connected to Arduino board');

  console.log('Starting web server...');
  http.createServer(function (request, response) {

    var render = function(filename, contentType) {
      var content = fs.readFileSync(filename);
      response.writeHead(200, {'Content-Type': contentType});
      response.end(content);
    };

    var method = request.method.toUpperCase();
    var uri    = url.parse(request.url, true);
    var match  = null;

    if (method === 'GET' && uri.pathname === '/') {
      render('index.html', 'text/html');
    }

    match = uri.pathname.match(/^\/css\/([^\/]+)$/);
    if (method === 'GET' && match) {
      render('css/'+match[1], 'text/css');
    }

    match = uri.pathname.match(/^\/js\/([^\/]+)$/);
    if (method === 'GET' && match) {
      render('js/'+match[1], 'application/javascript');
    }

    if (method === 'POST') {
      var body = '';
      request.on('data', function (data) {
        body +=data;
      });
      request.on('end',function(){
        params = qs.parse(body);
        console.log("Passkey sent: " + params.passkey);

        board.digitalWrite(7, "2713");

        render('index.html', 'text/html');
      });
    }

  }).listen(1337, '127.0.0.1');
  console.log('Server running at http://127.0.0.1:1337/');
});

// board.on('data', function(m) {
//   console.log(m);
// });

