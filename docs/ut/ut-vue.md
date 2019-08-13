# Vue 单元测试

项目中有两种类型的组件需要单元测试，一种为业务组件，另一种为抽象出来的公共组件。

- **公共组件**：单元测试从公共组件优先考虑，这部分组件变动不大且涉及范围更广泛，优先保证这部分组件的正常运行对于项目而言是基石般的重要。公共组件通常不会因为业务或是界面的改动而产生大范围的重构，所以测试用例通常也不会需要重写或是废弃的情况。可以把成本压缩到最低并且可以保证不错的收益。
- **业务组件**：项目初期，业务变动相对频繁，直观觉得容易出错的组件是单元测试的第一优先考量，当业务逐渐趋于稳定时且团队资源丰富时，从整体去考量单元测试的著重点。另出现 bug 的地方，修复过程一定要有单元测试。

## 单元测试技术选型
Vue 上做单元测试组成有

### 测试框架及断言库 Jest
vue-cli 下有两种单元测试框架可选择
1. Karma + Mocha + sinon chai + phantomjs
2. Jest

我们将采用 Jest，优点有
- 可取代 Karma + Mocha + sinon chai + phantomjs + 一个用于测试的浏览器环境
- 内置强大的断言与 mock 功能
- 内置测试覆盖率统计功能
- 内置 Snapshot 机制
- 对 typescript 的编写环境较友善

### Vue测试框架 Vue-test-utils
在单元测试中我们无法避免的需要对 DOM 进行抓取，或者对组件进行挂载，触发 DOM 的事件等。原生的 querySelector 以及 event 会显得非常的麻烦。vue-test-util 的官方文档写的实在是太好了。不仅提供了很多实用的 API ，还同步了 DOM 的更新。

```js
// ./src/components/hello-world/hello-world.spec.js

import { shallowMount } from '@vue/test-utils';
import HelloWorld from './hello-world';

describe('<hello-world/>', () => {
  const wrapper = shallowMount(HelloWorld);
  it("update 'msg' correctly", () => {
    // 点击 button
    wrapper.find('button').trigger('click');
    // 可以立即获取 msg 最新的值，不再需要 wrapper.vm.$nextTick();
    expect(wrapper.find('h1').text())
      .toEqual('new message');
  });
});
```

### 测试覆盖率 Istanbul
可以通过测试覆盖率报告，客观地看我们哪些代码被覆盖被运行而哪些没有，也可以通过标注看代码被调用地次数来判断是否符合预期。



## Jest 档案架构
```
unit
┣ coverage          // 代码覆盖率报告，src 下面的 index.html 可以直接用浏览器打开
┣ specs             // 所有的测试用例都放在这里
┃    ┗ xxx.test.js  
┣ .eslintrc         // 针对 eslint 检测的个别调整
┣ asset.transform.js  
┣ styleMock.js      // 用于 mock import 的档案，如 less、CSS 
┣ testHelper.js     // 自定单元测试库
┣ jest.conf.js      // Jest 设定档
┗ setup.js          // Jest 的配置文件
```

#### ✓ ESlint 可能会检测出单元测试的语法错误，我们透过`.eslintrc`设定

```js
"env": {
    "jest": true
  },
```

#### ✓ jest.conf.js 设定
```js
const path = require('path')
 
module.exports = {
  verbose: true,  // 用于显示每个测试用例的通过与否
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '\\.(css|styl|less|sass|scss)$': '<rootDir>/test/unit/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testURL: 'http://localhost/', // 避免 SecurityError: localStorage is not available for opaque origins 错误
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/unit/assets.transform.js',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '\\.(css|styl|less|sass|scss)$': '<rootDir>/test/unit/styleMock.js'
  },
  testPathIgnorePatterns: ['<rootDir>/test/e2e'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  // mapCoverage: true, // 移除,不再支援
  // 开启默认格式的测试覆盖率报告
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  // 定义需要收集测试覆盖率信息的文件
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**',
    '!**/node_modules/**',
    '!src/App.vue'
  ],
  coverageReporters: [
    'lcov', // 会生成lcov测试结果以及HTML格式的漂亮的测试覆盖率报告
    'text' // 会在命令行界面输出简单的测试报告
  ]
}
```

