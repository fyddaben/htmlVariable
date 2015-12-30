var htmlparser = require("front-htmlparser2");
var request = require('request');
var log4js = require('log4js');
var cheerio = require('cheerio');
log4js.configure('hv_log4js_configuration.json', { cwd: __dirname+'/log/'});
var logger = log4js.getLogger('hv_log');
var option = {
  onopentag: function(name, attribs){
    if(name === "script" && attribs.type === "text/javascript"){
      logger.info("JS! Hooray!");
    }
  },
  oncomment: function(data) {
    console.log(data);
  },
  ontext: function(text){
    text = text.trim();
    if(text) {
      logger.info("-->", text);
    }
  },
  onclosetag: function(tagname){
    if(tagname === "script"){
      logger.info("That's it?!");
    }
  }
};

var parser = new htmlparser.Parser(option, {decodeEntities: true});

request('http://hd.mi.com/z/12161a/index.html', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //var $ = cheerio.load(body);
    //var text = $('body').html();
    parser.write(body);
    parser.end();
  }
})
//parser.write("Xyz <script type='text/javascript'>var foo = '<<bar>>';</ script>");
//parser.end();
//var dom = htmlparser.parseDOM("Xyz <script type='text/javascript'>var foo = '<<bar>>';</ script>asdfadf");
//console.log(dom);


