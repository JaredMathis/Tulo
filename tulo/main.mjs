import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'

export default function tulo_main(parent) {
    let div = element_add(parent, 'div');
    element_html_inner(div, 'hello world')
}