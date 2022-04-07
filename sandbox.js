import {TranslationServiceClient} from '@google-cloud/translate';
import gcloud_auth_initialize from './gcloud_auth_initialize.mjs';
import {promises as fs} from 'fs'

gcloud_auth_initialize()

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'peaceful-garden-346121';
const location = 'global';
const text = 'hello';
const targetLanguageCode = 'ceb';

async function translateText(targetLanguageCode, text) {
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