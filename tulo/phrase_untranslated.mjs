import element_add from "../element/add.mjs";
import element_html_inner from "../element/html_inner.mjs";

export default function phrase_untranslated(parent, english_phrase) {
    let container = element_add(parent, 'span');

    let left = element_add(container, 'span');
    element_html_inner(left, 'English: ');  
    
    let right = element_add(container, 'b')
    element_html_inner(right, english_phrase);  

    return { container };
}