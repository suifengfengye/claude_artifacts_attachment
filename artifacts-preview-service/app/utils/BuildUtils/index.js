const ReactBuildUtils = require('./ReactBuildUtils');
const HtmlBuildUtils = require('./HtmlBuildUtils')

class BuildUtils {
  static async build (options) {
    const { filename } = options
    if (filename.endsWith('.tsx')) {
      return ReactBuildUtils.build(options)
    }
    if (filename.endsWith('.html')) {
      return HtmlBuildUtils.build(options)
    }
    return {
      success: false,
    }
  }
}

module.exports = BuildUtils
