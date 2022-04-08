export default function js_sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}