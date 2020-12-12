import path from "path";
import chalk from "chalk";
import Metalsmith from "metalsmith";
import multimatch from "multimatch";
import getOptions from "./options";
import ask from "./ask";
import filter from "./filter";
import { render } from "ejs";
import { log } from "./log";
import { existsSync as exists } from "fs";
import fs from "fs";
import _ from "lodash";
import async from "async";
/**
 * 生成文件, src to dest
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

export default function generate(
  name: any,
  src: string,
  dest: string,
  done: (arg0: Error) => void
) {
  const opts: any = getOptions(name, src);
  const metalsmith = Metalsmith(path.join(src, "templates"));
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inCurrent: dest === process.cwd(),
    noEscape: true,
  });
  // 执行中间件
  metalsmith
    .use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles(opts.skipInterpolation, dest));
  // 执行文件操作
  metalsmith
    .clean(false)
    .source(".")
    .destination(dest)
    .build((err, files) => {
      done(err);
      if (typeof opts.complete === "function") {
        const helpers = { chalk, log, files };
        opts.complete(data, helpers);
      } else {
        logMessage(opts.completeMessage, data);
      }
    });
  return data;
}

/**
 * 询问中间件
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions(prompts: any) {
  return (files: any, metalsmith: { metadata: () => any }, done: any) => {
    ask(prompts, metalsmith.metadata(), done);
  };
}

/**
 * 过滤文件中间件.
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles(filters: any) {
  return (files: any, metalsmith: { metadata: () => any }, done: any) => {
    filter(files, filters, metalsmith.metadata(), done);
  };
}

/**
 * 渲染tpl中间件.
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles(skipInterpolation: any, dest: any) {
  skipInterpolation =
    typeof skipInterpolation === "string"
      ? [skipInterpolation]
      : skipInterpolation;
  return (
    files: { [x: string]: { contents: Buffer } },
    metalsmith: { metadata: () => any },
    done: any
  ) => {
    const keys = Object.keys(files);
    const metalsmithMetadata = metalsmith.metadata();
    async.each(
      keys,
      (file, next) => {
        // skipping files with skipInterpolation option
        if (
          skipInterpolation &&
          multimatch([file], skipInterpolation, { dot: true }).length
        ) {
          return next();
        }
        const str = files[file].contents.toString();
        // do not attempt to render files that do not have mustaches
        if (!/<%[^%>]+%>/g.test(str)) {
          return next();
        }
        let res = render(str, metalsmithMetadata);

        const oldpkgPath = path.join(dest, "package.json");
        if (file === "package.json" && exists(oldpkgPath)) {
          const oldpkgContent = JSON.parse(
            fs.readFileSync(oldpkgPath, "utf-8")
          );
          const pkgContent = JSON.parse(res);
          res = JSON.stringify(_.merge(oldpkgContent, pkgContent), null, "\t");
        }
        files[file].contents = Buffer.from(res);
        next();
      },
      done
    );
  };
}

/**
 * 渲染tpl完成之后的输出信息.
 * @param {String} message
 * @param {Object} data
 */

function logMessage(
  message: any,
  data: object & { destDirName: any; inCurrent: boolean; noEscape: boolean }
) {
  if (!message) return;
  render(message, data, (err: { message: string }, res: string) => {
    if (err) {
      console.error("\n   模板编译失败: " + err.message.trim());
    } else {
      console.log(
        "\n" +
        res
          .split(/\r?\n/g)
          .map((line) => "   " + line)
          .join("\n")
      );
    }
  });
}
