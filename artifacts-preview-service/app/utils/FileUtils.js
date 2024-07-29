const fsExtra = require('fs-extra');

class FileUtils {
  static async copyDirectory (srcPath, destPath) {
    try {
      await fsExtra.copy(srcPath, destPath);
      console.log('Directory copied successfully!');
    } catch (err) {
      console.error('Error copying directory:', err);
      throw err; // 抛出错误，让调用者处理
    }
  }
}

module.exports = FileUtils;
