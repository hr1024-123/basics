import minimist from 'minimist';
import { argv } from 'process';

const { path } = minimist(argv.slice(2));

async function test() {
  if (!path) return;
  try {
    console.clear();
    await import(`./${path}/test.js`);
  } catch(e) {
    console.error(e);
  }
}

test();
