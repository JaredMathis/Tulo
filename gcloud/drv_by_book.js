import gcloud_text_to_speech from "./text_to_speech.mjs";
import json_read from "../js/json_read.mjs";
import textToImage from "text-to-image";
import command from '../js/command.mjs'
import file_exists from "../js/file_exists.mjs";
import {promises as fs} from 'fs'
import _ from "lodash";

let always_generate_image = false;
let always_generate_video = false;

const languageCode = 'en-US';

let parsed = await json_read('../BiblePublic/public/drv_parsed.json');

parsed = parsed.filter(p => p.book === 'Leviticus');

let books = {};
for (let p of parsed) {
    if (!books[p.book]) {
        books[p.book] = [];
    }
}

let verses = parsed;

for (let v of verses) {
    let text = v.tokens.join(' ')
    let file_name = 'bible/' + v.reference.replace(':', '_');
    let {output_path} = await gcloud_text_to_speech(text, languageCode, file_name);

    let file_name_image = './image/' + file_name + '.png';
    if (always_generate_image || !await file_exists(file_name_image)) {
        await textToImage.generate(v.reference + ' ' + text, {
            customHeight: 400,
            debug: true,
            debugFilename: file_name_image,
        });
    }

    let file_name_video = `./video/${file_name}.mkv`;
    if (always_generate_video || !await file_exists(file_name_video)) {
        await command(`ffmpeg -loop 1 -i "${file_name_image}" -i "${output_path}" -shortest -acodec copy -vcodec mjpeg "${file_name_video}"`)
    }

    books[v.book].push('../' + file_name_video)
}

for (let book in books) {
    let video_paths = books[book];
    let joined = video_paths.map(p => `file '${p}'`).join("\n");
    let temp_file_name = `gitignore/${book}.txt`;
    fs.writeFile(temp_file_name, joined);
    let cmd = `ffmpeg -f concat -safe 0 -i "${temp_file_name}" -c copy "gitignore/${book} - Catholic Audio Bible - Douay-Rheims Version.mkv"`
    let output = await command(cmd)
}


// console.log(output)