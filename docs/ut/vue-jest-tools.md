## 工具
### 测试阶段
- moxios  
> npm install moxios --save-dev

### 开发阶段
- json-server - 自搭 API server
```
async addPost () {
	let response = await axios.post('http://localhost:3000/posts', this.form)
	this.posts.push(response.data)
}
```
- axios-mock-adapter 
使用方法：
```
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

let mock = new MockAdapter(axios)

mock.onGet('/users').reply(200, {
  users: [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'John Doe' }
  ]
})

axios.get('/users')
  .then(response => {
    console.log(response.data)
  })

```

Mock 

1. 基于对象和类的 Mock
为每一个被 Mock 的对象或类动态生成一个代理对象，由这个代理对象返回预先设计的结果。（单元测试阶段）
2. 基于微服务的 Mock
  - 标记被代理的类或对象，或声明被代理的服务；
  - 通过 Mock 框架定制代理的行为；
  - 调用代理，从而获得预期的结果。
