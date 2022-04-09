import {TranslationServiceClient} from '@google-cloud/translate';
import gcloud_auth_initialize from './auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';
import json_read from '../js/json_read.mjs';
import directory_create_if_not_exists from '../js/directory_create_if_not_exists.mjs';
import file_exists from '../js/file_exists.mjs';

import top100 from '../english/top100.txt.json' assert { type: 'json' };
import simple1 from '../english/simple1.txt.json' assert { type: 'json' };

gcloud_auth_initialize()

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'peaceful-garden-346121';
const location = 'global';
const text = 'hello';
const targetLanguageCode = 'ceb';
let sourceLanguageCode = 'en';

async function translate(sourceLanguageCode, targetLanguageCode, text) {
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode,
        targetLanguageCode,
    };

    // Run request
    const [response] = await translationClient.translateText(request);
    return response.translations;
}

// translateText(targetLanguageCode, 'hello');

let language_directory = './languages/' + targetLanguageCode;
await directory_create_if_not_exists(language_directory);

let path_translations = path.join(language_directory,`translations_${sourceLanguageCode}_${targetLanguageCode}.json`);

let translations;

if (!await file_exists(path_translations)) {
    await saveTranslations();
}

async function saveTranslations() {
    await fs.writeFile(path_translations, JSON.stringify(translations, null, 2));
}

translations = await json_read(path_translations);

let words = [
    'I',
    "you",
    'hello',
];

words = words.concat(top100).concat(simple1);

for (let w of words) {
    if (translations.hasOwnProperty(w)) {
        console.log('Skipping ' + w);
        continue;
    }
    let translateds = await translate(sourceLanguageCode, targetLanguageCode, w)
    translations[w] = translateds.map(t => t['translatedText']);
    await saveTranslations();
}
await saveTranslations();
