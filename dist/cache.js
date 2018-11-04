!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.cache=t():e.cache=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=28)}({28:function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function i(e){return(i=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t,n){return t&&f(e.prototype,t),n&&f(e,n),e}n.r(t),n.d(t,"Cache",function(){return p}),n.d(t,"MemoryCache",function(){return y}),n.d(t,"StorageCache",function(){return b});var p=function(){function e(){s(this,e),this.entries={},this.cacheTime=36e5}return l(e,[{key:"get",value:function(e){var t=this.entries[e];return t?Date.now()>t.staleTime?(delete this.entries[e],null):t.value:(this.entries[e]||{}).value}},{key:"put",value:function(e,t){var n=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){a(e,t,n[t])})}return e}({postPut:!0},arguments.length>2&&void 0!==arguments[2]?arguments[2]:{});return this.entries[e]={value:t,staleTime:Date.now()+this.cacheTime},n.postPut&&this.postPut(e,t),t}},{key:"prune",value:function(){var e=this,t=[],n=Date.now();Object.keys(this.entries).forEach(function(r){n>e.entries[r].staleTime&&t.push(r)}),console.info("Pruning cache ".concat(this.storageKey,": removing ").concat(t.length," entries")),t.forEach(function(t){return delete e.entries[t]})}},{key:"postPut",value:function(){if(this)throw new Error("Implement in sublclass")}}]),e}(),y=function(e){function t(){return s(this,t),o(this,i(t).apply(this,arguments))}return u(t,p),l(t,[{key:"postPut",value:function(){}}]),t}(),b=function(e){function t(e){var n;s(this,t),(n=o(this,i(t).call(this))).storageKey=e,n.persistPid=null;var r=window.localStorage[n.storageKey];return r&&(console.log("Hydrating cache ".concat(n.storageKey," (").concat(r.length," chars)")),n.entries=JSON.parse(r)),n}return u(t,p),l(t,[{key:"postPut",value:function(){var e=this;this.persistPid&&clearTimeout(this.persistPid),this.persistPid=setTimeout(function(){try{window.localStorage[e.storageKey]=JSON.stringify(e.entries)}catch(t){"QuotaExceededError"===t.name&&(e.prune(),window.localStorage[e.storageKey]=JSON.stringify(e.entries))}e.persistPid=null},1e3)}}]),t}()}})});