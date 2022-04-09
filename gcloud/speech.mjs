import path from 'path';
import json_read from '../js/json_read.mjs';
import gcloud_text_to_speech from './text_to_speech.mjs';

const targetLanguageCode = 'ceb';

let translations_directory = './translations/';
let path_translations = path.join(translations_directory, `en_${targetLanguageCode}.json`);
let to = await json_read(path_translations);

path_translations = path.join(translations_directory, `${targetLanguageCode}_en.json`);
let from = await json_read(path_translations);

const languageCode = 'fil-PH';

for (let english in to) {
  for (let translated of to[english]) {
    await gcloud_text_to_speech(translated, languageCode);
  }
}