export function makeRegex(pattern, ignoreCase) {
  if (pattern === '') {
    return { regex: null, error: '' };
  }
 
  let flags = '';
  if (ignoreCase) {
    flags = 'i';
  }
 
  try {
    return { regex: new RegExp(pattern, flags), error: '' };
  } catch (error) {
    return { regex: null, error: 'Invalid pattern: ' + error.message };
  }
}
 
export function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
 
export function highlight(text, regex) {
  text = String(text);
 
  if (regex === null) {
    return escapeHTML(text);
  }
 
  const globalRegex = new RegExp(regex.source, regex.flags + 'g');
  let result = '';
  let lastEnd = 0;
  let match = globalRegex.exec(text);
 
  while (match !== null) {
    if (match[0] === '') {
      globalRegex.lastIndex++;   
    } else {
      result += escapeHTML(text.slice(lastEnd, match.index));
      result += '<mark>' + escapeHTML(match[0]) + '</mark>';
      lastEnd = match.index + match[0].length;
    }
    match = globalRegex.exec(text);
  }
 
  result += escapeHTML(text.slice(lastEnd));
  return result;
}
 
export function recordMatches(record, regex) {
  if (regex === null) {
    return true;
  }
  return (
    regex.test(record.description) ||
    regex.test(record.category) ||
    regex.test(String(record.amount)) ||
    regex.test(record.date)
  );
}
