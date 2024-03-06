import pmex from 'pmex';

const dirs = ['packages/core', 'packages/web', 'packages/native'];

for (const cwd of dirs) {
  pmex('prettier "./src/**/*.{js,jsx,ts,tsx}" --check', { cwd });

  // pmex('eslint "./src/**/*.{js,jsx,ts,tsx}" --max-warnings=0', { cwd });

  pmex('tsc --noEmit --skipLibCheck', { cwd });
}
