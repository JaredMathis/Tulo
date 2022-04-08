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
import element_show from '../element/show.mjs';
import element_classes_add from '../element/classes_add.mjs';

function js_random_integer(max) {
    return Math.floor(Math.random() * max)
}

export default function tulo_main(parent) {
    let word_count = 18;
    let question_count_max = 12;
    let question_index = 0;
    let skip_word_if = word => {
        return translations[word][0].toLowerCase() === word.toLowerCase()
    }
    let choice_count = 4;
    let answers_from_previous = 4;
    let words = words_get();

    let is_review = true;

    // These are the words we're working on right now
    let answers = answers_get();

    component_home();

    function component_home() {
        // clear
        element_html_inner(parent, '');
        
        element_on_click(element_button_primary(parent, 'Start'), refresh);
    }

    function words_get() {
        let filtered = top100.filter(w => !skip_word_if(w));
        let words_sorted = filtered.slice(0, word_count);
        let words = words_sorted;
        return words;
    }

    function refresh() {
        // clear
        element_html_inner(parent, '');

        let round_new = false;

        if (!is_review && question_index === question_count_max) {
            question_index = 0;
            word_count++;
            words = words_get();
            answers = answers_get();
            round_new = true;            
        }
        
        question_index++;

        element_on_click(element_button_primary('Home'), () => {

        });

        let label = 'Question: ' + question_index + (is_review ? '' : ' / ' + question_count_max) + '; words: ' + word_count;
        element_html_inner(element_add(parent, 'div'), label)

        if (answers.length === 0) {
            answers = answers_get();
        }
        let answer = answers.pop();

        console.log({answer, answers})

        let result;
        if (js_random_integer(2) === 0) {
            result = refresh_multiple_translated_to_untranslated(answer);
        } else {
            result = refresh_multiple_untranslated_to_translated(answer);
        }
        let { container } = result;

        if (!is_review && round_new) {
            element_hide(container)

            let container_rosetta = element_add(parent, 'div')
            element_html_inner(element_add(container_rosetta, 'div'), 'New word: ');
            let rosetta = component_rosetta(container_rosetta, _.last(words));
            rosetta.translated.play();
            element_on_click(element_button_primary(container_rosetta, 'Okay!'), () => {
                element_hide(container_rosetta)
                element_show(container)
                result.onload();
            })
        } else {
            result.onload();
        }

        let button_all = element_button_primary(parent, 'all');
        element_on_click(button_all, () => {
            words.forEach(word => {
                element_add(parent, 'hr')

                component_rosetta(parent, word);
            })
        })

        function component_rosetta(parent, word) {
            let untranslated = phrase_untranslated(element_add(parent, 'div'), word);
            let translated = phrase_translated(element_add(parent, 'div'), word);
            return {
                untranslated,
                translated,
            }
        }
        
        function refresh_multiple_generic(answer, on_success, question_phrase, choice_phrase) {
            let container = element_add(parent, 'div');

            let words_without_answer = _.without(words, answer);
            words_without_answer = _.shuffle(words_without_answer);

            let choices_english = words_without_answer.slice(0, choice_count - 1).concat(answer);
            choices_english = _.shuffle(choices_english);

            console.log({ choices_english });

            let question_translated = translations[answer];

            let element_question = question_phrase(element_add(container, 'div'), answer);

            choices_english.forEach(choice_english => {
                let container_choice = element_add(container, 'div');
                let button_choice = element_button_primary(container_choice, 'Choose');
                let element_choice = choice_phrase(container_choice, choice_english);

                let choice_translated = translations[choice_english];

                let choice_match = question_translated[0] === choice_translated[0];
                // console.log({question_english,question_translated,choice_english,choice_translated})
                element_on_click(button_choice, () => {
                    if (choice_match) {
                        let elements = [
                            element_choice,
                            element_question,
                        ];
                        elements.forEach(e => {
                            element_classes_add(e.container, ['bg-success', 'text-white']);
                        });

                        on_success(element_choice, element_question);

                    } else {
                        element_classes_add(element_choice.container, ['bg-danger', 'text-white']);
                        button_choice.disabled = true;
                    }
                });
            });

            return {
                container,
                element_question,
            };
        }

        function refresh_multiple_translated_to_untranslated(answer) {
            let result;
            let onload = () => {
                result.element_question.play();
            }
            result = refresh_multiple_generic(
                answer,
                (choice_element, question_element) => {
                    question_element.audio.addEventListener('ended', () => {
                        refresh();
                    })
                    question_element.play();
                },
                phrase_translated,
                phrase_untranslated,
            )
            result.onload = onload;
            return result;
        }

        function refresh_multiple_untranslated_to_translated(answer) {
            let onload = _.noop
            let result = refresh_multiple_generic(
                answer,
                (choice_element) => {
                    choice_element.audio.addEventListener('ended', () => {
                        refresh();
                    })
                    choice_element.play();
                },
                phrase_untranslated,
                phrase_translated,
            )
            result.onload = onload;
            return result;
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

    function answers_get() {
        let answers;
        if (is_review) {
            answers = words;
        } else {
            answers = words.slice(word_count - answers_from_previous, word_count);
        }
        answers = _.shuffle(answers)
        return answers;
    }
}