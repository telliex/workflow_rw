# Nightwatch
端到端测试又简称` E2E（End-To-End test）`测试，它不同于单元测试侧重于检验函数的输出结果，端到端测试将尽可能从用户的视角，对真实系统的访问行为进行仿真。

单元测试的功能只能确保单个组件的质量，无法测试具体的业务流程是否运作正常，而 E2E 却正好与之相反，它是一个更高层次的面对组件与组件之间、用户与真实环境之间的一种集成性测试 。

Nightwatch 是 vue-cli 下的 E2E 测试框架。
```js
this.demoTestGoogle = function (browser) {
  browser
    .url('http://www.google.com')
    .waitForElementVisible('body', 1000)
    .setValue('input[type=text]', 'nightwatch')
    .waitForElementVisible('button[name=btnG]', 1000)
    .click('button[name=btnG]')
    .pause(1000)
    .assert.containsText('#main', 'The Night Watch')
    .end();
}
```

## 配置 Nightwatch

### 结构
```
.
└── test
      └── e2e
            ├── custom-assertions     // 自定义断言
            │    └── elementCount.js
            ├── page-objects          // 页面对象文件夹
            ├── reports               // 输出报表文件夹
            ├── screenshots           // 自动截屏
            ├── nightwatch.conf.js    // nightwatch 运行配置
            ├── runner.js             // 运行器
            └── specs                 // 测试文件
                  └── test.spec.js

```

### 配置 nightwatch.conf.js 
主要分三块，路径配置，Selenium 配置，测试配置
```js
require('babel-register');
var config = require('../../config');
var seleniumServer = require('selenium-server');
var phantomjs = require('phantomjs-prebuilt');
 
module.exports = {
  "src_folders": ["test/e2e/specs"],
  "output_folder": "test/e2e/reports",
  "custom_assertions_path": ["test/e2e/custom-assertions"],
  "page_objects_path": "test/e2e/page-objects",
  "selenium": {
    "start_process": true,
    "server_path": seleniumServer.path,
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": require('chromedriver').path
    }
  },
  "test_settings": {
    "default": {
      "selenium_port": 4444,
      "selenium_host": "localhost",
      "silent": true,
      launch_url:"http://localhost:" + (process.env.PORT || config.dev.port),
      "globals": {
      }
    },
    "chrome": {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    },
    "firefox": {
      "desiredCapabilities": {
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    }
  }
} 
```
### 泛型
一般用法
```js
module.exports = {
  before : function(browser) {
    console.log('Setting up...');
  },

  after : function(browser) {
    console.log('Closing down...');
  },

  beforeEach : function(browser) {

  },

  afterEach : function() {

  },

  'step one' : function (browser) {
    browser
     // ...
  },

  'step two' : function (browser) {
    browser
    // ...
      .end();
  }
};
```

异步
```js
module.exports = {
  beforeEach: function(browser, done) {
    // 执行异步操作
    setTimeout(function() {
      // 异步操作完成
      done();
    }, 100);
  }
}
```

### 端到端测试
用一个百度搜索的例子
```js
module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://www.baidu.com')
      .waitForElementVisible('body', 1000)
      .setValue('#kw', 'nightwatch')
      .waitForElementVisible('#su', 1000)
      .click('#su')
      .pause(1000)
      .assert.containsText('body', 'nightwatch')
      .end(); // 调用 end() 方法，如此 selenium 会话才会正确的停止。
  }
};
```

## Nightwatch 与 Cucumber
如果开发的项目的业务复杂性不大，可以直接使用 Nightwatch 推荐的链式调用写法。但是当这种做法真正应用在业务流程较多，或者业务操作相对复杂的应用场景时，你会觉得总有写不完的 E2E 测试，因为这么做 E2E 测试是没有办法一次性覆盖所有需求的！
E2E 测试其实是行为式驱动开发的实现手法，如果跳过了行为式驱动开发的分析部分直接编写 E2E，其结果只能是写出一堆**严重碎片化的测试场景**，甚至会出现很多根本不应该出现的操作。
解决方法，集成 BDD 测试框架 **Cucumber**

Step1：安装插件
```
npm i nightwatch-cucumber -D
// or
yarn add -D nightwatch-cucumber
```
Step2：~/test/e2e/nightwatch.conf.js 文件中加入对 Cucumber 的配置：
```js
// ... 省略
require('babel-register');
require('nightwatch-cucumber')({
  // cucumber 参数
  cucumberArgs: [
    '--require',
    'test/e2e/features/step_definitions',
    '--format',
    'node_modules/cucumber-pretty',
    '--format',
    'json:test/e2e/reports/cucumber.json',
    'test/e2e/features'
  ]
})
```
更多 [nightwatch-cucumber](https://mucsi96.github.io/nightwatch-cucumber/)
