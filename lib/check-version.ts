import chalk from "chalk";
import packageConfig from "../package.json";
import semver from "semver";

export default (done: () => void) => {
  // 判断node和npm版本
  const requiredVersion = packageConfig.engines.node;
  if (!semver.satisfies(process.version, requiredVersion)) {
    return console.log(
      chalk.red("  请升级node版本 >=" + requiredVersion + ".x")
    );
  }
  done();
};
