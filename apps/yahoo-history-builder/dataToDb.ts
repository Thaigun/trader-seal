import { db } from './db.ts';

const assetsFile = await Deno.readTextFile('./input/assets.json');
const assets = JSON.parse(assetsFile);

