const fs = require('fs');
const crypto = require('crypto');

class MD5Generator {
  static getFileMD5 (filePath) {
    return new Promise((resolve, reject) => {
      // 创建一个流来读取文件
      const stream = fs.createReadStream(filePath);
      const hash = crypto.createHash('md5');

      stream.on('data', (data) => {
        hash.update(data, 'utf8');
      });

      stream.on('end', () => {
        resolve(hash.digest('hex')); // 返回16进制的哈希值
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// 使用示例
// MD5Generator.getFileMD5('path/to/your/file.txt').then(md5 => {
//     console.log('MD5:', md5);
// }).catch(err => {
//     console.error('Error:', err);
// });

module.exports = MD5Generator;
