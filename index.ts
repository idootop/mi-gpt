import { MiGPT } from "mi-gpt";
import config from "./.migpt.js";

async function main() {
  const migpt = MiGPT.create(config);
  await migpt.start();
}

main();
