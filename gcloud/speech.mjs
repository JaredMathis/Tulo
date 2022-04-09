import path from 'path';
import json_read from '../js/json_read.mjs';
import gcloud_text_to_speech from './text_to_speech.mjs';

const languageCode = 'fil-PH';

const targetLanguageCode = 'ceb';

let translations_directory = './languages/' + targetLanguageCode;
let path_translations = path.join(translations_directory, 'translations.json');
let translations = await json_read(path_translations);

for (let english in translations) {
  for (let translated of translations[english]) {
    await gcloud_text_to_speech(translated, languageCode);
  }
}