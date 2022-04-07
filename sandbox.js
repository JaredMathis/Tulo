import {TranslationServiceClient} from '@google-cloud/translate';
import gcloud_auth_initialize from './gcloud_auth_initialize.mjs';
import {promises as fs} from 'fs'
import path from 'path';

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
    console.log({translations})
    await fs.writeFile(path_translations, JSON.stringify(translations, null, 2));
}

translations = JSON.parse(await fs.readFile(path_translations));

let words = [
    'hello',
];

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

function isErrorNotFound(err) {
    return err.code === "ENOENT";
}

function directory_exists(path) {
    return fs
        .stat(path)
        .then(fsStat => {
            return fsStat.isDirectory();
        })
        .catch(err => {
            if (isErrorNotFound(err)) {
                return false;
            }
            throw err;
        });
}

function file_exists(path) {
    return fs
        .stat(path)
        .then(fsStat => {
            return fsStat.isFile();
        })
        .catch(err => {
            if (isErrorNotFound(err)) {
                return false;
            }
            throw err;
        });
}