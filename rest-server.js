import express from "express";
import http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import date from "date-and-time";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const logSuffix = date.format(new Date(), "YYYY-MM-DD-HH-mm-ss");

app.all("*", (req, res) => {
  const message = {
    url: req.url,
    headers: req.headers,
    body: req.body,
  };
  console.log(JSON.stringify(message, 0, 2));

  const stream = fs.createWriteStream(`logs/rest-stream-${logSuffix}.log`, {
    flags: "a",
  });
  stream.once("open", (fd) => {
    stream.write(JSON.stringify(message) + "\n");
  });

  res.status(200).send(req.body);
});

const port = process.env.REST_PORT || 3000;
server.listen(port, () => {
  console.log(`Rest server listening on port ${port}`);
});
