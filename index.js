var htmlparser = require("front-htmlparser2");

var request = require('request');

var log4js = require('log4js');

var cheerio = require('cheerio');

log4js.configure('hv_log4js_configuration.json', { cwd: __dirname+'/log/'});

var logger = log4js.getLogger('hv_log');

function analyseUrl(url) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body, {decodeEntities: false});
      var text = $('body').html();
      var dom = htmlparser.parseDOM(text);
      loopCheck(dom, 0);
      logger.info(JSON.stringify(treeData));
    }
  })
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

//analyseUrl('http://www.mi.com/sg/events/christmas2015/sale/');

analyseUrl('http://hd.mi.com/z/12161a/index.html');


