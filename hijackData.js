// Dep容器，data中的每个数据会对应一个，用来收集并存储依赖
class Dep {
    constructor() {
        this.deps = []; // 所有的依赖将存放在该数组中
    }
    //收集依赖
    addDep(dep) {
        this.deps.push(dep);
    }
    // 通知更新
    notify() {
        this.deps.forEach(dep => {
            dep.updata();
        });
    }
}

// 更新显示实现
class Watcher {
    constructor(vm, exp, cb) {
        this.cb = cb;
        Dep.target = this; //把Watcher赋值给Dep.targets
        vm.$data[exp]; //调用get
        Dep.target = null;
    }
    updata() {
        //dep.notify()通知更新最终入口
        //内存 --> 视图，也是双向数据绑定中的另一方向
        this.cb(); //更新显示
    }
}

// 观察者实现
class Observer {
    constructor(data, key) {
        // 对数据进行观察
        this.observe(data, key, data[key]);
    }
    observe(data, key, val) {
        // data中每一个数据对应一个Dep容器，存放所有依赖于该数据的依赖项
        const dep = new Dep();
        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            configurable: false, //不能再配置
            get() {
                if (Dep.target) {
                    // Dep.target存放具体的依赖，在编译阶段检测到依赖后被赋值
                    dep.addDep(Dep.target); //依赖收集
                }
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify(); // 当数据发生变化时，通知所有的依赖进行更新显示
            },
        });
    }
}
class HijackData {
    hijackData(data) {
        if (!data || typeof data !== 'object') {
            // 不存在或者不为对象，返回（递归退出条件）
            return;
        }
        // 拿到data中所有可枚举的属性
        Object.keys(data).forEach(key => {
            // 递归遍历所有层次
            this.hijackData(data[key]);
            // 创建观察者
            new Observer(data, key);
        });
    }
}

export default HijackData;
