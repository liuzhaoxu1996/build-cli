import path from "path";
import metadata from "read-metadata";
import { existsSync as exists } from "fs";
import getGitUser from "./git-user";
import validateName from "validate-npm-package-name";
/**
 * 获取metadata数据.
 * @param {String} dir
 * @return {Object}
 */

export default function options(name: any, dir: any) {
  const opts = getMetadata(dir);

  setDefault(opts, "name", name);
  setValidateName(opts);

  const author = getGitUser();
  if (author) {
    setDefault(opts, "author", author);
  }

  return opts;
}

/**
 * 从 meta.js/meta.json 获取配置.
 * @param  {String} dir
 * @return {Object}
 */

function getMetadata(dir: string) {
  const json = path.join(dir, "meta.json");
  const js = path.join(dir, "meta.js");
  let opts = {};

  if (exists(json)) {
    opts = metadata.sync(json);
  } else if (exists(js)) {
    const req = require(path.resolve(js));
    if (req !== Object(req)) {
      throw new Error("meta.js 需要返回一个object");
    }
    opts = req;
  }

  return opts;
}

/**
 * 设置默认值
 *
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */

function setDefault(
  opts: { schema?: any; prompts?: any },
  key: string,
  val: string
) {
  if (opts.schema) {
    opts.prompts = opts.schema;
    delete opts.schema;
  }
  const prompts = opts.prompts || (opts.prompts = {});
  if (!prompts[key] || typeof prompts[key] !== "object") {
    prompts[key] = {
      type: "string",
      default: val,
    };
  } else {
    prompts[key]["default"] = val;
  }
}

/**
 * 判断设置项目名称是否合法
 * @param {*} opts
 */
function setValidateName(opts: { prompts?: any }) {
  const name = opts.prompts.name;
  const customValidate = name.validate;
  name.validate = (name: string) => {
    const its: any = validateName(name);
    if (!its.validForNewPackages) {
      const errors = ((its && its.errors) || []).concat(its.warnings || []);
      return "Sorry, " + errors.join(" and ") + ".";
    }
    if (typeof customValidate === "function") return customValidate(name);
    return true;
  };
}
