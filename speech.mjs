import textToSpeech from '@google-cloud/text-to-speech';
import gcloud_auth_initialize from './gcloud_auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';
import file_exists from './file_exists.mjs';
import directory_create_if_not_exists from './directory_create_if_not_exists.mjs';
import json_read from './json_read.mjs';

gcloud_auth_initialize()

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// The text to synthesize
const languageCode = 'fil-PH';

async function gcloud_text_to_speech(text, languageCode) {
  let audio_directory = path.join('.', 'languages', languageCode, 'audio');
  await directory_create_if_not_exists(audio_directory);

  let output_path = path.join(audio_directory, text + '.mp3')
  if (await file_exists(output_path)) {
    console.log('skipping ' + output_path);
    return;
  }

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: languageCode, ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = fs.writeFile;
  await writeFile(output_path, response.audioContent, 'binary');
  console.log('Audio content written to file: ' + output_path);
}

const targetLanguageCode = 'ceb';

let language_directory = './languages/' + targetLanguageCode;
let path_translations = path.join(language_directory, 'translations.json');
let translations = await json_read(path_translations);

for (let english in translations) {
  for (let translated of translations[english]) {
    await gcloud_text_to_speech(translated, languageCode);
  }
}