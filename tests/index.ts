import { MiGPT } from "../src";
// @ts-ignore
import config from "../.migpt.js";

async function main() {
  const client = MiGPT.create(config);
  await client.start();
}

main();
