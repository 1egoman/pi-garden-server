var thing = require("iot-thing");
var strftime = require("strftime");

// create the thing
// new thing("127.0.0.1" || process.env.HOST, 8000 || process.env.PORT, {}, {
new thing("que-app-backend.herokuapp.com", 80, {}, {
  name: "Hydroponic Garden",
  desc: "A garden that grows me stuff",
  tags: ["garden", "hydroponics"],
  image: "http://panamashippingcontainerhouse.com/wp-content/uploads/2012/07/Hydroponics-650x487.jpg",
  data: {
    wateringTime: {
      value: "11:00:00"
    },
    wateringDurationMinutes: {
      value: 10
    },
    currentlyWatering: {
      value: false,
      type: "button",
      readonly: true
    },
    turnPumpOn: {
      label: "Run pump through a cycle",
      value: false
    }
  }
}, function(thing, err) {

  var pump = require("./pump")(thing);
  thing || console.log(err);

  // the global timer
  var globalTimer = setInterval(function() {
    // test to see if it is time for the pump to turn on
    thing.data.pull("wateringTime", function(when) {
    // console.log(strftime('%T'), when)
      if ( strftime('%T') == when.value ) {
        thing.data.pull("wateringDurationMinutes", function(duration) {
          pump.doCycle(duration.value, when.value);
        });
      }
    });

    // manually do a cycle
    thing.data.pull("turnPumpOn", function(doCycle) {
      thing.data.pull("wateringDurationMinutes", function(duration) {
        if (doCycle.value && pump.pumpOn == false) {
          thing.data.push("turnPumpOn", false, function() {});

          if (!pump.pumpOn) {
            pump.doCycle(duration.value, null);
            pump.pumpOn = true;
          }

        };
      });
    });

  }, 1000);


});
