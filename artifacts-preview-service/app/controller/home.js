const fs = require('fs');
const path = require('path');
const MD5Generator = require('../utils/MD5Generator');
const BuildUtils = require('../utils/BuildUtils');

const Controller = require('egg').Controller;

const { buildTmpDir } = require('../utils/BuildUtils/helpers')

class HomeController extends Controller {
  async index () {
    this.ctx.body = 'Hello world';
  }

  async getFrontendDist () {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const { userId } = stream.fields;
    const filename = stream.filename;

    // 1. 先将文件写入到build-workspace/tmp目录中，然后拿到md5值
    // 1.1 文件先写入临时目录中
    const tmpDir = buildTmpDir
    const tmpPath = path.join(tmpDir, `${userId}-${filename}`);

    // 1.2 确保目标目录存在
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // 1.3 创建文件写入流
    const writeStream = fs.createWriteStream(tmpPath);

    // 1.4 管道流到文件
    await new Promise((resolve, reject) => {
      stream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    const fileMD5 = await MD5Generator.getFileMD5(tmpPath)

    // 2. 判断目标目录是否存在，如果存在，则直接返回fileMD5
    const targetDist = `${userId}-${fileMD5}`
    const distPath = path.join(ctx.app.config.dist.path, `${userId}-${fileMD5}`);
    if (fs.existsSync(distPath)) {
      // 删除临时文件
      fs.unlinkSync(tmpPath);
      ctx.body = {
        code: 200,
        data: {
          targetDist,
          fileMD5,
          distPath,
        }
      }
      return;
    }

    // build
    const { success } = await BuildUtils.build({
      ctx,
      userId,
      filename,
      fileMD5,
      tmpPath,
      distPath,
    })

    if (!success) {
      ctx.body = {
        code: 500,
        msg: 'build failed',
      }
      return;
    }

    // 设置响应
    ctx.body = {
      code: 200,
      data: {
        targetDist,
        fileMD5,
        distPath,
      }
    };
  }

}

module.exports = HomeController;
