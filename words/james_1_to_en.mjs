import {promises as fs} from 'fs'
import tulo_translate_reverse from '../tulo/translate_reverse.mjs';

let path_james_1 = './words/james_1.json';
let james_1_text = await fs.readFile(path_james_1, 'utf8')
let james_1 = JSON.parse(james_1_text);

let path_james_1_en = './words/james_1.en.json';
let james_1_en = james_1.map(w => tulo_translate_reverse(w))
let james_1_en_text = JSON.stringify(james_1_en, null, 2);
await fs.writeFile(path_james_1_en, james_1_en_text)



