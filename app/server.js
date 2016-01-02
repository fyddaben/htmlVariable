var http = require('http');

var ip = require('ip');

var log4js = require('log4js');

var dispatcher = require('httpdispatcher');

var path = require('path');

log4js.configure('hv_log4js_configuration.json', { cwd: path.normalize(__dirname + "/../log/")});

var logger = log4js.getLogger('server_log');

//Lets define a port we want to listen to
const PORT=3000;

//We need a function which handles requests and send response
function handleRequest(request, response){
  try {
    //log the request on console
    logger.info('request url:', request.url);

    //Disptach
    dispatcher.dispatch(request, response);
  } catch(err) {
    logger.error(err);
  }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
  //Callback triggered when server is successfully listening. Hurray!
  logger.info("Server listening on: http://" + ip.address() + ":%s", PORT);
  console.log("Server listening on: http://" + ip.address() + ":%s", PORT);
});

var staticPath = path.normalize(__dirname + '/../public');
console.log(staticPath);

dispatcher.setStatic(staticPath);

dispatcher.onGet("index.html", function(req, res) {
  console.log(res);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write();
  res.end();
});




