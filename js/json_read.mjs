import {promises as fs} from 'fs'

export default async function json_read(file_json_path) {
    const contents = await fs.readFile(file_json_path);
    let result = JSON.parse(contents);
    return result;
}