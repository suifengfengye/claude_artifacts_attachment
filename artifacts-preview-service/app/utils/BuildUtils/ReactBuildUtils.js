const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const child_process = require('child_process');
const tar = require('tar');
const exec = promisify(child_process.exec);
const FileUtils = require('../FileUtils'); // 确保路径正确

const { rootDir, buildDir, buildTmpDir } = require('./helpers')

class ReactBuildUtils {
  static async build (options) {
    const {
      ctx, userId, filename, fileMD5,
      tmpPath, distPath,
    } = options;
    let finalPath = ''
    let destDir = ''
    try {
      // 3. 复制前端模版并做修改
      const buildDirName = `${userId}-${Date.now()}`
      const srcDir = path.join(rootDir, 'react-template');
      destDir = path.join(buildDir, buildDirName);
      // 3.1 复制 react-template 目录
      await FileUtils.copyDirectory(srcDir, destDir);

      // 3.2 将临时目录中的代码文件（tmpPath）复制到 destDir + 'src' 目录下
      await FileUtils.copyDirectory(tmpPath, path.join(destDir, `src/${filename}`));

      // 3.3 改写App.tsx文件
      const filenameWithoutExt = filename.split('.')[0];
      const appSourceCode = `import React from 'react';
import ArtifactsComp from './${filenameWithoutExt}';

function App() {
  return (
    <div className="App">
      <ArtifactsComp />
    </div>
  );
}

export default App;`
      // 3.4 指定文件路径
      const filePath = path.join(buildDir, `${buildDirName}/src/App.tsx`);

      // 3.5 异步写入文件
      try {
        fs.writeFileSync(filePath, appSourceCode, 'utf8');
        console.log('文件已成功写入:', filePath);
      } catch (err) {
        console.error('写入文件时发生错误:', err);
      }


      // 6. 前端项目安装依赖和构建
      await exec('npm install', { cwd: destDir });
      await exec('npm run build', { cwd: destDir });

      // 7. 打包 build 目录并部署到目标路径
      const distOutputDir = path.join(destDir, 'build');
      const tarPath = path.join(destDir, 'dist.tar.gz');
      await tar.c(
        {
          gzip: true,
          file: tarPath,
          cwd: distOutputDir
        },
        fs.readdirSync(distOutputDir)
      );

      // 7.1 获取配置的目标路径
      finalPath = path.join(distPath, 'dist.tar.gz');

      // 7.2 确保目标路径存在
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }

      // 7.3 复制文件到目标路径
      fs.copyFileSync(tarPath, finalPath);

      // 7.4 解压文件
      await tar.x({
        file: finalPath,
        C: distPath
      });

      // 7.5 清理临时的、不再需要的文件
      // fs.unlinkSync(tmpPath);
      // fs.unlinkSync(finalPath)
      // fs.rmSync(destDir, { recursive: true });

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
      if (finalPath && fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath)
      }
      if (destDir && fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true });
      }
    }
  }
}

module.exports = ReactBuildUtils;
