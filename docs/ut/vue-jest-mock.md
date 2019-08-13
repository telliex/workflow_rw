
# mock
![](../.vuepress/public/img/ut-mock-01.png)
想象一下你正在测试一个 Order Class 的 price() 方法，而 price() 方法需要在 Product 和 Customer Class 中调用一些函数。如果你希望单元测试所测试的 Order 模块是独立的，那么你就不想直接使用真正的 Product 或 Customer Class，因为 Customer Class 的错误会直接导致 Order Class 的单元测试失败。相反，你可能会使用一个替身作为依赖的对象，也就是我们接下来会提到的 Fake/Stub/Mock/Spy。

常遇到的一些需要替身的对象包括：
- Database 数据库
- Network requests 网络请求
- access to Files 存取文件
- any External system 任何外部系统


Jest 中的三个与 Mock 函数相关的API，`jest.fn()`、`jest.spyOn()`、`jest.mock()`

## jest.fn()



▶ 不定义函数内部的实现，jest.fn() 会返回 undefined 作为返回值。
```js
test('测试 jest.fn() 调用', () => {
  let mockFn = jest.fn();
  let result = mockFn(1, 2, 3);

  // 断言 mockFn 的执行后返回 undefined
  expect(result).toBeUndefined();
  // 断言 mockFn 被调用
  expect(mockFn).toBeCalled();
  // 断言 mockFn 被调用了一次
  expect(mockFn).toBeCalledTimes(1);
  // 断言 mockFn 传入的参数为1, 2, 3
  expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
})
```
```js
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
   callback(items[index]);
  }
}

const mockCallback = jest.fn();
forEach([0, 1], mockCallback);

// 判断是否被执行两次
expect(mockCallback.mock.calls.length).toBe(2);

// 判断函数被首次执行的第一个形参为0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// 判断函数第二次被执行的第一个形参为1
expect(mockCallback.mock.calls[1][0]).toBe(1);
```

▶ jest.fn()  定义函数 
```js
test('测试 jest.fn() 返回固定值', () => {
  let mockFn = jest.fn().mockReturnValue('default');
  // 断言 mockFn 执行后返回值为 default
  expect(mockFn()).toBe('default');
})

test('测试 jest.fn() 内部实现', () => {
  let mockFn = jest.fn((num1, num2) => {
    return num1 * num2;
  })
  // 断言 mockFn 执行后返回 100
  expect(mockFn(10, 10)).toBe(100);
})

test('测试 jest.fn() 返回 Promise', async () => {
  let mockFn = jest.fn().mockResolvedValue('default');
  let result = await mockFn();
  // 断言 mockFn 通过 await 关键字执行后返回值为default
  expect(result).toBe('default');
  // 断言 mockFn 调用后返回的是 Promise 对象
  expect(Object.prototype.toString.call(mockFn())).toBe("[object Promise]");
})
```
 
 实际应用

```js
// fetch.js
import axios from 'axios';

export default {
  async fetchPostsList(callback) {
    return axios.get('https://jsonplaceholder.typicode.com/posts').then(res => {
      return callback(res.data);
    })
  }
}

// xxx.test.js
import fetch from '../src/fetch.js'

test('fetchPostsList 中的回调函数应该能够被调用', async () => {
  expect.assertions(1);
  let mockFn = jest.fn();
  await fetch.fetchPostsList(mockFn);

  // 断言 mockFn 被调用
  expect(mockFn).toBeCalled();
})
```

## jest.mock()
events.js 引用同级下的  fetch.js

```js
// fetch.js

import axios from 'axios';

export default {
  async fetchPostsList(callback) {
    return axios.get('https://jsonplaceholder.typicode.com/posts').then(res => {
      return callback(res.data);
    })
  }
}
```

```js
// events.js

import fetch from './fetch';

export default {
  async getPostList() {
    return fetch.fetchPostsList(data => {
      console.log('fetchPostsList be called!');
      // do something
    });
  }
}

```

```js
// functions.test.js

import events from '../src/events';
import fetch from '../src/fetch';

jest.mock('../src/fetch.js');

test('mock 整个 fetch.js 模块', async () => {
  expect.assertions(2);
  await events.getPostList();
  expect(fetch.fetchPostsList).toHaveBeenCalled();
  expect(fetch.fetchPostsList).toHaveBeenCalledTimes(1);
});
```

调用了expect.assertions(2)，它能确保在异步的测试用例中，有一个断言会在回调函数中被执行。

## jest.spyOn()

```js
// functions.test.js

import events from '../src/events';
import fetch from '../src/fetch';

test('使用jest.spyOn()监控fetch.fetchPostsList被正常调用', async() => {
  expect.assertions(2);
  const spyFn = jest.spyOn(fetch, 'fetchPostsList');
  await events.getPostList();
  expect(spyFn).toHaveBeenCalled();
  expect(spyFn).toHaveBeenCalledTimes(1);
})
```
说明：通过 jest.spyOn()，fetchPostsList 被正常的执行了（可印出 fetchPostsList 的 console）。

