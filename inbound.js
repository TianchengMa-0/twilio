const VoiceResponse = require("twilio").twiml.VoiceResponse;
const fs = require('fs');
// handle income calls: reply with predefined text-to-speech
function inbound(app) {
  app.post("/voice", (request, response) => {
    let data = [];
    if (fs.existsSync('inbound.json')) {
        data = JSON.parse(fs.readFileSync('inbound.json'));
    }
    data.push(request.body);
    fs.writeFileSync('inbound.json', JSON.stringify(data, null, 2));
    const twiml = new VoiceResponse();
    twiml.say(
      "Hello, this is a reminder from your healthcare provider to confirm your medications for the day. Please confirm if you have taken your Aspirin, Cardivol, and Metformin TodayInstance."
    );
    response.type("text/xml");
    response.send(twiml.toString());
  });
}
module.exports = {
  inbound,
};
