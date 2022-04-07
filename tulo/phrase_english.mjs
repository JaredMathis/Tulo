import element_add from "../element/add.mjs";
import element_html_inner from "../element/html_inner.mjs";

export default function phrase_english(parent, english_phrase) {
    let result = element_add(parent, 'span');
    element_html_inner(result, english_phrase);  
    return result;
}