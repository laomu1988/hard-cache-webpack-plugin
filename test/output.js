/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./test/index.js":
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.less */ \"./test/index.less\");\n/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_0__);\n/**\n * test loader\n */\n\nvar a = 1;\nconsole.log(a);\n\n//# sourceURL=webpack:///./test/index.js?");

/***/ }),

/***/ "./test/index.less":
/*!*************************!*\
  !*** ./test/index.less ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: Illegal argument undefined\\n    at module.exports (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/node_modules/md5/md5.js:152:13)\\n    at new <anonymous> (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/index.js:53:66)\\n    at Object.<anonymous> (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/node_modules/less/lib/less-node/plugin-loader.js:24:26)\\n    at Module._compile (/Users/muzhilong/.nvm/versions/node/v8.9.0/lib/node_modules/webpack-cli/node_modules/v8-compile-cache/v8-compile-cache.js:178:30)\\n    at Object.Module._extensions..js (module.js:646:10)\\n    at Module.load (module.js:554:32)\\n    at tryModuleLoad (module.js:497:12)\\n    at Function.Module._load (module.js:489:3)\\n    at Module.require (module.js:579:17)\\n    at Module.require (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/index.js:33:31)\\n    at require (/Users/muzhilong/.nvm/versions/node/v8.9.0/lib/node_modules/webpack-cli/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)\\n    at Object.<anonymous> (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/node_modules/less/lib/less-node/index.js:12:21)\\n    at Module._compile (/Users/muzhilong/.nvm/versions/node/v8.9.0/lib/node_modules/webpack-cli/node_modules/v8-compile-cache/v8-compile-cache.js:178:30)\\n    at Object.Module._extensions..js (module.js:646:10)\\n    at Module.load (module.js:554:32)\\n    at tryModuleLoad (module.js:497:12)\\n    at Function.Module._load (module.js:489:3)\\n    at Module.require (module.js:579:17)\\n    at Module.require (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/index.js:33:31)\\n    at require (/Users/muzhilong/.nvm/versions/node/v8.9.0/lib/node_modules/webpack-cli/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)\\n    at Object.<anonymous> (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/node_modules/less/index.js:1:80)\\n    at Module._compile (/Users/muzhilong/.nvm/versions/node/v8.9.0/lib/node_modules/webpack-cli/node_modules/v8-compile-cache/v8-compile-cache.js:178:30)\\n    at Object.Module._extensions..js (module.js:646:10)\\n    at Module.load (module.js:554:32)\\n    at tryModuleLoad (module.js:497:12)\\n    at Function.Module._load (module.js:489:3)\\n    at Module.require (module.js:579:17)\\n    at Module.require (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/index.js:33:31)\\n    at require (/Users/muzhilong/.nvm/versions/node/v8.9.0/lib/node_modules/webpack-cli/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)\\n    at Object.<anonymous> (/Users/muzhilong/projects/my_packages/hard-cache-webpack-plugin/node_modules/less-loader/dist/index.js:7:13)\");\n\n//# sourceURL=webpack:///./test/index.less?");

/***/ })

/******/ });