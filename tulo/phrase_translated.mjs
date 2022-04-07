
import element_add from '../element/add.mjs';
import element_classes_add from '../element/classes_add.mjs';
import element_html_inner from '../element/html_inner.mjs';
import element_on_click from '../element/on_click.mjs';
import translations from '../languages/ceb/translations.json' assert { type: 'json' };
import tulo_audio from './audio.mjs';

export default function phrase_translated(parent, untranslated) {
    let container = element_add(parent, 'span');

    let left = element_add(container, 'span');
    element_html_inner(left, 'Cebuano: ');  
    element_classes_add(left, ['text-muted'])
    
    let right = element_add(container, 'span')
    let translated = translations[untranslated];
    element_html_inner(right, translated);  

    let audio = tulo_audio(translated);

    const play = () => {
        audio.play();
    };
    element_on_click(right, play)

    return {
        container,
        play,
        audio,
    };
}
        