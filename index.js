import Compile from './compile.js';
import HijackData from './hijackData.js';
function mix(...mixins) {
    class Mix {
        constructor(options) {
            this.$el = options.el;
            this.$data = options.data;
            // 劫持数据
            this.hijackData(this.$data);
            // 编译模版
            this.compile(this.$el);
        }
    }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
    }

    return Mix;
}
function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
class MVVM extends mix(Compile, HijackData) {}

export default MVVM;
