import {promises as fs} from 'fs'
import file_is_error_not_found from './file_is_error_not_found.mjs';

export default function file_exists(path) {
    return fs
        .stat(path)
        .then(fsStat => {
            return fsStat.isFile();
        })
        .catch(err => {
            if (file_is_error_not_found(err)) {
                return false;
            }
            throw err;
        });
}