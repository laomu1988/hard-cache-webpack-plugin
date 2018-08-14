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
        const loader = reqMethod.apply(this, arguments)
        const modulePath = arguments[0]
        // console.log('modulePath:', modulePath)
        if (modulePath.indexOf('-loader') >= 0) {
            const moduleName = modulePath.match(/[\w\-]*-loader/)[0]
            if (moduleName && moduleName.indexOf('plugin') < 0) {
                console.log('cache-loader:', modulePath)
                let newLoader = {}
                if (typeof loader === 'function') {
                    newLoader = cacheLoader(loader, options, moduleName)
                }
                let attrs = ['normal', 'pitch', 'default', 'raw']
                attrs.forEach(attr => {
                    if (loader[attr]) {
                        newLoader[attr] = loader[attr]
                    }
                })
                return newLoader
            }
        }
        return loader
    }
}

function cacheLoader(loader, options, loaderName) {
    const cache_dir = options.cache_dir
    return function(source) {
        console.log('loader:', loaderName, this.resourcePath)
        const me = this
        const options = loaderUtils.getOptions(this)
        const _callback = this.callback
        const _async = this.async
        const _cacheable = this.cacheable
        let cacheable = true
        const flag = md5(loaderName + JSON.stringify(options)) + md5(source + '')
        const path = md5(this.resourcePath + '')
        this.callback = function(err, content, map, meta) {
            console.log('callback', loaderName, me.getDependencies(), me.getContextDependencies())
            if (!err && cacheable) {
                loaded[path] = [null, content, map, meta]
                fs.writeFile(cache_dir + path, content, function(err) {
                    if (err) {
                        console.log('write file error:', err)
                    }
                })
                cache[path] = {
                    path: me.resourcePath,
                    loader: loaderName,
                    dependencies: me.getDependencies(),
                    contextDependencies: me.getContextDependencies(),
                    flag,
                    map,
                    meta,
                    isBuffer: Buffer.isBuffer(content)
                }
                updateCache()
            }
            _callback.apply(me, arguments)
        }
        this.async = function() {
            _async.apply(me, arguments)
            return this.callback
        }
        this.cacheable = function(flag) {
            if (flag === false) {
                cacheable = false
                _cacheable(false)
            }
        }
        me.clearDependencies()
        if (loaded[path] && cache[path] && flag === cache[path].flag ) {
            if (cache[path].dependencies) {
                cache[path].dependencies.forEach(file => this.addDependency(file))
            }
            if (cache[path].contextDependencies) {
                cache[path].contextDependencies.forEach(content => this.addContextDependency(content))
            }
            return this.callback.apply(me, loaded[path])
        }
        else if(cache[path] && flag === cache[path].flag && fs.existsSync(cache_dir + path)) {
            let content = cache[path].isBuffer ? fs.readFileSync(cache_dir + path) : fs.readFileSync(cache_dir + path, 'utf8')
            if (cache[path].dependencies) {
                cache[path].dependencies.forEach(file => this.addDependency(file))
            }
            if (cache[path].contextDependencies) {
                cache[path].contextDependencies.forEach(content => this.addContextDependency(content))
            }
            loaded[path] = [null, content, cache[path].map, cache[path].meta]
            return this.callback.apply(me, loaded[path])
        }
        else {
            let content = loader.apply(me, arguments)
            if (content && typeof content.then !== 'function') {
                this.callback(null, content)
            }
            if (content && content.catch) {
                content.catch(err => {
                    console.error('catchError', loaderName, err)
                })
            }
            return content
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
    }, 50)
}

module.exports = wrap