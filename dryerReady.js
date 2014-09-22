// Subscribe to your GE dryer's end-of-cycle event
// Turn your Phillip's Hue lightbulb to blue when your GE dryer cycle is finished
// Fold your clothes!

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

  // Subscribe to the dryer's end-of-cycle state
  greenBean.connect("laundry", function (laundry) {
    laundry.endOfCycle.subscribe(function (value) {
      console.log("end of cycle:", value);
      // Change Hue bulb 1 to blue
      conn.message({
        "devices": "UUID-OF-OCTOBLU-GATEWAY",
        "subdevice": "hue",
        "payload": {
          "setState": {
            "lightNumber": 1,
            "options": {
              "on": true,
              "bri": 255,
              "hue": 45000,
              "sat": 255,
              "transitiontime": 0
            }
          }
        }
      });
    });        
  });

});

