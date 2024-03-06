import { cpSync, rmSync } from 'fs';
import pmex from 'pmex';

const isNative = process.argv.includes('--native');
const isWeb = process.argv.includes('--web') || !isNative;

if (isWeb && isNative) {
  throw new Error('Choose --web or --native, not both.');
}

const platform = isNative ? 'native' : 'web';
const cwd = `./examples/${platform}`;

pmex('build');

pmex(
  {
    npm: `install && npm prune`,
    pnpm: `install --fix-lockfile`,
    yarn: `install --check-files`,
  },
  { cwd },
);

rmSync(`${cwd}/node_modules/@react-bulk`, {
  force: true,
  recursive: true,
});

const packages = ['core', platform];

for (const pkg of packages) {
  cpSync(`./packages/${pkg}/dist`, `${cwd}/node_modules/@react-bulk/${pkg}/dist`, {
    force: true,
    recursive: true,
  });

  cpSync(`./packages/${pkg}/package.json`, `${cwd}/node_modules/@react-bulk/${pkg}/package.json`, {
    force: true,
  });
}

if (isWeb) {
  pmex('vite dev --force', { cwd });
}

if (isNative) {
  pmex(`expo start -c`, { cwd });
}