---

`jest.fn()` 常被用来进行某些有回调函数的测试；`jest.mock()` 可以 mock 整个模块中的方法，当某个模块已经被单元测试 100% 覆盖时，使用 `jest.mock()` 去 mock 该模块，节约测试时间和测试的冗余度是十分必要；当需要测试某些必须被完整执行的方法时，常常需要使用 `jest.spyOn()`

---



### mock 实例
1.组件发起了API 请求，我只想知道它发没发，不想让它真实发出去。
```js
// 组件 ./src/components/user-info/user-info.vue
<template>
  <div class="user-info">
    <div class="name">{{user.name}}</div>
    <div class="desc">{{user.desc}}</div>
  </div>
</template>

<script>

import UserApi from '../../apis/user';

export default {
  name: 'UserInfo',
  data() {
    return {
      user: {},
    };
  },
  created() {
    UserApi.getUserInfo()
      .then((user) => {
        this.user = user;
      });
  },
};
</script>
```

```js
// API 接口 ./src/apis/user.js
function getUserInfo() {
  return $http.get('/user');
}

export default {
  getUserInfo,
};
```
``` js
// 单测 ./src/components/user-info/user-info.spec.js
import { shallowMount } from '@vue/test-utils';
import UserInfo from './user-info';
import UserApi from '../../apis/user';

// mock 掉 user 模块
jest.mock('../../apis/user');

// 指定 getUserInfo 方法返回假数据
UserApi.getUserInfo.mockResolvedValue({
  name: 'olive',
  desc: 'software engineer',
});

describe('<user-info/>', () => {
  const wrapper = shallowMount(UserInfo);
  test('getUserInfo 有且只 call 了一次', () => {
    expect(UserApi.getUserInfo.mock.calls.length).toBe(1);
  });
  it('用户信息渲染正确', () => {
    expect(wrapper.find('.name').text()).toEqual('olive');
    expect(wrapper.find('.desc').text()).toEqual('software engineer');
  });
});
```
2.简单的 A 组件依赖了一个复杂的 B 组件，但是我只想测试 A 的逻辑，不想拉起 B 的逻辑。
```vue
// ./src/components/simple/simple.vue
<template>
  <div>
    <div class="header">{{msg}}</div>
    <div>
      <complex></complex>
      // 即使 vue-test-util 可以通过存根的方式将这个组件渲染为 complex-stub
      // 但其内部的其他代码可能依然被执行
    </div>
  </div>
</template>

<script>

import Complex from './children/complex';

export default {
  name: 'Simple',
  data() {
    return {
      msg: 'simple',
    };
  },
  components: {
    Complex,
  },
};

</script>
```
``` js
// ./src/components/simple/simple.spec.js
import { shallowMount } from '@vue/test-utils';
import Simple from './simple';

// 拦截掉 .vue 文件的内容
jest.mock('./children/complex.vue', () => ({
  render(h) {
    h();
  },
}));

describe('<simple/>', () => {
  const wrapper = shallowMount(Simple, {
    stubs: ['user-info'],
  });

  it('文本渲染正确', () => {
    expect(wrapper.find('.header').text()).toEqual('simple');
  });
});
```


### mock 文件和 css module 的问题
js文件中引用了css或者本地其他文件，那么就可能测试失败。

在 moduleNameMapper 加入以下設定
```js
"jest": {
    "moduleNameMapper": {
     "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/config/fileMock.js",
     "\\.(css|less)$": "identity-obj-proxy"
 }
```

```js
// fileMock.js 内容
module.exports = 'test-file-stub';
```

```js
npm install --save-dev identity-obj-proxy
```



## mock 全局对象
通常包括
- `$store` , for Vuex
- `$router` , for Vue Router
- `$t` , for vue-i18n

```vue
<template>
  <div class="hello">
    {{ $t("helloWorld") }}
  </div>
</template>

<script>
  export default {
    name: "Bilingual"
  }
</script>

```
```js
import { shallowMount } from "@vue/test-utils"
import Bilingual from "@/components/Bilingual.vue"

describe("Bilingual", () => {
  it("renders successfully", () => {
    const wrapper = shallowMount(Bilingual, {
      mocks: {
        $t: (msg) => msg
      }
    })
  })
})

```




## 参考
- [在 vue-test-utils 中 mock 全局对象](https://juejin.im/post/5be2ac7e6fb9a049b829eeb7)
- [模块间依赖 Fake/Stub/Mock/Spy](https://blog.jimmylv.info/2018-10-29-vue-application-unit-test-strategy-and-practice-02-how-jest-work/)
