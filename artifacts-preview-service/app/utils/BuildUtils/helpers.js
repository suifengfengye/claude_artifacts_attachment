const path = require('path');

const rootDir = path.join(__dirname, '../../../../')

exports.rootDir = rootDir
exports.buildDir = path.join(rootDir, './build-workspace')
exports.buildTmpDir = path.join(rootDir, './build-workspace/tmp')
