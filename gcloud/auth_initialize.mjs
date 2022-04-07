export default function gcloud_auth_initialize() {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'gitignore/key.json';
}

