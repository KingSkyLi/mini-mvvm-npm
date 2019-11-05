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

export default Dep;
