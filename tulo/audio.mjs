export default function tulo_audio(translated) {
    var audio = new Audio(`.\\languages\\fil-PH\\audio\\${translated}.mp3`);
    return audio;
}