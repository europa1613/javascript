var express = require("express");
var request = require("request");

var app = express();

app.use(express.static("public"));

app.get("/ping", function (req, res) {
  res.end("pong");
});

app.get("/:count/jokes", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const count = parseInt(req.params.count, 10) || 1;
  const delay = (parseInt(req.query.delay, 10) || 0) * 1000;
  console.log(`Jokes count: ${count}; delay: ${delay}`);
  getJokes(count)
    .then(function (response) {
      var jokesResponse = JSON.parse(response);
      var jokes = jokesResponse.value;

      setTimeout(function () {
        res.write(JSON.stringify(jokes));
        res.flushHeaders();
        res.end();
      }, delay);
    })
    .catch(function (error) {
      console.log("Error Occurred in getting jokes", error);
    });
});

function getJokes(numberOfJokes) {
  return new Promise((resolve, reject) => {
    request.get(
      { url: "http://api.icndb.com/jokes/random/" + numberOfJokes },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      }
    );
  });
}

app.listen(3001, () => {
  console.log("Server running on port %s", 3001);
});
