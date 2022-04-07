import element_add from "./add.mjs";
import element_html_inner from "./html_inner.mjs";
import _ from "../external/lodash.mjs";

export default function element_button(parent, button_text) {
    let result = element_add(parent, 'button');
    element_html_inner(result, button_text || '');
    return result;
}