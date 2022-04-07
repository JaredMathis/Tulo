import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'
import element_button_primary from '../element/button_primary.mjs'
import top100 from '../english/top100.txt.json' assert { type: 'json' };
import _ from '../external/lodash.mjs'
import phrase_untranslated from './phrase_untranslated.mjs';
import phrase_translated from './phrase_translated.mjs';
import element_on_click from '../element/on_click.mjs';
import tulo_audio_play from './audio_play.mjs';
import translations from '../languages/ceb/translations.json' assert { type: 'json' };

function js_random_integer(max) {
    return Math.floor(Math.random() * max)
}

export default function tulo_main(parent) {
    let first_4 = top100.slice(0, 4);
    let choices_english = first_4;

    element_on_click(element_button_primary(parent, 'Start'), refresh);

    function refresh() {
        // clear
        element_html_inner(parent, '');

        refresh_binary();

        let button_all = element_button_primary(parent, 'all');
        element_on_click(button_all, () => {
            choices_english.forEach(f => {
                element_add(parent, 'hr')
                phrase_untranslated(element_add(parent, 'div'), f)
                phrase_translated(element_add(parent, 'div'), f)
            })
        })

        function refresh_binary() {
            let container = element_add(parent, 'div');

            let question_english = choices_english[js_random_integer(choices_english.length)];

            let yes = Math.random() > 0.5;

            let answer_english;
            if (yes) {
                answer_english = question_english;
            } else {
                let wrong_choices_english = _.without(choices_english, question_english);
                // console.log({wrong_choices_english})
                let answer_index = js_random_integer(wrong_choices_english.length);
                answer_english = wrong_choices_english[answer_index];
            }

            phrase_untranslated(element_add(container, 'div'), question_english);
            let translated = phrase_translated(element_add(container, 'div'), answer_english);
            translated.play();

            let question_translated = translations[question_english];
            let answer_translated = translations[answer_english];

            let answer_match = question_translated === answer_translated;

            let button_yes = element_button_primary(container, 'Yes');
            element_on_click(button_yes, () => {
                if (answer_match) {
                    refresh();
                } else {
                    button_yes.disabled = true;
                }
            });

            let button_no = element_button_primary(container, 'No');
            element_on_click(button_no, () => {
                if (answer_match) {
                    button_no.disabled = true;
                } else {
                    refresh();
                }
            });
        }
    }
}