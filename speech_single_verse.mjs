import gcloud_text_to_speech from "./gcloud/text_to_speech.mjs";

let text = `Sa sinugdan mao na ang Pulong, ug ang Pulong uban sa Dios, ug Dios ang Pulong.`;

const languageCode = 'fil-PH';
await gcloud_text_to_speech(text, languageCode, 'John_1_1')