const express = require("express");
const { twilioRoutes, createCall } = require("./outbound.js");
const { inbound } = require("./inbound.js");
// app
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
twilioRoutes(app);
inbound(app);

// start project: starts a outbound call and listen to inbound calls
app.listen(port, () => {
  createCall();
  console.log(`Now listening on port ${port}. `);
});
