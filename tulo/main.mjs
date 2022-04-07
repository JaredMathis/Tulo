import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'
import element_button_primary from '../element/button_primary.mjs'
import top100 from '../english/top100.txt.json' assert { type: 'json' };
import _ from '../external/lodash.mjs'
import phrase_untranslated from './phrase_untranslated.mjs';
import phrase_translated from './phrase_translated.mjs';
import element_on_click from '../element/on_click.mjs';
import translations from '../languages/ceb/translations.json' assert { type: 'json' };
import element_hide from '../element/hide.mjs';

function js_random_integer(max) {
    return Math.floor(Math.random() * max)
}

export default function tulo_main(parent) {
    let word_count = 8;
    let round_count = 16;
    let round_count_max = 16;
    let skipped_words = [
        'a',
    ]
    let choice_count = 4;
    let answers_from_previous = 4;
    let words = words_get();

    element_on_click(element_button_primary(parent, 'Start'), refresh);

    function words_get() {
        let filtered = top100.filter(w => !skipped_words.includes(w));
        let words_sorted = filtered.slice(0, word_count);
        let words = words_sorted;
        return words;
    }

    function refresh() {
        // clear
        element_html_inner(parent, '');

        let round_new = false;
        if (round_count === round_count_max) {
            round_count = 1;
            word_count++;
            words = words_get();
            round_new = true;
        } else {
            round_count++;
        }

        element_html_inner(element_add(parent, 'div'), 'Round: ' + round_count + ' / ' + round_count_max + '; words: ' + word_count)

        let result;
        if (js_random_integer(2) === 0) {
            result = refresh_multiple_translated_to_untranslated();
        } else {
            result = refresh_multiple_untranslated_to_translated();
        }
        let { container } = result;

        if (round_new) {
            element_hide(container)


        }

        let button_all = element_button_primary(parent, 'all');
        element_on_click(button_all, () => {
            words.forEach(word => {
                element_add(parent, 'hr')

                component_rosetta(word);
            })
        })

        function component_rosetta(word) {
            phrase_untranslated(element_add(parent, 'div'), word);
            phrase_translated(element_add(parent, 'div'), word);
        }

        function refresh_multiple_generic(on_load, on_success, question_phrase, choice_phrase) {
            let container = element_add(parent, 'div');

            // These are the words we're working on right now
            let answers = words.slice(word_count - answers_from_previous, word_count);
            let answer = answers[js_random_integer(answers_from_previous)];

            let words_without_answer = _.without(words, answer);
            words_without_answer = _.shuffle(words_without_answer);

            let choices_english = words_without_answer.slice(0, choice_count - 1).concat(answer);
            choices_english = _.shuffle(choices_english);

            console.log({choices_english, answer: answer, answers})

            let question_translated = translations[answer];

            let element_question = question_phrase(element_add(container, 'div'), answer);
            on_load(element_question);

            choices_english.forEach(choice_english => {
                let container_choice = element_add(container, 'div');
                let button_choice = element_button_primary(container_choice, 'Choose');
                let element_choice = choice_phrase(container_choice, choice_english);

                let choice_translated = translations[choice_english];
    
                let choice_match = question_translated[0] === choice_translated[0];
                // console.log({question_english,question_translated,choice_english,choice_translated})

                element_on_click(button_choice, () => {
                    if (choice_match) {
                        on_success(element_choice);

                    } else {
                        button_choice.disabled = true;
                    }
                });
            })

            return { container };
        }

        
        function refresh_multiple_translated_to_untranslated() {
            return refresh_multiple_generic(
                element_question_translated => element_question_translated.play(),
                refresh,
                phrase_translated,
                phrase_untranslated,
            )
        }

        function refresh_multiple_untranslated_to_translated() {
            return refresh_multiple_generic(
                _.noop,
                (choice_element) => {
                    choice_element.audio.addEventListener('ended', () => {
                        refresh();
                    })
                    choice_element.play();
                },
                phrase_untranslated,
                phrase_translated,
            )
        }

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