#### ✓ setup.js 设定
``` js
import Vue from 'vue'

Vue.config.productionTip = false

```

我们可以藉由`setup.js`，配置全域需要的变数，比如在每个组件实例化时候注入一个 GLOBAL 对象。我们可以
``` js
// ./test/unit/setup.js
import Vue from 'vue';
import { config } from '@vue/test-utils';

Vue.config.productionTip = false;

// provide 的模拟
config.provide.GLOBAL = {
  logined: false,
};
```
``` html
// ./src/components/hello-world/hello-world.vue
<template>
  <div>
    <h1 v-show="GLOBAL.logined">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  inject: ['GLOBAL'],
  data() {
    return {
      msg: 'Hello Jest',
    };
  },
};
</script>

```
``` js
// ./src/components/hello-world/hello-world.spec.js
import { shallowMount } from '@vue/test-utils';
import HelloWorld from './hello-world';

describe('<hello-world/>', () => {
  const wrapper = shallowMount(HelloWorld);
  it('should render correct contents', () => {
    expect(wrapper.find('h1').isVisible()).toBe(false);
  });
});
```

#### ✓ testHelper.js 将重复使用到的断言放在一起，比如我们可以
``` js
export const testHelper = (wrapper, expect) => {
  return {
    input: (selector, value) => {
      wrapper.find(selector).element.value = value
    },

    click: selector => {
      wrapper.find(selector).trigger('click')
    },

    submit: selector => {
      wrapper.find(selector).trigger('submit')
    },

    // 物件存在
    selectorAlive: (selector) => {
      expect(wrapper.contains(selector)).toBe(true)
    },
    // 物件不存在
    selectorNotAlive: (selector) => {
      expect(wrapper.contains(selector)).toBe(false)
    },

    checkPictureAlive: (name, selector) => {
      const wrap = selector ? wrapper.find(selector) : wrapper
      expect(wrap.is('img')).toBe(true)
      expect(wrap.element.src).toContain(name)
    },

    checkPicturenNotAlive: (name, selector) => {
      let wrap = selector ? wrapper.find(selector) : wrapper
      wrap = wrap.find('img')
      expect(wrap.element.src).toContain(name)
    },

    name: name => {
      expect(wrapper.name()).toEqual(name)
    },

    selectorIncludeContent: (content, selector) => {
      const wrap = selector ? wrapper.find(selector) : wrapper
      expect(wrap.html()).toContain(content)
    },

    selectorExclusiveContent: (content, selector) => {
      const wrap = selector ? wrapper.find(selector) : wrapper
      expect(wrap.html()).not.toContain(content)
    }
  }
}

```
#### ✓ styleMock.js

``` js
module.exports = {
  process () {
    return ''
  }
};

```



```js
// counter.js
export default {
  template: `
    <div>
      <span class="count">{{ count }}</span>
      <button @click="increment">Increment</button>
    </div>
  `,

  data () {
    return {
      count: 0
    }
  },

  methods: {
    increment () {
      this.count++
    }
  }
}

```


```js
// vue 工具组，使用 shallow 可以只 foucs 在要測試的元件，保証隔離了子元件，如果要一併測試子元件的話，需要使用 mount
import { mount } from '@vue/test-utils' 
// 待测 vue 组件
import Counter from './counter'

describe('Counter', () => {
  let wrapper, vm;

  beforeEach(() => {
    wrapper = shallow(Counter)  // @vue/test-utils 工具组解析档案架构
    vm = wrapper.vm             // 這個可以取到元件裡面的東西，比如說 data 裡的變數或直接調用方法
  })


  test('渲染正确的标记', () => {
    expect(wrapper.html()).toContain('<span class="count">0</span>') 
  })

  test('检查已存在的元素', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  test('点击 click 按钮，data(){return} 里的 count 变数值由 0 加 1', () => {
    expect(vm.count).toBe(0)
    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.count).toBe(1)
  })
})
```


## 参考
- [单元测试（二）—— Jest结合Vue-test-utils入门实战](https://blog.csdn.net/sinat_33312523/article/details/82966085)
