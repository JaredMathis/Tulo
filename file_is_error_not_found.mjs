export default function file_is_error_not_found(err) {
    return err.code === "ENOENT";
}