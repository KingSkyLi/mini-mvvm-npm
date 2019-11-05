class Compile {
    compile(el) {
        // 找到vue管理的区域
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        if (this.$el) {
            // 将this.$el中的子节点转移到内存中,document --> 内存
            this.$fragment = this.node2Fragment(this.$el);
            // 编译
            this.compileElements(this.$fragment);
            // 内存 --> document
            this.$el.appendChild(this.$fragment);
        }
    }
    // 判断是否为元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
    // 将文档节点转移到fragment(内存)中
    node2Fragment(node) {
        let child = null;
        let fragment = document.createDocumentFragment();
        while ((child = node.firstChild)) {
            //节点有且只有一个父节点，
            //所以是转移，不是复制，不会出现两份，
            //相当于是一个水缸的水舀到另一个水缸里，fragemnt满了，this.$el空了
            fragment.appendChild(child);
        }
        return fragment;
    }
    compileElements(vNode) {
        let text = '';
        //正则表达式，用于匹配大括号表达式
        const reg = /\{\{(.*)\}\}/;
        //转为真数组并遍历所有节点
        Array.from(vNode.childNodes).forEach(node => {
            text = node.textContent;
            if (this.isElementNode(node)) {
                // 元素节点，解析所有的指令属性
                let exp = ''; // 表达式
                let dir = ''; // 指令
                let attrName = '';
                let attrs = node.attributes;
                // 取出所有属性，转为数组并遍历
                Array.from(attrs).forEach(attr => {
                    exp = attr.value;
                    attrName = attr.name;
                    // 普通指令v-text,v-html，v-model等
                    if (this.isDirective(attrName)) {
                        // 截取 v-
                        dir = attrName.substring(2);
                        this.update(node, exp, dir);
                        node.removeAttribute(attrName);
                        // 事件指令@click等
                    } else if (this.isEvent(attrName)) {
                        // 截取@
                        dir = attrName.substring(1);
                        this.eventHandler(node, exp, dir);
                        node.removeAttribute(attrName);
                    }
                });
            } else if (this.isTextNode(node) && reg.test(text)) {
                // 文本节点，大括号表达式
                this.update(node, RegExp.$1.trim(), 'text');
            }
            // 递归遍历所有层次的节点
            if (node.hasChildNodes()) {
                this.compileElements(node);
            }
        });
    }
    // 判断属性是否为指令
    isDirective(name) {
        return name.includes('v-');
    }
    // 判断事件
    isEvent(name) {
        return name.includes('@');
    }
    // 判断是否为文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }

    // 事件处理器
    eventHandler(node, exp, eType) {
        const cb = this.$options.methods && this.$options.methods[exp];
        cb && node.addEventListener(eType, cb.bind(this));
    }
    // 更新视图，依赖的统一入口，每个引用过data中数据的依赖都会进来这里
    update(node, exp, dir) {
        //拿到相对应的更新函数
        const fn = this[dir + 'Updater'];
        //初始化更新显示，这里需要指定调用的实例this,即vue实例
        fn && fn.call(this, node, exp);
        //变化更新显示，下一节内容
        new Watcher(this, exp, () => {
            fn && fn.call(this, node, exp);
        });
    }
    textUpdater(node, exp) {
        node.textContent = this.$data[exp];
    }
    htmlUpdater(node, exp) {
        node.innerHTML = this.$data[exp];
    }
    modelUpdater(node, exp) {
        node.value = this.$data[exp];
        //添加input事件监听
        //v-model双向数据绑定的其中一个方向，即：视图 --> 内存
        node.addEventListener('input', e => {
            this.$[exp] = e.target.value;
        });
    }
}
export default Compile;
