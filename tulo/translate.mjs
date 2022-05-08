import translations from '../translations/ceb_en_reversed.json' assert { type: 'json' };

export default function tulo_translate(word) {
    return translations[word][0].toLowerCase();
}