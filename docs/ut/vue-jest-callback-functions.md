回调函数
在测试函数中我们接受一个参数叫做 done，Jest 将会一直等待，直到我们调用 done()。如果一直不调用 done()，则此测试不通过。

```javascript
// async/fetch.js
export const fetchApple = (callback) => {
    setTimeout(() => callback('apple'), 300)
}
// async/fetch.test.js
import { fetchApple } from './fetch'
test('the data is apple', (done) => {
    expect.assertions(1)
    const callback = data => {
        expect(data).toBe('apple')
        done()
    }
    fetchApple(callback)
})
```

异步调用