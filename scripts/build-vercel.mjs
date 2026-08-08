import { cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('pnpm', ['--filter', '@workspace/meridian', 'run', 'build'], {
  BASE_PATH: '/',
});

run('pnpm', ['--filter', '@workspace/aldric-dashboard', 'run', 'build'], {
  BASE_PATH: '/aldric-dashboard/',
});

const dashboardOut = path.join(root, 'artifacts/aldric-dashboard/dist/public');
const meridianDashboardOut = path.join(
  root,
  'artifacts/meridian/dist/public/aldric-dashboard',
);

rmSync(meridianDashboardOut, { recursive: true, force: true });
cpSync(dashboardOut, meridianDashboardOut, { recursive: true });
