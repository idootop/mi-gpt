import { exec as execSync, spawn } from "child_process";
import { promisify } from "util";
import { isNotEmpty } from "./is";

const exec = promisify(execSync);

interface StdIO {
  stdout: string;
  stderr: string;
}

export class Shell {
  static async run(command: string, options?: { silent?: boolean }) {
    const { silent } = options ?? {};
    if (silent) {
      return new Promise<StdIO>((resolve) => {
        const commands = command.split(" ").filter((e) => isNotEmpty(e.trim()));
        const bin = commands[0];
        const [, ...args] = commands;
        let res: StdIO = {
          stdout: "",
          stderr: "",
        };
        try {
          const ps = spawn(bin, args, {
            stdio: "ignore",
          });
          ps.stdout?.on("data", (data) => {
            res.stdout += data;
          });
          ps.stderr?.on("data", (data) => {
            res.stderr += data;
          });
          ps.on("close", () => {
            resolve(res);
          });
        } catch {
          resolve(res);
        }
      });
    }
    return exec(command);
  }

  static get args() {
    return process.argv.slice(2);
  }
}
