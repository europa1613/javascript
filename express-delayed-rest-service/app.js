var express = require("express");
var request = require("request");
var morgan = require('morgan');

var app = express();

app.use(morgan("combined"));

app.use(express.static("public"));

var super_heroes = require("./data/super_heroes.json");
var alter_egos = require("./data/alter_egos.json");
var super_powers = require("./data/super_powers.json");

function getDataAsPromise(data, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}

function respondWithDelay(req, res, data, delay) {
    return getDataAsPromise(data, delay)
        .then((response) => {
            res.json(data);
            res.end();
        })
        .catch((err) => {
            console.log("Error occurred: ", err);
        });
}

app.get("/ping", function (req, res) {
    res.end("pong");
});

app.get("/super-heroes", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const delay = parseInt(req.query.delay, 10) || 0;
    respondWithDelay(req, res, super_heroes, delay);
    //res.send(super_heroes);
});

app.get("/alter-egos/:supeId", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const supeId = parseInt(req.params.supeId, 10) || 0;
    const delay = parseInt(req.query.delay, 10) || 0;
    const alter_ego = alter_egos.filter((ego) => ego.id === supeId)[0];
    if (supeId === 0 || !alter_ego) {
        res.send({ error: `No alter ego found for supeId: ${supeId}` });
        res.end();
    }
    respondWithDelay(req, res, alter_ego, delay);
    //res.send(alter_ego);
    //res.end();
});

app.get("/super-powers/:supeId", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const supeId = parseInt(req.params.supeId, 10) || 0;
    const delay = parseInt(req.query.delay, 10) || 0;
    const super_power = super_powers.filter(
        (powers) => powers.id === supeId
    )[0];
    if (supeId === 0 || !super_power) {
        res.send({ error: `No super power found for supeId: ${supeId}` });
        res.end();
    }
    respondWithDelay(req, res, super_power, delay);
    //res.send(super_power);
    //res.end();
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
