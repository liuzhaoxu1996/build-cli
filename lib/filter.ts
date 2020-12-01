import match from "minimatch";
import evaluate from "./eval";

/**
 * 过滤metajs中filter配置的文件
 * @param {*} files 文件
 * @param {*} filters 过滤文件列表
 * @param {*} data metadata
 * @param {*} done
 */
export default (
  files: { [x: string]: any },
  filters: { [x: string]: any },
  data: any,
  done: () => void
) => {
  if (!filters) {
    return done();
  }
  const fileNames = Object.keys(files);
  Object.keys(filters).forEach((glob) => {
    fileNames.forEach((file) => {
      if (match(file, glob, { dot: true })) {
        const condition = filters[glob];
        if (!evaluate(condition, data)) {
          delete files[file];
        }
      }
    });
  });
  done();
};
