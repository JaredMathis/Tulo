import element_add from '../element/add.mjs'
import element_html_inner from '../element/html_inner.mjs'
import element_button_primary from '../element/button_primary.mjs'
import top100 from '../words/simple1.txt.json' assert { type: 'json' };
import _ from '../external/lodash.mjs'
import phrase_untranslated from './phrase_untranslated.mjs';
import phrase_translated from './phrase_translated.mjs';
import element_on_click from '../element/on_click.mjs';
import element_hide from '../element/hide.mjs';
import element_show from '../element/show.mjs';
import element_classes_add from '../element/classes_add.mjs';
import js_sleep from '../js/sleep.mjs';
import tulo_translate from './translate.mjs';

function js_random_integer(max) {
    return Math.floor(Math.random() * max)
}

export default function tulo_main(parent) {
    // How many words the user has learned so far
    let word_count = 6;
    let question_count_max = 15;
    // question_count_max = 1
    let sleep_wait_ms = 0;
    let question_index;
    let skip_word_if = word => {
        return tulo_translate(word) === word.toLowerCase()
    }
    let choice_count = 4;
    let answers_from_previous = 5;
    let words = words_get();
    let mistakes = [];

    let mode_review_existing = 'mode_review_existing';
    let mode_learn_new = 'mode_learn_new';
    let mode_practice_mistakes = 'mode_practice_mistakes';
    let mode = mode_review_existing;

    // These are the words we're working on right now
    let answers = answers_get();

    component_home();

    function component_home() {
        // clear
        element_html_inner(parent, '');

        const learn_new_words = () => {
            let tutorial_word_count = 5;
            if (word_count <= tutorial_word_count) {
                console.log('here');

                word_count = tutorial_word_count + 1;
                words = words_get();

                let tutorial_words = words.slice(0, tutorial_word_count);
                let tutorial_words_repeated = _.shuffle(tutorial_words)
                    .concat(_.shuffle(tutorial_words))
                    .concat(_.shuffle(tutorial_words));

                console.log(words);

                tutorial_prompt();
                return;

                function tutorial_prompt() {

                    element_html_inner(parent, '');

                    console.log({ tutorial_words_repeated });

                    if (tutorial_words_repeated.length === 0) {
                        learn_new_words();
                        return;
                    }

                    let last = tutorial_words_repeated.pop();
                    new_word_prompt(last, [], () => {
                        tutorial_prompt();
                    });
                }

            } else {
                word_count--;
                question_index = question_count_max;
                mode = mode_learn_new;
                answers = answers_get();
                refresh();
            }

        };
        element_on_click(element_button_primary(element_add(parent, 'div'), 'Learn new words'), learn_new_words);
        element_on_click(element_button_primary(element_add(parent, 'div'), 'Review existing words'), () => {
            question_index = 0;
            mode = mode_review_existing;
            answers = answers_get();
            refresh();
        });
        element_on_click(element_button_primary(element_add(parent, 'div'), 'Practice mistakes'), () => {
            question_index = 0;
            mode = mode_practice_mistakes;
            answers = answers_get();
            refresh();
        });
        let button_all = element_button_primary(element_add(parent, 'div'), 'View all learned words');
        element_on_click(button_all, () => {
            words.forEach(word => {
                element_add(parent, 'hr')

                component_rosetta(parent, word);
            })
        })
    }

    function words_get() {
        let filtered = top100.filter(w => !skip_word_if(w));
        let words_sorted = filtered.slice(0, word_count);
        let words = words_sorted;
        console.log({filtered,words_sorted,words})
        return words;
    }

    function refresh() {
        // clear
        element_html_inner(parent, '');

        let round_new = false;

        if (mode === mode_learn_new && (question_index === question_count_max)) {
            question_index = 0;
            word_count++;
            words = words_get();
            answers = answers_get();
            round_new = true;            
        }
        
        question_index++;

        let go_home = () => {
            question_index--;
            component_home();
        };
        element_on_click(element_button_primary(parent, 'Go back home'), go_home);

        let container_labels = element_add(parent, 'div');

        element_html_inner(element_add(container_labels, 'div'), 'Progress: You are on question: ' + question_index + '. ')
        if (mode === mode_practice_mistakes) {
            element_html_inner(element_add(container_labels, 'div'), 'You have ' + mistakes.length + ' mistake(s) to practice.')
        }
        if (mode === mode_learn_new) {
            element_html_inner(element_add(container_labels, 'div'), 'You will learn a new word after question ' + question_count_max + ". ")
        }

        element_html_inner(element_add(container_labels, 'div'), 'You have learned ' + word_count + ' word(s).')
        element_add(container_labels, 'hr')
        element_html_inner(element_add(container_labels, 'div'), 'Translate the following word:')

        if (answers.length === 0) {
            if (mode === mode_practice_mistakes) {
                go_home();
                return;
            }
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

        if (mode === mode_learn_new && round_new) {
            let hides = [
                container,
                container_labels,
            ]
            function on_okay() {
                result.onload();
            }
            let new_word = _.last(words);
            new_word_prompt(new_word, hides, on_okay);
        } else {
            result.onload();
        }

        
        function refresh_multiple_generic(answer, on_success, question_phrase, choice_phrase) {
            let container = element_add(parent, 'div');

            let words_without_answer = _.without(words, answer);
            words_without_answer = _.shuffle(words_without_answer);

            let choices_english = words_without_answer.slice(0, choice_count - 1).concat(answer);
            choices_english = _.shuffle(choices_english);

            console.log({ choices_english });

            let question_translated = tulo_translate(answer);

            let element_question = question_phrase(element_add(container, 'div'), answer);

            let choices = [];
            choices_english.forEach(choice_english => {
                let container_choice = element_add(container, 'div');
                let button_choice = element_button_primary(container_choice, 'Choose');
                let element_choice = choice_phrase(container_choice, choice_english);

                let choice_translated = tulo_translate(choice_english);

                choices.push({
                    element_choice,
                    choice_english,
                    choice_translated,
                })

                // console.log({question_english,question_translated,choice_english,choice_translated})
                element_on_click(button_choice, () => {
                    let choice_match = question_translated === choice_translated;
                    if (choice_match) {
                        let elements = choices
                            .filter(c => c.choice_translated === question_translated)
                            .map(c => c.element_choice);
                        elements.push(
                            element_question);
                        elements.forEach(e => {
                            element_classes_add(e.container, ['bg-success', 'text-white']);
                        });

                        on_success(element_choice, element_question);

                    } else {
                        element_classes_add(element_choice.container, ['bg-danger', 'text-white']);
                        button_choice.disabled = true;
                        on_mistake([answer, choice_english]);
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
                    question_element.audio.addEventListener('ended', async () => {
                        await js_sleep(sleep_wait_ms)
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
                    choice_element.audio.addEventListener('ended', async () => {
                        await js_sleep(sleep_wait_ms);
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

            let question_translated = tulo_translate(question_english);
            let answer_translated = tulo_translate(answer_english);

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

    function new_word_prompt(new_word, hides, on_okay) {
        hides.forEach(s => element_hide(s));

        let container_rosetta = element_add(parent, 'div');
        element_html_inner(element_add(container_rosetta, 'div'), 'Here is a new word for you to learn: ');
        let rosetta = component_rosetta(container_rosetta, new_word);
        rosetta.translated.play();
        element_on_click(element_button_primary(container_rosetta, 'Let\'s practice this word!'), () => {
            element_hide(container_rosetta);
            hides.forEach(s => element_show(s));
            on_okay();
        });
        element_on_click(element_button_primary(container_rosetta, 'I already know this word!'), () => {
            word_count++;
        });
    }

    function on_mistake(untranslateds) {
        untranslateds.forEach(u => mistakes.push(u))
        console.log({mistakes})
    }

    function component_rosetta(parent, word) {
        let untranslated = phrase_untranslated(element_add(parent, 'div'), word);
        let translated = phrase_translated(element_add(parent, 'div'), word);
        [untranslated,translated]
            .forEach(e => element_classes_add(e.container, ['bg-success', 'text-white']))
        return {
            untranslated,
            translated,
        }
    }

    function answers_get() {
        let answers;
        let shuffle = true;
        if (mode === mode_review_existing) {
            answers = words;
        } else if (mode === mode_learn_new) {
            answers = last_n(words, word_count, answers_from_previous);
        } else if (mode === mode_practice_mistakes) {
            answers = mistakes;
            shuffle = false;
        }
        if (shuffle) {
            answers = _.shuffle(answers)
        }
        console.log({answers})
        return answers;
    }

    function last_n(array, limit, n) {
        return array.slice(limit - n, limit)
    }
}