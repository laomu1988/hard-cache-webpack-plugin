/**
 * @file webpack本地cache处理
 * @param {*} source 
 */
const loaderUtils = require('loader-utils')
const hash = require('hash-sum')
const fs = require('fs')
const Cache = {}
const Options = {}
const loaded = {}
const defaultOptions = {
    cache_dir: __dirname + '/.cache/', // 缓存文件夹
    timeout: 48 * 60 * 60 * 1000 // 超时时间
}

function wrap(options = {}) {
    options = options || {}
    options.cache_dir = options.cache_dir || __dirname + '/.cache/'
    if (options.cache_dir[options.cache_dir.length - 1] !== '/') {
        options.cache_dir += '/'
    }
    options.cache_file = options.cache_dir + '_cache.json'
    Object.assign(Options, defaultOptions, options)
    readCache()
    Cache.options = options
    Cache.cache_dir = options.cache_dir
    if (!fs.existsSync(Cache.cache_dir)) {
        fs.mkdirSync(Cache.cache_dir)
    }

    var Module = require('module')
    Module.prototype.require = wrapReq(Module.prototype.require)
}

function wrapReq(reqMethod) {
    return function() {
        // console.log('reqMethod', arguments)
        const loader = reqMethod.apply(this, arguments)
        const modulePath = arguments[0]
        // console.log('modulePath:', modulePath)
        if (modulePath.indexOf('-loader') >= 0) {
            const moduleName = modulePath.match(/[\w-]*-loader/)[0]
            if (moduleName && moduleName.indexOf('plugin') < 0) {
                console.log('cache-loader:', modulePath)
                let newLoader = {}
                if (typeof loader === 'function') {
                    newLoader = cacheLoader(loader, moduleName)
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

function cacheLoader(loader, loaderName) {
    return function(source) {
        console.log('loader:', loaderName, this.resourcePath)
        const me = this
        const options = loaderUtils.getOptions(this)
        const _callback = this.callback
        const _async = this.async
        const _cacheable = this.cacheable
        let cacheable = true
        const flag = hash(options) + hash(source)
        const path = loaderName  + '-' + hash(this.resourcePath)
        let cache = Cache[path]
        if (cache) {
            if (cache.flag !== flag || Date.now() - cache.flag > Options.timeout) {
                cache = Cache[path] = undefined
            }
        }
        this.callback = function(err, content, map, meta) {
            console.log('callback', loaderName, me.getDependencies(), me.getContextDependencies())
            if (!err && cacheable && (!cache || cache.content !== content)) {
                loaded[path] = [null, content, map, meta]
                fs.writeFile(Options.cache_dir + path, content, function(err) {
                    if (err) {
                        console.log('write file error:', err)
                    }
                })
                Cache[path] = {
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
        if (loaded[path] && cache ) {
            if (cache.dependencies) {
                cache.dependencies.forEach(file => this.addDependency(file))
            }
            if (cache.contextDependencies) {
                cache.contextDependencies.forEach(content => this.addContextDependency(content))
            }
            return this.callback.apply(me, loaded[path])
        }
        else if(cache && fs.existsSync(Options.cache_dir + path)) {
            let content = cache.isBuffer ? fs.readFileSync(Options.cache_dir + path) : fs.readFileSync(Options.cache_dir + path, 'utf8')
            if (cache.dependencies) {
                cache.dependencies.forEach(file => this.addDependency(file))
            }
            if (cache.contextDependencies) {
                cache.contextDependencies.forEach(content => this.addContextDependency(content))
            }
            loaded[path] = [null, content, cache.map, cache.meta]
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

var cacheTimer = null
function updateCache() {
    clearTimeout(cacheTimer)
    cacheTimer = setTimeout(function() {
        fs.writeFile(Options.cache_file, JSON.stringify(Cache, null, 4), function(err) {
            if (err) {
                console.log('write file error:', err)
            }
        })
    }, 50)
}

function readCache() {
    if (fs.existsSync(Options.cache_file)) {
        try {
            Object.assign(Cache, require(Options.cache_file))
        }
        catch(err) {
            console.log('read cache file error', Options.cache_file)
        }
    }
    return Cache
}

module.exports = wrap