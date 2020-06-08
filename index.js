require('dotenv').config();

const speedtest = require('speedtest-net');
const mongoose = require('mongoose');

const mbs = (1024 * 1024) / 8;

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Result = mongoose.model('Result', {
  timestamp: Date,
  ping: Number,
  download: Number,
  upload: Number,
  room: String,
});

async function test() {
  console.log('Measuring speed...');
  try {
    const { timestamp, ping, download, upload } = await speedtest({
      acceptLicense: true,
      acceptGdpr: true,
    });
    const result = {
      timestamp,
      ping: ping.latency,
      download: download.bandwidth / mbs,
      upload: upload.bandwidth / mbs,
      room: process.env.ROOM,
    };
    console.log('Result:', result);
    const res = new Result(result);
    res.save().then(() => {
      console.log('Saved');
      mongoose.disconnect();
    });
  } catch (e) {
    console.log('Error measuring speed', e);
  }
}

test();
