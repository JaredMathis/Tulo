import translations from '../translations/en_ceb.json' assert { type: 'json' };

export default function tulo_translate(word) {
    return translations[word][0].toLowerCase();
}