import { runWithDB } from "./services/db";
import { println } from "./utils/base";
import { kBannerASCII } from "./utils/string";

async function main() {
  println(kBannerASCII);
}

runWithDB(main);
