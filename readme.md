# webpack本地硬盘缓存

- 思路：
    覆盖默认的loader函数（通过改写默认的module.prototype.require函数），在其上层增加缓存处理函数

### 使用
```
const cache = require('hard-cache-webpack-plugin')
cache(options)
```

## 处理事项
* [ ] 超时文件需要清理
* [ ] 文件过大时不能存入内存，否则可能会存在内存泄漏问题
* [ ] 如何快速算出文件hash，避免hash计算耗时
* [ ] webpack的bitch如何缓存
* [ ] webpack的plugin如何缓存

### 参考资料：
- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin/blob/master/utils.js)
- [loader content](https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js)