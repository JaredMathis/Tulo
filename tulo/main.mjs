import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'
import element_button_primary from '../element/button_primary.mjs'
import top100 from '../english/top100.txt.json' assert { type: 'json' };
import _ from '../external/lodash.mjs'
import phrase_untranslated from './phrase_untranslated.mjs';
import phrase_translated from './phrase_translated.mjs';
import element_on_click from '../element/on_click.mjs';

function js_random_integer(max) {
    return Math.floor(Math.random() * max)
}

export default function tulo_main(parent) {
    let first_4 = top100.slice(0, 4);

    let choices_english = first_4;

    let question_english = choices_english[js_random_integer(choices_english.length)]

    let yes = Math.random() > 0.5;

    let prompt_english;
    if (yes) {
        prompt_english = question_english;
    } else {
        let wrong_choices_english = _.without(choices_english, question_english);
        // console.log({wrong_choices_english})
        let prompt_index = js_random_integer(wrong_choices_english.length)
        prompt_english = wrong_choices_english[prompt_index]
    }

    phrase_untranslated(element_add(parent, 'div'), question_english);    

    phrase_translated(element_add(parent, 'div'), prompt_english);

    let button_yes = element_button_primary(parent, 'Yes');
    element_on_click(button_yes, () => {
        if (yes) {
            alert('correct')
        } else {
            button_yes.disabled = true;
        }
    })

    let button_no = element_button_primary(parent, 'No');
    element_on_click(button_no, () => {
        if (yes) {
            button_no.disabled = true;
        } else {
            alert('correct')
        }
    })

    // let header3 = element_add(parent, 'h1');
    // element_html_inner(header3, yes ? 'Yes' : 'No'); 

    // first_4.forEach(f => {
    //     element_add(parent, 'hr')
    //     phrase_untranslated(element_add(parent, 'div'), f)
    //     phrase_translated(element_add(parent, 'div'), f)
    // })
}