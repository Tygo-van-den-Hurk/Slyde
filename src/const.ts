import PKG from '#package' with { type: 'json' };
import chalk from 'chalk';

const { author, bugs, homepage, repository, version } = PKG;
const url = (str: string): string => chalk.underline.cyan(str);

/** Some information about the package. */
export const pkg = {
  author,
  homepage,
  issues: bugs.url,
  name: 'slyde',
  repo: repository.url,
  version,
} as const;

/** The (base) epilogue to put at the bottom of each command. */
export const epilogue = `
For the documentation go to ${url(pkg.homepage)}. You can report bugs or create request features by opening an 
issue on ${url(pkg.issues)}, or even better yet a pull request. To see the source code for yourself, you can
go to ${url(pkg.repo)}.
`
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line !== '')
  .join(' ');
