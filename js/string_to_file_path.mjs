export default function string_to_file_path(s) {
  return string_replace_all(s, '?', '_');
}

function string_remove_all(s, removal) {
  return string_replace_all(s, removal, '');
}

function string_replace_all(s, from, to) {
  let a = s.split(from);
  let result = a.join(to);
  return result;
}