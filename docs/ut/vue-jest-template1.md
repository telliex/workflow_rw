# Jest 实战范例 1

我们用 todolist 当范例，来说明先写测试在编功能代码的工作流

todolist 的增加 item 功能：

✓ Step1: 先编写新增 item 功能的测试。在栏位里有 mos 字串，点击了 `.button`，便会加入 item list
![Alt text](../.vuepress/public/img/img-vue-just-01.png =400x)

✓ Step2: 开始写功能
新增 add 函数，进行新增 item 功能
![Alt text](../.vuepress/public/img/img-vue-just-02.png =400x)

✓ Step3: 重构
以命名举例，我们发现原来的 add() 命名不是很好，将函数名称改为 addItemList()
![Alt text](../.vuepress/public/img/img-vue-just-03.png =400x)

总结：
以上我们发现，纵使改了还函数名称或是重构函数内容，测试一样可行。
这是一个简单的 TDD 驱动说明。下面会在介绍更复杂些的应用
