import { PostDirectiveClass } from 'src/directive/post/post.directive.class';
import { QueryDirectiveClass } from 'src/directive/query/query.directive.class';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require('glob');
/**
 * Loads all exported directives from the given directory.
 */
export function importDirectivesFromDirectories(
  directories: string[],
  formats = ['.js', '.cjs', '.ts'],
  // eslint-disable-next-line @typescript-eslint/ban-types
): QueryDirectiveClass[] | PostDirectiveClass[] {
  const logLevel = 'info';
  const classesNotFoundMessage =
    'No classes were found using the provided glob pattern: ';
  const classesFoundMessage = 'All classes found using provided glob pattern';
  // eslint-disable-next-line @typescript-eslint/ban-types
  function loadFileClasses(
    exported: any,
    allLoaded: QueryDirectiveClass[] | PostDirectiveClass[],
  ) {
    if (
      typeof exported === 'function' /*|| exported instanceof EntitySchema*/
    ) {
      allLoaded.push(exported);
    } else if (Array.isArray(exported)) {
      exported.forEach((i: any) => loadFileClasses(i, allLoaded));
    } else if (typeof exported === 'object' && exported !== null) {
      Object.keys(exported).forEach((key) =>
        loadFileClasses(exported[key], allLoaded),
      );
    }
    return allLoaded;
  }

  const allFiles = directories.reduce((allDirs, dir) => {
    return allDirs.concat(glob.sync(PlatformTools.pathNormalize(dir)));
  }, [] as string[]);

  if (directories.length > 0 && allFiles.length === 0) {
    console.debug(logLevel, `${classesNotFoundMessage} "${directories}"`);
  } else if (allFiles.length > 0) {
    console.debug(
      logLevel,
      `${classesFoundMessage} "${directories}" : "${allFiles}"`,
    );
  }
  const dirs = allFiles
    .filter((file) => {
      const dtsExtension = file.substring(file.length - 5, file.length);
      return (
        formats.indexOf(PlatformTools.pathExtname(file)) !== -1 &&
        dtsExtension !== '.d.ts'
      );
    })
    .map((file) => require(PlatformTools.pathResolve(file)));

  return loadFileClasses(dirs, []);
}

export function importJsonsFromDirectories(
  directories: string[],
  format = '.json',
): any[] {
  const allFiles = directories.reduce((allDirs, dir) => {
    return allDirs.concat(glob.sync(PlatformTools.pathNormalize(dir)));
  }, [] as string[]);

  return allFiles
    .filter((file) => PlatformTools.pathExtname(file) === format)
    .map((file) => require(PlatformTools.pathResolve(file)));
}
