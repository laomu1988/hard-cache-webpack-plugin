/**
 * @file webpack本地cache处理
 * @param {*} source 
 */
const loaderUtils = require('loader-utils')
const hash = require('hash-sum')
const fs = require('fs')
const Cache = {}
const Options = {
    cache_dir: __dirname + '/.cache/', // 缓存文件夹
    cache_file: __dirname + '/.cache/_cache.json',
    maxSize: 100 * 1024, // 缓存文件最大大小，默认100k
    timeout: 48 * 60 * 60 * 1000 // 超时时间
}
const Loaded = {}

function wrap(options = {}) {
    Object.assign(Options, options)
    if (Options.cache_dir[Options.cache_dir.length - 1] !== '/') {
        Options.cache_dir += '/'
    }
    console.log('dir:', Options.cache_dir, Options)
    readCache()
    Cache.options = Options
    Cache.cache_dir = Options.cache_dir
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
        if (modulePath.indexOf('-loader') >= 0 && modulePath.indexOf('.json') < 0) {
            const moduleName = modulePath.match(/[\w-]*-loader/)[0]
            if (moduleName && moduleName.indexOf('plugin') < 0) {
                // console.log('cache-loader:', modulePath)
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
        const me = this
        const options = loaderUtils.getOptions(this)
        const _callback = this.callback
        const _async = this.async
        const _cacheable = this.cacheable
        let cacheable = true
        let isAsync = false
        let hasCalled = false
        const flag = hash(options) + hash(source)
        const path = loaderName + '-' + hash(this.resourcePath) + flag
        const file_path = Options.cache_dir + path + '.json'
        let cache = Cache[path]
        let loaded = Loaded[path]
        if (cache) {
            if (cache.flag !== flag || Date.now() - cache.time > Options.timeout) {
                // console.log('changed:', this.resourcePath, cache.flag !== flag,cache.flag, flag, Date.now() - cache.time, Options.timeout)
                cache = Cache[path] = undefined
            }
        }
        this.callback = function(err, content, map, meta) {
            if (hasCalled) {
                return
            }
            hasCalled = true
            console.log('callback', err, loaderName, content.length, source.length, Options.maxSize, content.length < Options.maxSize, source.length < Options.maxSize, cacheable, (!loaded || loaded.content !== content))
            if (!err && cacheable &&
                content.length < Options.maxSize &&
                source.length < Options.maxSize &&
                (!loaded || loaded.content !== content)) {
                console.log('resave:', me.resourcePath, cacheable, !loaded, !loaded || loaded.content !== content)
                const dependencies = me.getDependencies()
                const ctxDep = me.getContextDependencies()
                loaded = Loaded[path] = {
                    dependencies: dependencies.length > 0 ? dependencies : undefined,
                    contextDependencies: ctxDep.length > 0 ? ctxDep : undefined,
                    content,
                    map,
                    meta
                }
                let str = JSON.stringify(loaded)
                if (str.length > Options.maxSize) {
                    loaded = null
                    Loaded[path] = null
                }
                else {
                    writeFile(file_path, str)
                    Cache[path] = {
                        time: Date.now(),
                        path: me.resourcePath,
                        flag
                    }
                    updateCache()
                }
            }
            _callback.apply(me, arguments)
        }
        this.async = function() {
            isAsync = true
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
        if (cache && !loaded && fs.existsSync(file_path)) {
            loaded = require(file_path)
            if (loaded && loaded.content && loaded.content.type === 'Buffer') {
                loaded.content = new Buffer(loaded.content.data)
            }
        }
        if (loaded && loaded.content && cache ) {
            this.async()
            if (loaded.dependencies) {
                loaded.dependencies.forEach(file => this.addDependency(file))
            }
            if (loaded.contextDependencies) {
                loaded.contextDependencies.forEach(content => this.addContextDependency(content))
            }
            // console.log('use loaded')
            this.callback.call(me, null, loaded.content, loaded.map, loaded.meta)
        }
        else {
            let content = loader.apply(me, arguments)
            if (content && !isAsync && !hasCalled && typeof content.then !== 'function') {
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
        try {
            writeFile(Options.cache_file, JSON.stringify(Cache, null, 4))
        }
        catch(err) {
            console.log('Error:', err)
        }
    }, 200)
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

function writeFile(path, content) {
    try {
        fs.writeFile(path, content, 'utf8', function(err) {
            if (err) {
                console.error('write file error:', err)
            }
            else {
                console.log('write file finish:', path)
            }
        })
    }
    catch(err) {
        console.log('write file Error:', err)
    }
}

module.exports = wrap