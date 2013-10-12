var http    = require('http');
var url     = require('url');
var fs      = require('fs');
var qs      = require('querystring');

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/tty.usbserial-A700ew3I", {
  baudrate: 9600
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });


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

        serialPort.write(params.passkey, function(err, results) {
          console.log('err ' + err);
          console.log('results ' + results);
        });

        render('index.html', 'text/html');
      });
    }

  }).listen(1337);
  console.log('Server running at http://127.0.0.1:1337/');

});
