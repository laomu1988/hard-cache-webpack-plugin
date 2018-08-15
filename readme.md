# webpack本地硬盘缓存

- 思路：
    覆盖默认的loader函数（通过改写默认的module.prototype.require函数），在其上层增加缓存处理函数

### 使用
```
const cache = require('hard-cache-webpack-plugin')
cache(options)
```

### options配置项
* `cache_dir`: 缓存文件夹，默认`node_modules/hard-cache-webpack-plugin/.cache/`
* `cache_file`: 缓存文件列表，默认`node_modules/hard-cache-webpack-plugin/.cache/_cache.json`
* `timeout`: 缓存有效期,默认2天，单位ms（待处理）

## 处理事项
* [ ] 超时文件需要清理
* [x] postcss-loader输出内容JSON转换失败处理
* [ ] 如何快速算出文件hash，避免hash计算耗时
* [ ] webpack的bitch如何缓存
* [ ] webpack的plugin如何缓存

### 参考资料：
- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin/blob/master/utils.js)
- [loader content](https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js)