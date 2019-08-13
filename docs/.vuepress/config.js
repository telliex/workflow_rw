module.exports = {
  // 1.基本配置
  title: '前端学习',
  description: 'front-end learning',
  base: '/workflow/', // 这是部署到github相关的配置
  dest: './dist', // 设置输出目录
  port: 8081, //端口
  serviceWorker: true,
  //theme: 'ktquez', // 如果指定自定义主题，内置主题失效。
  //ga: 'UA-123456789-0', // 谷歌网站分析账户的 ID 号。
  //port: 8000, // 指定开发服务器端口号。
  locales: { // 设置多语言的根目录，设置首页的主副标题。
    '/': {
      lang: 'zh-Hans', // 简体中文在「/」根目录。
      title: '前端学习',
      description: '工作流'
    }
  },
  // 2.Markdown 配置
  markdown: {
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    }, // 内置插件设置：文件内部链接。
    lineNumbers: false, // 设置代码块中是否显示行号。
    toc: {
      includeLevel: [2, 3, 4]
    },
    config: md => { // 外部插件设置：markdown-it-plugin。
      md.set({ breaks: true })
      md.use(require('markdown-it'))
      md.use(require('markdown-it-highlight-lines'))
      md.use(require('markdown-it-abbr'))
      md.use(require('markdown-it-attrs'))
      md.use(require('markdown-it-checkbox'))
      md.use(require('markdown-it-fontawesome'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-katex'))
      md.use(require('markdown-it-kbd'))
      md.use(require('markdown-it-imsize'))
      md.use(require('markdown-it-mark'))
      md.use(require('markdown-it-plantuml'))
      md.use(require('markdown-it-sup'))
      md.use(require('markdown-it-sub'))
      md.use(require('markdown-it-task-checkbox'))
      md.use(require('markdown-it-task-lists'))
      
    }
  },
  // 3.HTML Head 配置
  head: [
    ['link', {
      rel: 'manifest',
      href: '/manifest.json'
    }],
    ['link', {
      rel: 'apple-touch-icon',
      href: '/img/logo.png'
    }],
  ],
  // 4.主题配置
  themeConfig: {
    repo: 'telliex/telliex.github.io', // 设置 github 地址。
    lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
    displayAllHeaders: false, // 默认为 false 仅打开当前文件标题。
    sidebarDepth: 0, // e'b 将同时提取 markdown 中 h2 和 h3 标题，显示在侧边栏上。
    docsDir: 'docs', // 设置 Markdown 存放目录。
    navbar: true,
    locales: {
      label: '简体中文', // 设置导航栏「选择语言」的子选项标题。
      selectText: '选择语言', // 设置导航栏「选择语言」主选项标题。
      editLinkText: '编辑此页', // 设置自动 github 编辑标题。
      lastUpdated: '上次更新', // 设置自动 github 更新时间戳。
      serviceWorker: { // 更新缓存网页提示及按钮名称。
        updatePopup: {
          message: "发现新内容可用",
          buttonText: "刷新"
        }
      },
      '/': {
        nav: [{
            text: 'Home',
            link: '/'
          },
          {
            text: 'Activo',
            link: 'http://confluence.shinho.net.cn/pages/viewpage.action?pageId=17127648'
          }
        ],
        sidebar: [
          ['./work/', '工作流'],
          ['./user-story/', '使用者故事'],
          ['./demand/', '需求分析'],
          ['./task/', '任务拆解'],
          {
            title: 'TDD',
            collapsable: false,
            children: [
              ['./tdd/', '认识 TDD'],
              ['./tdd/TDD-touch', 'TDD 轻体验']
            ]
          },
          {
            title: '单元测试',
            collapsable: false,
            children: [
              ['./ut/', '单元测试'],
              ['./ut/ut-vue', 'Vue 单元测试'],
              ['./ut/jest', 'Jest'],
              ['./ut/vue-jest-callback-functions', '异步调用'],
              ['./ut/vue-jest-mock', 'mock'],
              ['./ut/vue-jest-template1', 'Jest 实战范例 1'],
              ['./ut/vue-jest-template2', 'Jest 实战范例 2'],
              ['./ut/vue-jest-template3', 'Jest 实战范例 3'],
              ['./ut/vue-jest-template4', 'Jest 实战范例 4'],
              ['./ut/vue-jest-tools', '工具'],
              ['./ut/ut-doit', '实作']
            ]
          },
          {
            title: 'BDD 测试',
            collapsable: false,
            children: [
              ['./vue-bdd-test/', 'Vue BDD 测试'],
              ['./vue-bdd-test/bdd-cucumber', 'Cucumber'],
              ['./vue-bdd-test/bdd-nightwatch', 'Nightwatch'],
              ['./vue-bdd-test/bdd-cuketest', 'Cuketest'],
              ['./vue-bdd-test/bdd-report', 'bdd report'],
              ['./vue-bdd-test/bdd-doit', '实作 1'],
              ['./vue-bdd-test/bdd-doit-2', '实作 2']
            ]
          },
          ['./performance/', '性能测试'],
          ['./refactor/', '重构'],
          ['./function/', '函数式编程'],
          ['./explanation/', '名词解释']
        ]
      }
    },

  }
}
