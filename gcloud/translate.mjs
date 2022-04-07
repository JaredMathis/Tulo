import {TranslationServiceClient} from '@google-cloud/translate';
import gcloud_auth_initialize from './gcloud/auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';
import json_read from './json_read.mjs';
import top100 from '../english/top100.txt.json' assert { type: 'json' };

gcloud_auth_initialize()

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'peaceful-garden-346121';
const location = 'global';
const text = 'hello';
const targetLanguageCode = 'ceb';

async function translate(targetLanguageCode, text) {
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'en',
        targetLanguageCode,
    };

    // Run request
    const [response] = await translationClient.translateText(request);
    return response.translations;
}

// translateText(targetLanguageCode, 'hello');

let language_directory = './languages/' + targetLanguageCode;
await directory_create_if_not_exists(language_directory);

let path_translations = path.join(language_directory, 'translations.json');

let translations;

if (!await file_exists(path_translations)) {
    await saveTranslations();
}

async function saveTranslations() {
    await fs.writeFile(path_translations, JSON.stringify(translations, null, 2));
}

translations = json_read(path_translations);

let words = [
    'I',
    "you",
    'hello',
];

words = words.concat(top100);

for (let w of words) {
    if (translations.hasOwnProperty(w)) {
        console.log('Skipping w');
        continue;
    }
    let translateds = await translate(targetLanguageCode, w)
    translations[w] = translateds.map(t => t['translatedText']);
    await saveTranslations();
}
await saveTranslations();
