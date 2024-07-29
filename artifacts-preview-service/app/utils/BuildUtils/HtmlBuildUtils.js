const fs = require('fs');
const path = require('path');
const FileUtils = require('../FileUtils'); // 确保路径正确


class HtmlBuildUtils {
  static async build (options) {
    const {
      ctx, userId, filename, fileMD5,
      tmpPath, distPath,
    } = options;
    try {
      // 将html文件弄成固定的index.html文件作为输出即可
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }
      const outputHtmlPath = path.join(distPath, 'index.html')
      await FileUtils.copyDirectory(tmpPath, outputHtmlPath);
      return {
        success: true,
      }
    } catch (err) {
      return {
        success: false,
        error: err
      }
    } finally {
      //  清理临时的、不再需要的文件
      if (tmpPath && fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  }
}

module.exports = HtmlBuildUtils
