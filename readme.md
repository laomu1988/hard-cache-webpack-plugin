# 本地硬盘缓存

- 思路：
    覆盖默认的loader函数（通过改写默认的module.prototype.require函数），在其上层增加缓存处理函数

### 使用
```
const cache = require('hard-cache-webpack-plugin')
cache()
```


### 参考资料：
- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin/blob/master/utils.js)
- [loader content](https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js)