const http = require('http');

const server = http.createServer((req, res, next) => {

  res.writeHead(302, {
    'Location': 'http://sig.myvtmi.im'
  });

  res.end();
});


server.listen(process.env.port || process.env.PORT || 3978);
