const twilio = require("twilio");
const fs = require('fs');
const VoiceResponse = require("twilio").twiml.VoiceResponse;
require("dotenv").config();

// setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const webhookUrl = process.env.WEBHOOKURL;
const phoneTo = process.env.PHONE_TO;
const phoneFrom = process.env.PHONE_FROM;
const client = twilio(accountSid, authToken);

// twilio functions
function twilioRoutes(app) {
  // twilio starts call to patient -> play predefined message -> record patient's response and transcribe
  app.post("/record", (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say(
      "Hello, this is a reminder from your healthcare provider to confirm your medications for the day. Please confirm if you have taken your Aspirin, Cardivol, and Metformin TodayInstance. Please leave a message after the beep."
    );
    twiml.record({
      transcribe: true,
      maxLength: 30,
      transcribeCallback: "/transcription",
    });
    twiml.hangup();
    response.type("text/xml");
    response.send(twiml.toString());
  });

  // transcribe
  app.post("/transcription", (request, response) => {
    const transcriptionText = request.body.TranscriptionText;
    console.log("Transcribed Text: ", transcriptionText);
  });

  // check outbound calling status and send SMS if not answered.
  app.post("/status", async (request, response) => {
    let data = [];
    if (fs.existsSync('outbound.json')) {
        data = JSON.parse(fs.readFileSync('outbound.json'));
    }
    data.push(request.body);
    fs.writeFileSync('outbound.json', JSON.stringify(data, null, 2));
    const answerBy = request.body.AnsweredBy;
    if (answerBy != "unknown") {
      await createMessage();
      console.log("message sent");
    } else {
      console.log("answered");
    }
  });
}

// make call
async function createCall() {
  try {
    const call = await client.calls
      .create({
        from: phoneFrom,
        to: phoneTo,
        url: webhookUrl + "/record",
        statusCallback: webhookUrl + "/status",
        statusCallbackMethod: "POST",
        statusCallbackEvent: ["completed"],
        machineDetection: "Enable",
      })
      .then((call) => {
        console.log("Call SID: ", call.sid);
      });
  } catch {
    console.log("error making a call");
  }
}

// send message
async function createMessage() {
  try {
    const message = await client.messages.create({
      body: "We called to check on your medication but couldn't reach you. Please call us back or take your medications if you haven't done so.",
      from: phoneFrom,
      to: phoneTo,
    });
  } catch {
    console.log("error sending message");
  }
}

// Export the function
module.exports = {
  twilioRoutes,
  createCall,
  createMessage,
};
