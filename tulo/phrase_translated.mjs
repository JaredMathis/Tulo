
import element_add from '../element/add.mjs';
import element_html_inner from '../element/html_inner.mjs';
import element_icon from '../element/icon.mjs';
import element_on_click from '../element/on_click.mjs';
import tulo_audio from './audio.mjs';
import tulo_translate from './translate.mjs';

export default function phrase_translated(parent, untranslated) {
    let container = element_add(parent, 'span');

    let left = element_add(container, 'span');
    element_html_inner(left, 'Cebuano: ');  

    let button_play = element_icon(container, 'volume-up-fill');
    button_play.setAttribute('role', 'button')
    element_html_inner(element_add(container, 'span'), ' ');  
    
    let right = element_add(container, 'b')
    let translated = tulo_translate(untranslated);
    element_html_inner(right, translated);  

    let audio = tulo_audio(translated);

    const play = () => {
        audio.play();
    };
    element_on_click(button_play, play)

    return {
        container,
        play,
        audio,
    };
}
        