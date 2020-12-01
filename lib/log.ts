import chalk from "chalk";
import { format } from "util";
/**
 * Prefix.
 */
const prefix = "   build-cli";
const sep = chalk.gray("·");

/**
 * Log.
 * @param {String} message
 */
export const log = function (...args: any[]) {
  const msg = format.apply(format, args);
  console.log(chalk.white(prefix), sep, msg);
};

/**
 * 输出失败信息.
 * @param {String} message
 */

export const fatal = function (...args: { message: string }[] | string[]) {
  if (args[0] instanceof Error) args[0] = args[0].message.trim();
  const msg = format.apply(format, args);
  console.error(chalk.red(prefix), sep, msg);
  process.exit(1);
};

/**
 * 输出成功信息.
 * @param {String} message
 */

export const success = function (...args: any[]) {
  const msg = format.apply(format, args);
  console.log(chalk.white(prefix), sep, msg);
};
