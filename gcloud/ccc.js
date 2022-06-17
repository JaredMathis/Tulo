import gcloud_text_to_speech from "./text_to_speech.mjs";
import json_read from "../js/json_read.mjs";
import textToImage from "text-to-image";
import command from '../js/command.mjs'
import file_exists from "../js/file_exists.mjs";
import {promises as fs} from 'fs'
import _ from "lodash";

let never_generate_video = true;
let always_generate_image = false;
let always_generate_video = false;

const languageCode = 'en-US';

let parsed = await json_read('../Catholic/generated/ccc.json');

let parts = [
    {
        name: 'PROLOGUE',
        first: '__P1.HTM'
    },
    {
        name: 'PART ONE: THE PROFESSION OF FAITH',
        first: '__P8.HTM',
    },
    {
        name: 'PART TWO: THE CELEBRATION OF THE CHRISTIAN MYSTERY',
        first: '__P2T.HTM',
    },
    {
        name: 'PART THREE: LIFE IN CHRIST',
        first: '__P5D.HTM',
    },
    {
        name: 'PART FOUR: CHRISTIAN PRAYER',
        first: '__P8Z.HTM',
    },
    // {
    //     name: '',
    //     first: '__P.HTM'
    // },
    // {
    //     name: '',
    //     first: '__P.HTM'
    // },
]

parts.forEach(part => {
    part.first_parargaph_index = _.find(parsed, p => p.href === part.first).paragraph;
    part.files = [];
})
parts.forEach(part => {
    let index = parts.indexOf(part);
    let index_next = index + 1;
    if (index_next < parts.length) {
        part.last_paragraph_index = parts[index_next].first_parargaph_index - 1;
    } else {
        part.last_paragraph_index = _.last(parsed).paragraph
    }
})

console.log(parts)

// let books = {};
// for (let p of parsed) {
//     if (!books[p.book]) {
//         books[p.book] = [];
//     }
// }

let verses = parsed;

for (let v of verses) {
    let text = v.text
    let file_name = 'ccc/' + v.paragraph;
    let {output_path} = await gcloud_text_to_speech(text, languageCode, file_name);

    let file_name_image = './image/' + file_name + '.png';
    if (always_generate_image || !await file_exists(file_name_image)) {
        await textToImage.generate(text.replaceAll('\n', ' ').replaceAll('\r', ' '), {
            maxWidth: 800,
            customHeight: 800,
            debug: true,
            debugFilename: file_name_image,
        });
    }

    if (never_generate_video) {
        continue;
    }

    let file_name_video = `./video/${file_name}.mkv`;
    if (always_generate_video || !await file_exists(file_name_video)) {
        await command(`ffmpeg -loop 1 -i "${file_name_image}" -i "${output_path}" -shortest -acodec copy -vcodec mjpeg "${file_name_video}"`)
    }

    // _.find(parts, part => v.paragraph >= part.first_parargaph_index).

    // books[v.book].push('../' + file_name_video)
}

// for (let book in books) {
//     let video_paths = books[book];
//     let joined = video_paths.map(p => `file '${p}'`).join("\n");
//     let temp_file_name = `gitignore/${book}.txt`;
//     fs.writeFile(temp_file_name, joined);
//     let cmd = `ffmpeg -f concat -safe 0 -i "${temp_file_name}" -c copy "gitignore/${book} - Catholic Audio Bible - Douay-Rheims Version.mkv"`
//     let output = await command(cmd)
// }


// console.log(output)