node -v: v22.14.0  
npm -v: 10.9.2  
you can run "nvm install --lts" to install them and run "nvm use 22.14.0"

# 1. How to setup project locally and configure twilio:

a. go to "https://www.twilio.com/en-us", "start for free" and sign up account;  
b. go to "https://www.twilio.com/en-us/blog/developers" and login, you should be directly to "https://console.twilio.com";  
c. if you do not have a phone number of twilio, on the left, you can go to "Develop->Phone Numbers->manage->buy a number", make sure you check to allow "voice" and "SMS" for "Capabilities";  
d. now we download our repo to local and open it in vscode, run "cd twilio" and then "npm install" to get dependencies, then create an empty file ".env", you can then copy content from ".env-example" and configure later;  
e. now we run ngrok: after installing ngrok at https://dashboard.ngrok.com/get-started/setup/windows, open a new Command Prompt and run "ngrok config add-authtoken <your-token>"(find token at https://dashboard.ngrok.com/get-started/your-authtoken) and then run "ngrok http 3000" where 3000 is project port number;  
f. now we get the forwarding link looks like "https://7b1c-98-214-222-229.ngrok-free.app", we should add it into .env in project and webhook on twilio:  
.env: set WEBHOOKURL with the link  
twilio: on "https://console.twilio.com", On the left, go to "Develop->Phone Numbers->manage->active numbers", click the number just purchased, "Configure->Voice configuration->A call comes", select webhook and, for URL, add your ngrok link + "/voice", for example, if you have "https://7b1c-98-214-222-229.ngrok-free.app" for ngrok, then you should add "https://7b1c-98-214-222-229.ngrok-free.app/voice" for webhook. remember to click "save configuration" at end. this allows the project monitoring inbound calls.  
g. other .env setup:  
TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN: go to "https://console.twilio.com" dashboard, scrolldown and you should see "Account SID" and "Auth Token";  
WEBHOOKURL: follow above instruction;  
PHONE_TO: target phone, normally your own number, format "+1XXXXXXXXXX";  
PHONE_FROM: number purchased on twilio, format "+1XXXXXXXXXX"

# 2. How to run the project and make a call:

make sure you "cd twilio", then run "node main.js", it will make a call;

# 3. expected events and console printing result:

after running "node main.js", you should see "Now listening on port 3000.";  
then outbound call is made, console prints "Call SID: XXXXXXXXX";  
case A:  
if the patient picks the phone, it prints "answered";  
after the system asks the patient to confirm medications taken using TTS, it will record and transcribe patient's response and after the patient ends the call, it takes a few seconds to see "Transcribed Text: XXXXXX" in console.  
case B:  
if the patient does not pick the phone, either reject or no-answer, the system will try to send a message and prints "message sent";  
keep the project running, try to make inbound call to the number bought on twilio, it will trigger inbound actions to play predefined message and ends the call immediately and nothing will be printed.

**NOTE**: when sending SMS, target phone will get voice mail, but if yuo are using free twilio account, this feature maybe restricted and will not speak expected message.

**NOTE**: whenever we start a new ngrok, we should update both .env and twilio voice configuration webhook.

# 4. TTS and STT:

twilio has built-in features for both TTS and STT:  
TTS: for "/record", we can do "twiml.say('content')" to trigger TTS  
STT: for "/record", we can pass "transcribe: true" and "transcribeCallback: '/transcription'" to twiml:  
twiml.record({  
transcribe: true,  
transcribeCallback: "/transcription",  
});  
by doing this, we allow transcription during the recording and result will be sent to "/transcription" to print.

# 5. Bonus:

after each outbound and inbound call, we add call logs to "outbound.json" and "inbound.json"  
you can open browser and visit "http://localhost:3000/printInbound" or "http://localhost:3000/printOutbound" to check call lists
