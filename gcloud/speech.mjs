import path from 'path';
import json_read from './json_read.mjs';
import gcloud_text_to_speech from './gcloud/text_to_speech.mjs';

const languageCode = 'fil-PH';

const targetLanguageCode = 'ceb';

let language_directory = './languages/' + targetLanguageCode;
let path_translations = path.join(language_directory, 'translations.json');
let translations = await json_read(path_translations);

for (let english in translations) {
  for (let translated of translations[english]) {
    await gcloud_text_to_speech(translated, languageCode);
  }
}