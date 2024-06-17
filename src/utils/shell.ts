import { exec as execSync } from "child_process";
import { promisify } from "util";

const exec = promisify(execSync);

interface StdIO {
  stdout?: string;
  stderr?: string;
  error?: any;
}

export class Shell {
  static get args() {
    return process.argv.slice(2);
  }

  static async run(
    command: string,
    options?: { silent?: boolean; cwd?: string }
  ): Promise<StdIO> {
    const { silent, cwd } = options ?? {};
    try {
      const { stdout, stderr } = await exec(command, { cwd });
      if (!silent) {
        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
      }
      return { stdout, stderr };
    } catch (error) {
      if (!silent) {
        console.error(`error: ${error}`);
      }
      return { error };
    }
  }
}
