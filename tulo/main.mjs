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

    refresh();

    function refresh() {
        // clear
        element_html_inner(parent, '');

        let container = element_add(parent, 'div');
            
        let question_english = choices_english[js_random_integer(choices_english.length)]

        let yes = Math.random() > 0.5;

        let answer_english;
        if (yes) {
            answer_english = question_english;
        } else {
            let wrong_choices_english = _.without(choices_english, question_english);
            // console.log({wrong_choices_english})
            let answer_index = js_random_integer(wrong_choices_english.length)
            answer_english = wrong_choices_english[answer_index]
        }

        phrase_untranslated(element_add(container, 'div'), question_english);    

        phrase_translated(element_add(container, 'div'), answer_english);

        let answer_match = answer_english === question_english;

        let button_yes = element_button_primary(container, 'Yes');
        element_on_click(button_yes, () => {
            if (answer_match) {
                refresh();
            } else {
                button_yes.disabled = true;
            }
        })

        let button_no = element_button_primary(container, 'No');
        element_on_click(button_no, () => {
            if (answer_match) {
                button_no.disabled = true;
            } else {
                refresh();
            }
        })

        let button_all = element_button_primary(parent, 'all');
        element_on_click(button_all, () => {
            choices_english.forEach(f => {
                element_add(parent, 'hr')
                phrase_untranslated(element_add(parent, 'div'), f)
                phrase_translated(element_add(parent, 'div'), f)
            })
        })

    }
}