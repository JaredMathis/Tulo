import element_class_add from "./class_add.mjs";

export default function element_classes_add(element, css_classes) {
    css_classes.forEach(css_class => {
        element_class_add(element, css_class);
    })
}