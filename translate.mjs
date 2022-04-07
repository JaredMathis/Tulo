import {TranslationServiceClient} from '@google-cloud/translate';
import gcloud_auth_initialize from './gcloud_auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';
import file_is_error_not_found from './file_is_error_not_found.mjs';

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
if (!await directory_exists(language_directory)) {
    await fs.mkdir(language_directory)
}

let path_translations = path.join(language_directory, 'translations.json');

let translations;

if (!await file_exists(path_translations)) {
    translations = {a:"1"};
    await saveTranslations();
}

async function saveTranslations() {
    await fs.writeFile(path_translations, JSON.stringify(translations, null, 2));
}

translations = JSON.parse(await fs.readFile(path_translations));

let words = [
    'I',
    "you",
    'hello',
];

let path_top100 = './english/top100.txt';
let top100_text = await fs.readFile(path_top100, 'utf8')
let rows = top100_text.split('\n');
let mapped = rows.map(row => row.split('\t')[0])

words = words.concat(mapped);

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

function directory_exists(path) {
    return fs
        .stat(path)
        .then(fsStat => {
            return fsStat.isDirectory();
        })
        .catch(err => {
            if (file_is_error_not_found(err)) {
                return false;
            }
            throw err;
        });
}
