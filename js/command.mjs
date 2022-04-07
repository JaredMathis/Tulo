import { exec } from 'child_process';

/**
 * From: https://ali-dev.medium.com/how-to-use-promise-with-exec-in-node-js-a39c4d7bbf77
 * 
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
 export default function command(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout? stdout : stderr);
    });
  });
}