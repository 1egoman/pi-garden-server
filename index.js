var express = require("express");
var strftime = require("strftime");
var pump = require("./pump")({gpiopump: process.env.GPIOPUMP || 16});
var h, p;

if (process.argv[2] == "h") {
  h = "que-app-backend.herokuapp.com";
  p = 80;
  console.log("On Heroku")
} else {
  h = "127.0.0.1";
  p = 8000;
}
var app = express();

// test to see if it is time for the pump to turn on
app.get("/water/cycle/:duration", function(req, res) {
  // first, check auth header
  if (req.headers.authentication == (process.env.AUTHKEY || process.argv[2])) {
    // do it!
    pump.doCycle( parseFloat(req.param("duration")) );
    res.send("OK.");
  } else {
    res.send("NO AUTH.");
  }
});

app.listen(process.env.PORT || 7000, function() {
  console.log("listening...")
});
