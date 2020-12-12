import validateName from "validate-npm-package-name";

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

export default setValidateName