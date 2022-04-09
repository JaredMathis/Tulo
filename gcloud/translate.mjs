import {TranslationServiceClient} from '@google-cloud/translate';
import gcloud_auth_initialize from './auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';
import json_read from '../js/json_read.mjs';
import directory_create_if_not_exists from '../js/directory_create_if_not_exists.mjs';
import file_exists from '../js/file_exists.mjs';

import top100 from '../words/top100.txt.json' assert { type: 'json' };
import simple1 from '../words/simple1.txt.json' assert { type: 'json' };
import james_1 from '../words/james_1.json' assert { type: 'json' };

gcloud_auth_initialize()

// Instantiates a client
const translationClient = new TranslationServiceClient();

async function translate(sourceLanguageCode, targetLanguageCode, text) {

    const projectId = 'peaceful-garden-346121';
    const location = 'global';

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

const language_code_cebuano = 'ceb';
let language_code_english = 'en';

await translate_and_save(james_1, language_code_cebuano, language_code_english);

let words_english = [
    'I',
    "you",
    'hello',
];
words_english = words_english.concat(top100).concat(simple1);

await translate_and_save(words_english, language_code_english, language_code_cebuano);

async function translate_and_save(words, sourceLanguageCode, targetLanguageCode) {
    let language_directory = './translations/';
    await directory_create_if_not_exists(language_directory);

    let path_translations = path.join(language_directory, `${sourceLanguageCode}_${targetLanguageCode}.json`);

    let translations

    if (await file_exists(path_translations)) {
        translations = await json_read(path_translations);
    } else {
        translations = {};
    }

    async function saveTranslations() {
        await fs.writeFile(path_translations, JSON.stringify(translations, null, 2));
    }

    let counter = 0;
    for (let w of words) {
        if (translations.hasOwnProperty(w)) {
            console.log('Skipping ' + w);
            continue;
        }
        if (counter > 2) {
            break;
        }
        let translateds = await translate(sourceLanguageCode, targetLanguageCode, w)
        translations[w] = translateds.map(t => t['translatedText']);
        await saveTranslations();
        counter++;
    }
    await saveTranslations();
}
