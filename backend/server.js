require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const connection = require("./config/db.config");
var jsonParser = bodyParser.json();
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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
