/**
 * @file webpack本地cache处理
 * @param {*} source 
 */
const loaderUtils = require('loader-utils')
const md5 = require('md5')
const fs = require('fs')
var cache = {}
const loaded = {}
var cacheTimer = null
function wrap(options = {}) {
    options = options || {}
    options.cache_dir = __dirname + '/.cache/'
    var Module = require('module')
    Module.prototype.require = wrapReq(Module.prototype.require, options)
    if (fs.existsSync(options.cache_dir + '/cache.json')) {
        try {
            cache = require(options.cache_dir + '/cache.json')
        }
        catch(err) {
            console.log('read cache file error', options.cache_dir + '/cache.json')
        }
    }
    cache.cache_dir = options.cache_dir
    if (!fs.existsSync(cache.cache_dir)) {
        fs.mkdirSync(cache.cache_dir)
    }
}

function wrapReq(reqMethod, options) {
    return function() {
        // console.log('reqMethod', arguments)
        const ret = reqMethod.apply(this, arguments)
        const modulePath = arguments[0]
        // console.log('modulePath:', modulePath)
        if (modulePath.indexOf('-loader') >= 0) {
            console.log('cache-loader:', modulePath)
            return cacheLoader(ret, options, modulePath.match(/[\w\-]*-loader/)[0])
        }
        return ret
    }
}

function cacheLoader(loader, options, loaderName) {
    const cache_dir = options.cache_dir
    return function(source) {
        // console.log('loader:', arguments)
        const options = loaderUtils.getOptions(this)
        const _callback = this.callback
        const _async = this.async
        const _cacheable = this.cacheable
        let cacheable = true
        const flag = md5(loaderName + JSON.stringify(options)) + md5(source)
        const path = md5(this.resourcePath)
        var called = false
        this.callback = function(err, content, map, meta) {
            // console.log('callback', err, content, map, meta)
            if (called) {
                return
            }
            if (!err && cacheable) {
                called = true
                loaded[path] = [null, content, map, meta]
                fs.writeFile(cache_dir + path, content, function(err) {
                    if (err) {
                        console.log('write file error:', err)
                    }
                })
                cache[path] = {flag, map, meta, isBuffer: Buffer.isBuffer(content)}
                updateCache()
            }
            _callback.apply(this, arguments)
        }
        this.async = function() {
            _async.call(this)
            return this.callback
        }
        this.cacheable = function(flag) {
            if (flag === false) {
                cacheable = false
                _cacheable(false)
            }
        }
        if (loaded[path]) {
            this.callback.apply(this, loaded[path])
            return
        }
        else if(cache[path] && flag === cache[path].flag && fs.existsSync(cache_dir + path)) {
            let content = cache[path].isBuffer ? fs.readFileSync(cache_dir + path) : fs.readFileSync(cache_dir + path, 'utf8')
            loaded[path] = [null, content, cache[path].map, cache[path].meta]
            this.callback.apply(this, loaded[path])
        }
        else {
            let content = loader.apply(this, arguments)
            if (content) {
                this.callback(null, content)
                return content
            }
        }
    }
}

function updateCache() {
    clearTimeout(cacheTimer)
    cacheTimer = setTimeout(function() {
        fs.writeFile(cache.cache_dir + 'cache.json', JSON.stringify(cache, null, 4), function(err) {
            if (err) {
                console.log('write file error:', err)
            }
        })
    }, 10)
}

module.exports = wrap