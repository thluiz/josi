var http = require('http');
var server = http.createServer(function (req, res, next) {
    res.writeHead(302, {
        'Location': 'http://sig.myvtmi.im'
    });
    res.end();
});
server.listen(process.env.port || process.env.PORT || 3978);
