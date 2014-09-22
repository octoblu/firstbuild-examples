// Turn on your GE oven to 350 degrees
// Turn your Phillip's Hue lightbulb to red when your GE oven is pre-heated to desired temperature

var skynet = require("skynet");
var greenBean = require("green-bean");

// Connect to Octoblu
var conn = skynet.createConnection({
  // "uuid": '60317ad1-4034-11e4-8ac2-f530dc0c6f8d',
  // "token": '0bgr3zgctdw0qw7b9kiao9m56ro7ds4i',
  "server": "meshblu.octoblu.com",
  "port": 80
});

conn.on('notReady', function(data){
  console.log('UUID FAILED AUTHENTICATION!');
  console.log(data);
});

conn.on('ready', function(data){
  console.log('UUID AUTHENTICATED!');
  console.log(data);

  // Connect to oven
  greenBean.connect("range", function (range) {
    // Set over to 350 degrees
    range.upperOven.cookMode.write({
        mode: 18,
        cookTemperature: 350,
        cookHours: 1,
        cookMinutes: 0
    });

    // Check every 5 seconds for desired temperature
    setInterval(function(){
      range.upperOven.probeDisplayTemperature.read(function(value) {
        console.log("upper oven probe display temperature is:", value);
        if(value > 350){
          // Change Hue bulb 1 to red
          conn.message({
            "devices": "UUID-OF-OCTOBLU-GATEWAY",
            "subdevice": "hue",
            "payload": {
              "setState": {
                "lightNumber": 1,
                "options": {
                  "on": true,
                  "bri": 255,
                  "hue": 65000,
                  "sat": 255,
                  "transitiontime": 0
                }
              }
            }
          });
        }
      });
    }, 5000);
    
  });

});

