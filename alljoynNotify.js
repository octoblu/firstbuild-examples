// Subscribe to your GE dryer's end-of-cycle event
// Send AllJoyn message to your LG TV when your GE dryer cycle is finished

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
      // Send message to your LG TV via AllJoyn
      conn.message({
        "devices": "UUID-OF-OCTOBLU-GATEWAY",
        "subdevice": "alljoyn",
        "payload": {
          "method":"notify", 
          "message":"Your clothes are ready to fold!"
        }
      });
    });        
  });

});

