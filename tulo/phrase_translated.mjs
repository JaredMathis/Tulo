
import element_add from '../element/add.mjs';
import element_html_inner from '../element/html_inner.mjs';
import element_on_click from '../element/on_click.mjs';
import translations from '../languages/ceb/translations.json' assert { type: 'json' };

export default function phrase_translated(parent, untranslated) {
    let translated = translations[untranslated];
    let right = element_add(parent, 'span');
    element_html_inner(right, translated)
    element_on_click(right, () => {
        var audio = new Audio(`.\\languages\\fil-PH\\audio\\${translated}.mp3`);
        audio.play();
    })
}
        