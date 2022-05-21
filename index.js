require('dotenv').config()
global.log = require('./Utilities/Logger')
const httpProxy = require('http-proxy')
const EventEmitter = require('events')
const fs = require('fs')

global.serverup = new EventEmitter();

// below options are not needed if your server is not a https
let options = {
  cert: fs.readFileSync('./CERT/server.crt'),
  key: fs.readFileSync('./CERT/server.key'),
  requestCert: true,
  rejectUnauthorized: false
}


const MY_WEBSOCKET_SERVER = 'http://localhost:3030';
var proxy = httpProxy.createProxyServer({ target: MY_WEBSOCKET_SERVER, ws: true });

//use http if not a https server
proxyServer = require('https').createServer(options, function(req, res) {
  let subUrl = req.url.replace('/',"")
  log.info(`URL_REQUESTED ${subUrl}`)
  let targetUrl = {}

  try {
    if (subUrl.includes('myApp')) {
      targetUrl = {
        target: process.env.MY_APP_URL,
        application: 'MyApplication'
      }
      // Can Add Multiple servers
    }

    log.info(`PROXY_TARGET_URL ${targetUrl.target}`)
    proxy.web(req, res, {
      target: targetUrl.target
    })
    proxy.on('error', function (err, req, res) {
      console.log(err);
      log.info('SERVICE_FAILED')
      log.info(`${targetUrl.application} is not working, please start the service`)

    });
  } catch (e) {
    log.info('Error In Proxy Server')
    log.info(e)
  }
});

proxyServer.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

proxyServer.listen(8443, () => {
  log.info(`Application listening on port 8443`)
});
