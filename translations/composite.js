import {promises as fs} from 'fs'
import _ from 'lodash'

let en_ceb = JSON.parse(await fs.readFile('./translations/en_ceb.json'));
let ceb_en = JSON.parse(await fs.readFile('./translations/ceb_en.json'));

for (let ceb in ceb_en) {
    for (let en of ceb_en[ceb]) {
        en = en.toLowerCase();
        if (!en_ceb[en]) {
            en_ceb[en] = [];
        }
        if (!en_ceb[en].includes(ceb)) {
            en_ceb[en].push(ceb)
        }
    }
}

for (let en in en_ceb) {
    let v = _.uniq(en_ceb[en].map(ceb => ceb.toLowerCase()));
    en_ceb[en] = v;
}

await fs.writeFile('./translations/en_ceb_composite.json', JSON.stringify(en_ceb, null, 2));
