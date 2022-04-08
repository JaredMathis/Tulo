import string_to_file_path from "../js/string_to_file_path.mjs"

export default function tulo_audio(translated) {
    var audio = new Audio(`.\\languages\\fil-PH\\audio\\${string_to_file_path(translated)}.mp3`);
    return audio;
}