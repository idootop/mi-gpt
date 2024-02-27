import { exec as execSync } from "child_process";
import { promisify } from "util";

const exec = promisify(execSync);

export class Shell {
  static async run(command: string) {
    return exec(command);
  }

  static get args() {
    return process.argv.slice(2);
  }
}
