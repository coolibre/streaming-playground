const HOST = process.env.HOST || "localhost";
const PORT = 8092;

var dgram = require("dgram");
var client = dgram.createSocket("udp4");

let count = 0;
let value = 0;
let upwards = false;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function run() {
  async function write(val) {
    const message = new Buffer(`temperature,sensor=sensor1 value=${val}\n`);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
      if (err) console.error("ERROR: ", err);
      console.log("UDP client message sent to " + HOST + ":" + PORT);
    });
  }
  while (true) {
    if (count === 0) {
      count = Math.floor(randomRange(1, 200));
      upwards = !upwards;
    }
    upwards ? (value += 0.1) : (value -= 0.1);
    count -= 1;
    await write(value);
    await sleep(100);
  }
}

run();
