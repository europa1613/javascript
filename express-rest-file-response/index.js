var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.get('/ping', function(req, res) {
    res.end('pong');
});

app.get('/download/pdf', function(req, res) {
    const file = `${__dirname}/files/Google.pdf`;
    res.download(file); // Set disposition and send it.
});

app.get('/download/excel', function(req, res) {
    const file = `${__dirname}/files/test_excel.xlsx`;
    res.download(file); // Set disposition and send it.
});

app.get('/download/csv', function(req, res) {
    const file = `${__dirname}/files/test_csv.csv`;
    res.download(file); // Set disposition and send it.
});

app.get('/download/zip', function(req, res) {
    const file = `${__dirname}/files/test_zip.zip`;
    res.download(file); // Set disposition and send it.
});

app.listen(port, function(err) {
    if (err) console.log("Error:", err);
    else console.log("The server is running on port:", port);
});