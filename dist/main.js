!function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);var n=class{constructor(){this.deps=[]}addDep(t){this.deps.push(t)}notify(){this.deps.forEach(t=>{t.updata()})}};class i{constructor(t,e,r){this.cb=r,n.target=this,t.$data[e],n.target=null}updata(){this.cb()}}var s=class{compile(t){this.$el=this.isElementNode(t)?t:document.querySelector(t),this.$el&&(this.$fragment=this.node2Fragment(this.$el),this.compileElements(this.$fragment),this.$el.appendChild(this.$fragment))}isElementNode(t){return 1===t.nodeType}node2Fragment(t){let e=null,r=document.createDocumentFragment();for(;e=t.firstChild;)r.appendChild(e);return r}compileElements(t){let e="";const r=/\{\{(.*)\}\}/;Array.from(t.childNodes).forEach(t=>{if(e=t.textContent,this.isElementNode(t)){let e="",r="",n="",i=t.attributes;Array.from(i).forEach(i=>{e=i.value,n=i.name,this.isDirective(n)?(r=n.substring(2),this.update(t,e,r),t.removeAttribute(n)):this.isEvent(n)&&(r=n.substring(1),this.eventHandler(t,e,r),t.removeAttribute(n))})}else this.isTextNode(t)&&r.test(e)&&this.update(t,RegExp.$1.trim(),"text");t.hasChildNodes()&&this.compileElements(t)})}isDirective(t){return t.includes("v-")}isEvent(t){return t.includes("@")}isTextNode(t){return 3===t.nodeType}eventHandler(t,e,r){const n=this.$options.methods&&this.$options.methods[e];n&&t.addEventListener(r,n.bind(this))}update(t,e,r){const n=this[r+"Updater"];n&&n.call(this,t,e),new i(this,e,()=>{n&&n.call(this,t,e)})}textUpdater(t,e){t.textContent=this.$data[e]}htmlUpdater(t,e){t.innerHTML=this.$data[e]}modelUpdater(t,e){t.value=this.$data[e],t.addEventListener("input",t=>{this.$[e]=t.target.value})}};class o{constructor(t,e){this.observe(t,e,t[e])}observe(t,e,r){const i=new n;Object.defineProperty(t,e,{enumerable:!0,configurable:!1,get:()=>(n.target&&i.addDep(n.target),r),set(t){t!==r&&(r=t,i.notify())}})}}var a=class{hijackData(t){t&&"object"==typeof t&&Object.keys(t).forEach(e=>{this.hijackData(t[e]),new o(t,e)})}};function l(t,e){for(let r of Reflect.ownKeys(e))if("constructor"!==r&&"prototype"!==r&&"name"!==r){let n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n)}}class c extends(function(...t){class e{constructor(t){this.$el=t.el,this.$data=t.data,this.hijackData(this.$data),this.compile(this.$el)}}for(let r of t)l(e,r),l(e.prototype,r.prototype);return e}(s,a)){}e.default=c;window.MVVM=c}]);