export default function tulo_audio_play(translated) {
    var audio = new Audio(`.\\languages\\fil-PH\\audio\\${translated}.mp3`);
    audio.play();
}