# Jest

➔ 安装依赖及配置
>  npm install jest vue-jest babel-jest @vue/test-utils -D

◇ jest 配置文件
实际使用中，适当的在 package.json 的 jest 字段或独立的 jest.config.js 里自定义配置一下，会得到更适合我们的测试场景。
```js
// ./test/unit/jest.conf.js
const path = require('path');

module.exports = {
  verbose: true,  // 用于显示每个测试用例的通过与否
  rootDir: path.resolve(__dirname, '../../'), // 类似 webpack.context
  moduleFileExtensions: [ // 类似 webpack.resolve.extensions
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx'
  ],
  testURL: 'http://localhost/', // 避免 SecurityError: localStorage is not available for opaque origins 错误
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 类似 webpack.resolve.alias
  },
  transform: { // 类似 webpack.module.rules
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFiles: ['<rootDir>/test/unit/setup'], // 类似 webpack.entry
  // mapCoverage: true, // 移除,不再支援
  // 开启默认格式的测试覆盖率报告
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: true, // 测试覆盖报告是否收集
  coverageDirectory: '<rootDir>/test/unit/coverage', // 类似 webpack.output
  coveragePathIgnorePatterns: [".*\\.d\\.ts", "<rootDir>/node_modules/"],
  // 定义需要收集测试覆盖率信息的文件
  collectCoverageFrom: [ // 类似 webpack 的 rule.include
    'src/**/*.{js,vue,ts}}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**',
    "!**/dist/**",
    "!**/tests/**",
    "!src/libs/**",
  ],
  coverageReporters: [
    'lcov', // 会生成lcov测试结果以及HTML格式的漂亮的测试覆盖率报告
    "text-summary" // 会在命令行界面输出简单的测试报告
  ]
  // coverageReporters: ['html', 'text-summary']
}
```

◇ 加入启动 jest 的 npm script
```js
"scripts": {
  "unit": "jest --config test/unit/jest.conf.js --coverage",
},
```

◇ jest 启动文件 setup.js
全局的 vue-test-util 的配置，可以在 setup.js 里指定，比如在每个组件实例化时候注入一个 GLOBAL 对象。
```js
// ./test/unit/setup.js
import Vue from 'vue';
import { config } from '@vue/test-utils';

Vue.config.productionTip = false;

// provide 的模拟
config.provide.GLOBAL = {
  logined: false,
};
```
```vue
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


➔ Jest 基本测试框架

```js
import { shallowMount } from '@vue/test-utils'  // vue 官方出的提升效能插件
import Target from '~/components/Target' // 测试组件
import { testHelper } from '~/test/testHelper' // 公用库

describe('测试评论列表项组件', () => {
  // it 是 mocha 的写法，jest 可以直接兼容
  it('xxx', () => {
  })
  // test 是 jest 的写法，推荐用这种
  test('xxx', () => {
  });
}
```

➔ 编写第一个测试文件
```vue
// ./src/components/hello-world/hello-world.vue

<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Hello Jest',
    };
  },
};
</script>
```
```js
// ./src/components/hello-world/hello-world.spec.js

import { shallowMount } from '@vue/test-utils';
import HelloWorld from './hello-world';

describe('<hello-world/>', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(HelloWorld);
    expect(wrapper.find('.hello h1').text())
      .toEqual('Welcome to Your Vue.js App');
  });
});
```

➔ Jest 断言
> expect(x).toBe(y)

```javascript
expect({a:1}).toBe({a:1})// 判断两个对象是否相等
expect(1).not.toBe(2)// 判断不等
expect(n).toBeNull(); // 判断是否为null
expect(n).toBeUndefined(); // 判断是否为undefined
expect(n).toBeDefined(); // 判断结果与toBeUndefined相反
expect(n).toBeTruthy(); // 判断结果为true
expect(n).toBeFalsy(); // 判断结果为false
expect(value).toBeGreaterThan(3); // 大于3
expect(value).toBeGreaterThanOrEqual(3.5); // 大于等于3.5
expect(value).toBeLessThan(5); // 小于5
expect(value).toBeLessThanOrEqual(4.5); // 小于等于4.5
expect(value).toBeCloseTo(0.3); // 浮点数判断相等
expect('Christoph').toMatch(/stop/); // 正则表达式判断
expect(['one','two']).toContain('one'); // 包含
```

::: tip 常用总整理
toBe 使用 Object.is 判断是否严格相等。
toEqual 递归检查对象或数组的每个字段。
toBeNull 只匹配 null。
toBeUndefined 只匹配 undefined。
toBeDefined 只匹配非 undefined。
toBeTruthy 只匹配真。
toBeFalsy 只匹配假。
toBeGreaterThan 实际值大于期望。
toBeGreaterThanOrEqual 实际值大于或等于期望值
toBeLessThan 实际值小于期望值。
toBeLessThanOrEqual 实际值小于或等于期望值。
toBeCloseTo 比较浮点数的值，避免误差。
toMatch 正则匹配。
toContain 判断数组中是否包含指定项。
toHaveProperty(keyPath, value) 判断对象中是否包含指定属性。
toThrow 判断是否抛出指定的异常。
toBeInstanceOf 判断对象是否是某个类的实例，底层使用 instanceof。
:::


更多断言可以参考
- [Jest 断言](https://jestjs.io/docs/en/expect.html)
- [vue 断言](https://vue-test-utils.vuejs.org/zh/api/wrapper/#%E5%B1%9E%E6%80%A7)


 ### 简单测试范例
 
对照问题

1. 被测试的对象是什么: + 运算符
2. 要测试该对象的什么功能： 2 + 2 = 4
3. 实际得到的结果：result
4. 期望的结果: expectedResult

✓ Step1 单元测试简写

```js

import functions from '../src/functions';
test('sum(2 + 2) 等于 4', () => {
    expect(functions.sum(2, 2)).toBe(4);
})
```
✓ Step2 创建被测试的模块(功能模块)

```js
export default {
    sum(a, b) {
        return a + b;
    }
}
```

✓ Step3 运行 npm run test, Jest 会在 shell 中打印出以下消息

```js
PASS test/functions.test.js
√ sum(2 + 2) 等于 4 (7ms)
 
Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
Snapshots: 0 total
Time: 4.8s
```

自动化测试要包括三个部分的测试
验证功能是不是正确：
覆盖边界条件：
异常和错误处理：


## 参考
- [用 Jest 测试单文件组件](https://vue-test-utils.vuejs.org/zh/guides/testing-single-file-components-with-jest.html)
- [一篇文章学会 Vue 项目单元测试](https://zhuanlan.zhihu.com/p/48758013)
