
import {promises as fs} from 'fs'
import directory_exists from './directory_exists.mjs'

export default async function directory_create_if_not_exists(directory) {
    if (!await directory_exists(directory)) {
        await fs.mkdir(directory, { recursive: true });
    }
}