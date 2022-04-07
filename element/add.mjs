export default function element_add(parent, tag_name) {
    let result = document.createElement(tag_name);
    parent.appendChild(result);
    return result;
}