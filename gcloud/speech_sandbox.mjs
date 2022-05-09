import gcloud_text_to_speech from "./text_to_speech.mjs";

let text = `how are you doing? I'm doing fine.`;

const languageCode = 'en-US';
await gcloud_text_to_speech(text, languageCode, 'test2')