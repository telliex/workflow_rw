# Jest 实战范例 4
1. 组件发起了API 请求，只想知道有发没发，不想让它真实发出去。

```vue
// ./src/components/user-info/user-info.vue
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
// ./src/apis/user.js
function getUserInfo() {
  return $http.get('/user');
}

export default {
  getUserInfo,
};
```
```js
// ./src/components/user-info/user-info.spec.js
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
  test('用户信息渲染正确', () => {
    expect(wrapper.find('.name').text()).toEqual('olive');
    expect(wrapper.find('.desc').text()).toEqual('software engineer');
  });
});
```

2. A 组件依赖了一个复杂的 B 组件，只测试 A 组件的逻辑，不拉起 B 组件的逻辑。
``` vue
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
```js
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

  test('文本渲染正确', () => {
    expect(wrapper.find('.header').text()).toEqual('simple');
  });
});

```



## 参考
- [一篇文章学会 Vue 项目单元测试](https://zhuanlan.zhihu.com/p/48758013)

