import translations from '../languages/ceb/translations.json' assert { type: 'json' };

export default function tulo_translate(word) {
    return translations[word][0].toLowerCase();
}