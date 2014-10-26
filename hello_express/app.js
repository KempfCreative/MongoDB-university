var express = require('express'),
    app = express(),
    cons = require('consolidate');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

app.get('/', function(req, res) {
    res.render('hello', {'name': 'Swig'});
});
app.get('*', function(req, res) {
    res.status(404).send("Page not found!");
});
app.listen(8080);
console.log("Running express on port 8080");