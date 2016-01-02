var htmlparser = require("front-htmlparser2");

var request = require('request');

var log4js = require('log4js');

var cheerio = require('cheerio');

var fs = require('fs');

var Q = require('q');

var ejs = require('ejs');

log4js.configure('hv_log4js_configuration.json', { cwd: __dirname+'/log/'});

var logger = log4js.getLogger('hv_log');

function writeFile(content) {
  var name = parseInt(new Date().getTime() / 1000);
  var appendFile = Q.nfcall(fs.appendFile,
                            __dirname + "/_source/" + name, content);
  appendFile.then(function() {
    logger.info('write success', name);
  }).catch(function(err) {
    if (err) {
      logger.info('write filed');
      logger.error(err);
    };
  }).done();

}

function reqUrl(url) {

  var deferred = Q.defer();
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(body);
    } else {
      deferred.reject(function() {
        logger.error('code:',response.statusCode);
        logger.error(error);
      });
    }
  });
  return deferred.promise;
}
var treeData = [];
function loopCheck(dom, level) {
  for(var i in dom) {
    var d = dom[i];
    if(d.type=='script') {
      continue;
    }
    if(d.type=='text'){
      if (d.data.trim()) {
        var obj = {
          level: level,
          text: d.data
        }
        treeData.push(obj);
      }
    }
    if (d.children) {
      var le = level + 1;
      loopCheck(d.children, le);
    }
  }
}

function reWriteHtml(content) {

  var filePath = __dirname + '/public/index.html';
  fs.appendFile(filePath, content, function(err) {
    if (err) {
      logger.info('write index.html filed');
      logger.error(err);
    };
    logger.info('write index.html success');
  });
}

// 读取模板，转换为html
function tmplReverse() {
  var filePath = __dirname + '/view/index.ejs';
  fs.readFile(filePath, 'utf-8', function(err, val) {
    if (err) {
      logger.info('read index.ejs filed');
      logger.error(err);
    };
    var tmpl = ejs.compile(val);
    var obj = {
      it: 'daben'
    };
    var htmlStr = tmpl(obj);
    reWriteHtml(htmlStr);
  });
};

//reqUrl('http://hd.mi.com/z/12161a/index.html').then(function(body) {
  //writeFile(body);
  //var $ = cheerio.load(body, {decodeEntities: false});
  //var text = $('body').html();
  //var dom = htmlparser.parseDOM(text);
  //loopCheck(dom, 0);
  //logger.info(JSON.stringify(treeData));
//});

tmplReverse();


