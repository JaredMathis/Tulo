import path from 'path';
import json_read from '../js/json_read.mjs';
import gcloud_text_to_speech from './text_to_speech.mjs';

let languages = [
  {
    targetLanguageCode: 'ceb',
    languageCode: 'fil-PH',
  },
  {
    targetLanguageCode: 'es',
    languageCode: 'es-ES',
    skip_to: true,
  },
]

for (let language of languages) {
  let {
    targetLanguageCode,
    languageCode, 
  } = language;
    
  let translations_directory = './translations/';
  let path_translations = path.join(translations_directory, `en_${targetLanguageCode}.json`);
  let to;
  if (!language.skip_to) {
    to = await json_read(path_translations);
  }

  path_translations = path.join(translations_directory, `${targetLanguageCode}_en.json`);
  let from = await json_read(path_translations);

  if (!language.skip_to) {
    for (let english in to) {
      for (let translated of to[english]) {
        await gcloud_text_to_speech(translated, languageCode);
      }
    }
  }
  for (let non_english in from) {
    await gcloud_text_to_speech(non_english, languageCode);
  }
}
