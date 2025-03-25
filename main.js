const express = require("express");
const { twilioRoutes, createCall } = require("./outbound.js");
const { inbound } = require("./inbound.js");
const fs = require('fs');

// app
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
twilioRoutes(app);
inbound(app);

app.get("/printOutbound",(request, response) => {
  try {
    const outbound = fs.readFileSync('outbound.json', 'utf8');
    const outData = JSON.parse(outbound);
    response.json(outData)
} catch (error) {
    console.error('Error reading JSON file:', error);
}
});

app.get("/printInbound",(request, response) => {
  try {
    const inbound = fs.readFileSync('inbound.json', 'utf8');
    const inData = JSON.parse(inbound);
    response.json(inData)
} catch (error) {
    console.error('Error reading JSON file:', error);
}
});

// start project: starts a outbound call and listen to inbound calls
app.listen(port, () => {
  createCall();
  console.log(`Now listening on port ${port}. `);
});
