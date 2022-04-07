import element_class_add from "./class_add.mjs";
import element_class_remove from "./class_remove.mjs";

export default function element_hide(element) {
    element_class_remove(element, 'd-block');
    element_class_add(element,'d-none');
}