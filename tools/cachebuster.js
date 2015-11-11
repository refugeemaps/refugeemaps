/**
 * This loads the html templates and appends a timestamp prefixed with a
 * questionmark (?) to main.(js|css).
 */
var fs = require('fs'),
  path = require('path'),
  version = Number(new Date()),
  templates = ['head.html', 'index.html'];

templates.forEach(function(template) {
  var filePath = path.resolve(__dirname, '../templates/', template),
    content = fs.readFileSync(filePath).toString();

  content = content.replace(/(main\.)(js|css)(\?\d*)?/g, '$1$2?' + version);
  fs.writeFileSync(filePath, content);
});
