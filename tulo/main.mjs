import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'
import top100 from '../english/top100.txt.json' assert { type: 'json' };

export default function tulo_main(parent) {
    let first_4 = top100.slice(0, 4);

    first_4.forEach(f => {
        let element = element_add(parent, 'h1');
        element_html_inner(element, f)
    })
}