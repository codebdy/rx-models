export function getExt(name: string) {
  if (!name) {
    return name;
  }
  const index = name.lastIndexOf('.');
  return name
    .substr(index + 1)
    .replace('*', 'x')
    .replace('|', 'x')
    .replace(':', 'x')
    .replace('<', 'x')
    .replace('>', 'x')
    .replace('\\', 'x')
    .replace('/', 'x')
    .replace('?', 'x')
    .replace("'", 'x')
    .replace('`', 'x')
    .replace('@', 'x')
    .replace('#', 'x')
    .replace('%', 'x')
    .replace('^', 'x')
    .replace('&', 'x')
    .replace('$', 'x');
}
