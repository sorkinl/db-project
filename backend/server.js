require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const connection = require("./config/db.config");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
connection.connect();

connection.query("SELECT 1 + 1 AS solution", (error, rows, fields) => {
  if (error) console.log(error);
  console.log("The solution is: ", rows[0].solution);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  connection.end();
  process.exit();
});

// parse requests of content-type - application/json

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.post("/api/addTrip", jsonParser, (req, res) => {
  console.log("Gets here");
  let body = req.body;
  console.log(req.body);
  connection.query(
    `INSERT INTO trips (uid,name,origin,destination,capacity) VALUES 
    (${body.uid},"${body.name}",POINT(${body.origin.lat},${body.origin.lng}),POINT(${body.destination.lat},${body.destination.lng}),${body.capacity}); `,
    (error, rows, fields) => {
      if (error) {
        res.json({ message: "error" });
        console.log(error);
      } else {
        res.json({ message: "Success" });
      }

      console.log("Success");
    }
  );
});

app.get("/api/getAllTrips", jsonParser, (req, res) => {
  connection.query(`Select * from trips `, (error, results, fields) => {
    if (error) {
      console.log(results);
      res.json({ message: "error" });
      console.log(error);
    } else {
      res.json({ message: "Success", results });
    }

    console.log("Success");
  });
});

app.get(`/api/getUserTrips/:uid`, jsonParser, (req, res) => {
  connection.query(
    `Select * from trips WHERE uid = ${req.params.uid}`,
    (error, results, fields) => {
      if (error) {
        console.log(results);
        res.json({ message: "error" });
        console.log(error);
      } else {
        res.json({ message: "Success", results });
      }

      console.log("Success");
    }
  );
});

app.get(`/api/getBookedTrips/:uid`, jsonParser, (req, res) => {
  connection.query(
    `Select * from user_trips ut JOIN trips t ON t.trip_id = ut.trip_id WHERE ut.uid = ${req.params.uid}`,
    (error, results, fields) => {
      if (error) {
        console.log(results);
        res.json({ message: "error" });
        console.log(error);
      } else {
        res.json({ message: "Success", results });
      }

      console.log("Success");
    }
  );
});

app.post("/api/updateTrip", jsonParser, (req, res) => {
  let body = req.body;
  let query = "UPDATE trips SET ? WHERE ?";
  let escapeObj = {};
  if (body.name) {
    escapeObj.name = body.name;
  }
  if (body.origin) {
    escapeObj.origin = {
      toSqlString: () => {
        return `POINT(${body.origin.lat}, ${body.origin.lng})`;
      },
    };
  }
  if (body.destination) {
    escapeObj.destination = {
      toSqlString: () => {
        return `POINT(${body.destination.lat},${body.destination.lng})`;
      },
    };
  }
  console.log(body);
  connection.query(
    query,
    [escapeObj, { trip_id: body.tripId }],
    (error, results, fields) => {
      if (error) {
        console.log(results);
        res.json({ message: "error" });
        console.log(error);
      } else {
        console.log("Success");
        res.json({ message: "Success" });
      }
    }
  );
});

app.delete(`/api/deleteTrip/:trip_id`, jsonParser, (req, res) => {
  connection.query(
    `DELETE from trips WHERE trip_id = ${req.params.trip_id}`,
    (error, results) => {
      if (error) {
        console.log(error);
        res.json({ message: "error" });
        console.log(error);
      } else {
        res.json({ message: "Success", results });
      }
    }
  );
});

app.post("/api/signin", jsonParser, (req, res) => {
  let body = req.body;
  let query = "SELECT * FROM users WHERE ?";
  console.log(body);
  connection.query(query, { username: body.username }, (error, results) => {
    if (error || results.length == 0) {
      console.log(error);
      res.json({ message: "error" });
      console.log(error);
    } else {
      bcrypt.compare(
        body.pw_hash,
        results[0].pw_hash,
        function (error, result) {
          if (result) {
            res.json({ message: "Success", results });
          } else {
            console.log(error);
          }
        }
      );
    }
    console.log("Success");
  });
});

app.post("/api/signup", jsonParser, (req, res) => {
  let body = req.body;
  let query = "INSERT INTO users SET ?";
  console.log(body.pw);
  bcrypt.hash(body.pw, 10, function (error, hash) {
    connection.query(
      query,
      { username: body.username, pw_hash: hash },
      (error, results, fields) => {
        if (error) console.log(error);
        console.log(results);
        res.send({
          message: "Success",
          uid: results.insertId,
          username: body.username,
        });
      }
    );
  });
});

app.post("/api/bookTrip", jsonParser, (req, res) => {
  let body = req.body;
  let bookTrip = "INSERT INTO user_trips SET trip_id = ?, uid = ?";
  let decreaseCapacity =
    "UPDATE trips SET capacity = capacity - 1 WHERE trip_id = ?";
  console.log(body);
  connection.beginTransaction((error) => {
    if (error) {
      console.error(error);
      console.log(error);
    }

    connection.query(
      bookTrip,
      [body.tripId, body.uid],
      function (error, results, fields) {
        if (error) {
          return connection.rollback(function () {
            console.log(error);
          });
        } else {
          connection.query(
            decreaseCapacity,
            body.tripId,
            function (error, results, fields) {
              if (error) {
                return connection.rollback(function () {
                  console.log(error);
                });
              } else {
                connection.commit(function (error) {
                  if (error) {
                    return connection.rollback(function () {
                      console.log(error);
                    });
                  } else {
                    res.send({ message: "Success" });
                  }
                });
              }
            }
          );
        }
      }
    );
  });
});

app.get("/api/filter/10000", (req, res) => {
  let query = `CALL filter_10000(POINT(?,?),POINT(?,?))`;
  connection.query(
    query,
    [
      req.query.originLat,
      req.query.originLng,
      req.query.destinationLat,
      req.query.destinationLng,
    ],
    (error, results, fields) => {
      if (error) console.log(error);
      console.log(results);
      res.send({
        message: "Success",
        results,
      });
    }
  );
});

app.get("/api/filter/100000", (req, res) => {
  let query = `CALL filter_100000(POINT(?,?),POINT(?,?))`;
  console.log([
    req.query.originLat,
    req.query.originLng,
    req.query.destinationLat,
    req.query.destinationLng,
  ]);
  connection.query(
    query,
    [
      req.query.originLat,
      req.query.originLng,
      req.query.destinationLat,
      req.query.destinationLng,
    ],
    (error, results, fields) => {
      if (error) console.log(error);
      console.log(results);
      res.send({
        message: "Success",
        results,
      });
    }
  );
});

app.get("/api/filter/50000", (req, res) => {
  let query = `CALL filter_50000(POINT(?,?),POINT(?,?))`;
  console.log([
    req.query.originLat,
    req.query.originLng,
    req.query.destinationLat,
    req.query.destinationLng,
  ]);
  connection.query(
    query,
    [
      req.query.originLat,
      req.query.originLng,
      req.query.destinationLat,
      req.query.destinationLng,
    ],
    (error, results, fields) => {
      if (error) console.log(error);
      console.log(results);
      res.send({
        message: "Success",
        results,
      });
    }
  );
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
