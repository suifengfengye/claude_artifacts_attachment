exports.keys = 'artifacts-123456';

exports.multipart = {
  mode: 'stream',
  fileExtensions: ['.tsx'], // 如果你需要上传特定扩展名的文件
  whitelist: (filename) => true, // 不推荐，因为这会移除所有文件名检查
};

exports.dist = {
  path: '/data/artifacts',
}
