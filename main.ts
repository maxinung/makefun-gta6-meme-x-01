// main.ts — hands in this repo's GTA 6 meme post for the make.fun bounty.
// The post itself is the entry: the meme is made, posted on X from a public
// account with make.fun (a link or written out) and/or @makefunai plus the
// play code in its text, and POST.json names that post. All this program
// does is carry POST.json from the repository into /output/POST.json, where
// the gate reads it. Nothing written here about the post is judged.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });

let post;
try {
  post = readFileSync(join(botDir, 'POST.json'));
} catch (err) {
  console.error(`could not read POST.json in ${botDir}: ${err}`);
  process.exit(1);
}

try {
  writeFileSync(join(outDir, 'POST.json'), post);
} catch (err) {
  console.error(`could not write POST.json into ${outDir}: ${err}`);
  process.exit(1);
}
