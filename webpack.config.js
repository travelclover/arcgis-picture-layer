/*
 * @Description: webpack配置文件
 * @Author: travelclover(travelclover@163.com)
 * @Date: 2024-06-28 17:51:32
 */
const path = require('path');

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = (env) => {
  console.log(env.libraryType);
  const output =
    env.libraryType === 'umd'
      ? {
          filename: 'index.umd.js',
          library: {
            name: 'ArcgisPictureLayer', // 指定库名称
            type: 'umd', // 输出的模块化格式， umd 表示允许模块通过 CommonJS、AMD 或作为全局变量使用
            export: 'default', // 指定将入口文件的默认导出作为库暴露
          },
        }
      : {
          filename: 'index.esm.js', // 输出文件名
          library: {
            type: 'module', // 输出模块格式为 ES 模块
          },
          module: true,
        };

  return {
    entry: './src/index.ts',
    mode: 'production',
    output: {
      // clean: true,
      path: resolve('dist'),
      ...output,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          include: [resolve('src')],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'], //针对于'.ts', '.js'这三种文件进行处理引入文件可以不写他的扩展名
    },

    experiments: {
      outputModule: env.libraryType === 'esm', // 打包ESM 需要开启
    },
  };
};
