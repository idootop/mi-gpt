import dotenv from "dotenv";
import { println } from "../src/utils/base";
import { kBannerASCII } from "../src/utils/string";
import { runWithDB } from "../src/services/db";

dotenv.config();

async function main() {
  println(kBannerASCII);
}

runWithDB(main);
