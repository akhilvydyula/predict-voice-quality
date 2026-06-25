#!/usr/bin/env node
/** Strips Cursor co-author trailers from commit messages (git filter-branch --msg-filter). */
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  data += chunk;
});
process.stdin.on('end', () => {
  const cleaned = data
    .split(/\r?\n/)
    .filter((line) => !/^Co-authored-by:\s*Cursor\s/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
  process.stdout.write(cleaned ? `${cleaned}\n` : '');
});
