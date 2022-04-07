import element_class_add from "./class_add.mjs";
import element_button from "./button.mjs";

export default function element_button_type(parent, button_type, button_text) {
    let result = element_button(parent, button_text);
    element_class_add(result, 'btn');
    element_class_add(result, 'btn-' + button_type);
    return result;
}