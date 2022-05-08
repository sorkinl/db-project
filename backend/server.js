require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const connection = require("./config/db.config");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
connection.connect();

connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
  if (err) throw err;

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
    `INSERT INTO trips (uid,name,origin,destination) VALUES 
    (${body.uid},"${body.name}",POINT(${body.origin.lat},${body.origin.lng}),POINT(${body.destination.lat},${body.destination.lng})); `,
    (err, rows, fields) => {
      if (err) {
        res.json({ message: "Error" });
        throw err;
      } else {
        res.json({ message: "Success" });
      }

      console.log("Success");
    }
  );
});

app.get("/api/getAllTrips", jsonParser, (req, res) => {
  connection.query(`Select * from trips `, (err, results, fields) => {
    if (err) {
      console.log(results);
      res.json({ message: "Error" });
      throw err;
    } else {
      res.json({ message: "Success", results });
    }

    console.log("Success");
  });
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
    (err, results, fields) => {
      if (err) {
        console.log(results);
        res.json({ message: "Error" });
        throw err;
      } else {
        console.log("Success");
        res.json({ message: "Success" });
      }
    }
  );
});

app.delete("/api/deleteTrip", jsonParser, (req, res) => {
  let body = req.body;

  connection.query(`DELETE from trips WHERE trip_id = (${body.trip_id}) `, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.json({ message: "Error" });
      throw err;
    } else {
      res.json({ message: "Success", results });
    }

    console.log("Success");
  });
})

app.get("/api/signin", jsonParser, (req, res) => {
  let body = req.body;
  let query = "SELECT * FROM users WHERE ?";

  connection.query(
    query, 
    { username: body.username}, (err, results) => {
    if (err) {
      console.log(err);
      res.json({ message: "Error" });
      throw err;
    } else {
      bcrypt.compare(body.pw_hash, results[0].pw_hash, function (err, result) {
        if (result) {
          res.json({ message: "Success", results });
        } else {
          throw err;
        }
      });
    
    }
    console.log("Success");
  });
})

app.post("/api/signup", jsonParser, (req, res) => {
  let body = req.body;
  let query = "INSERT INTO users SET ?";
  console.log(body.pw);
  bcrypt.hash(body.pw, 10, function (err, hash) {
    connection.query(
      query,
      { username: body.username, pw_hash: hash },
      (err, results, fields) => {
        if (err) throw err;
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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
