import path from 'path';
import json_read from '../js/json_read.mjs';
import gcloud_text_to_speech from './text_to_speech.mjs';

const languageCode = 'fil-PH';

const targetLanguageCode = 'ceb';

let translations_directory = './translations/';
let path_translations = path.join(translations_directory, `en_${targetLanguageCode}.json`);
let to = await json_read(path_translations);

for (let english in to) {
  for (let translated of to[english]) {
    await gcloud_text_to_speech(translated, languageCode);
  }
}