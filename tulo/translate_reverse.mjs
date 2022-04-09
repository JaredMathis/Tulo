import translations from '../translations/ceb_en.json' assert { type: 'json' };

export default function tulo_translate_reverse(word) {
    return translations[word][0].toLowerCase();
}