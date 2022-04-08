import element_add from "./add.mjs";
import element_classes_add from "./classes_add.mjs";

export default function element_icon(container, icon_name) {
    let icon = element_add(container, 'i');
    element_classes_add(icon, ['bi', 'bi-' + icon_name])
    return icon;
}