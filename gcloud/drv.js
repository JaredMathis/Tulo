import gcloud_text_to_speech from "./text_to_speech.mjs";
import json_read from "../js/json_read.mjs";

const languageCode = 'en-US';

let parsed = await json_read('../BiblePublic/public/drv_parsed.json');

let jude = parsed.filter(p => p.book === 'Jude');
let verses = jude;

for (let v of verses) {
    let text = v.tokens.join(' ')
    await gcloud_text_to_speech(text, languageCode, v.reference.replace(':', '_'));
}