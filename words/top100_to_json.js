import {promises as fs} from 'fs'

let path_top100 = './words/top100.txt';
let top100_text = await fs.readFile(path_top100, 'utf8')
let rows = top100_text.split('\n');
let mapped = rows.map(row => row.split('\t')[0])
await fs.writeFile(path_top100 + '.json', JSON.stringify(mapped, null, 2));