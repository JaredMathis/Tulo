import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'
import top100 from '../english/top100.txt.json' assert { type: 'json' };
import _ from '../external/lodash.mjs'
import phrase_untranslated from './phrase_untranslated.mjs';
import phrase_translated from './phrase_translated.mjs';

export default function tulo_main(parent) {
    let first_4 = top100.slice(0, 4);

    let choices_english = first_4;

    let question_english = choices_english[0]

    let yes = Math.random() > 0.5;

    let prompt_english;
    if (yes) {
        prompt_english = question_english;
    } else {
        let wrong_choices_english = _.without(choices_english, question_english);
        console.log({wrong_choices_english})
        let prompt_index = Math.floor(Math.random() * wrong_choices_english.length)
        prompt_english = wrong_choices_english[prompt_index]
    }

    phrase_untranslated(element_add(parent, 'div'), question_english);    

    phrase_translated(element_add(parent, 'div'), prompt_english);

    let header3 = element_add(parent, 'h1');
    element_html_inner(header3, yes); 

    first_4.forEach(f => {
        element_add(parent, 'hr')
        phrase_untranslated(element_add(parent, 'div'), f)
        phrase_translated(element_add(parent, 'div'), f)
    })
}