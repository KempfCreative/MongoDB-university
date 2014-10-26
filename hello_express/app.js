var express = require('express'),
    app = express();

app.get('/', function(req, res) {
    res.send("Hello, World!");
});
app.get('*', function(req, res) {
    res.status(404).send("Page not found!");
});
app.listen(8080);
console.log("Running express on port 8080");