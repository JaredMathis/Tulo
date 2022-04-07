import {promises as fs} from 'fs'
import file_is_error_not_found from './file_is_error_not_found.mjs';

export default async function directory_exists(path) {
    try {
        let fsStat = await fs.stat(path);
        return fsStat.isDirectory();
    } catch (e) {
        if (file_is_error_not_found(e)) {
            return false;
        }
        throw e;
    }
}