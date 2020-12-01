import path from "path";
export default {
  /**
   * 查看是否是本地路径
   * @param {*} templatePath path
   */
  isLocalPath(templatePath: string) {
    return /^[./]|(^[a-zA-Z]:)/.test(templatePath);
  },

  /**
   * 格式化路径
   * @param {*} templatePath path
   */
  getTemplatePath(templatePath: string) {
    return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath));
  },
};
