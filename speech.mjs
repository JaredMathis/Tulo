import textToSpeech from '@google-cloud/text-to-speech';
import gcloud_auth_initialize from './gcloud_auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';

gcloud_auth_initialize()

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// The text to synthesize
const text = 'kumusta';

async function quickStart(text) {

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'fil-PH', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = fs.writeFile;
  await writeFile('output3.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
quickStart();