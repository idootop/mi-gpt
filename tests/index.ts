import { println } from "../src/utils/base";
import { kBannerASCII } from "../src/utils/string";
import { testDB } from "./db";
import { testSpeaker } from "./speaker";
import { testOpenAI } from "./openai";
import { testMyBot } from "./bot";
import { testLog } from "./log";
import { testMiGPT } from "./migpt";

async function main() {
  // println(kBannerASCII);
  // testDB();
  // testSpeaker();
  // testOpenAI();
  // testMyBot();
  // testLog();
  testMiGPT();
}

main();
