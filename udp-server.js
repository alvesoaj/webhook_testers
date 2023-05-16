import dgram from "dgram";
import fs from "fs";
import dotenv from "dotenv";
import date from "date-and-time";

dotenv.config();

const server = dgram.createSocket("udp4");
const ddPrefix = "datadog.dogstatsd.client";
const logSuffix = date.format(new Date(), "YYYY-MM-DD-HH-mm-ss");

server.on("message", (buffer, rinfo) => {
  const message = buffer.toString();
  if (!message.includes(ddPrefix)) {
    const content = parseMessage(rinfo.address, rinfo.port, message);
    console.log(JSON.stringify(content, 0, 2));
    const stream = fs.createWriteStream(`logs/udp-stream-${logSuffix}.log`, {
      flags: "a",
    });
    stream.once("open", (fd) => {
      stream.write(JSON.stringify(content) + "\n");
    });
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

const address = process.env.ADDRESS || "127.0.0.1";
const port = process.env.UDP_PORT || 4711;
server.bind(port, address);

const parseMessage = (address, port, message) => {
  const splittedMessage = message.split("|");
  const splittedPartOne = splittedMessage[0].split(":");
  const splittedPartThree = splittedMessage[2]
    .substring(1, splittedMessage[2].length - 1)
    .split(",");
  return {
    host: `${address}:${port}`,
    type: splittedMessage[1],
    metric: {
      name: splittedPartOne[0],
      value: splittedPartOne[1],
    },
    tags: splittedPartThree.map((val) => {
      const splittedVal = val.split(":");
      return { name: splittedVal[0], value: splittedVal[1] };
    }),
  };
};
