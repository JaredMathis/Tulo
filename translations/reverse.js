import {promises as fs} from 'fs'
import _ from 'lodash'

let ceb_en = JSON.parse(await fs.readFile('./translations/ceb_en.json'));

let result = {};
for (let ceb in ceb_en) {
    let en = ceb_en[ceb][0].toLowerCase();
    if (!result[en]) {
        result[en] = [];
    }
    result[en].push(ceb);
}

await fs.writeFile('./translations/ceb_en_reversed.json', JSON.stringify(result, null, 2));