# cuketest
CukeTest 是开发测试自动化脚本的工具。可以使用此工具快速创建 BDD 测试脚本。它提供可视化的 feature 编辑界面，一键生成自动化代码样例， 提供多种测试报告，并可以与多种持续集成工具。



.feature 文件是 Cucumber 中的剧本文件，定义了测试用例。 CukeTest 默认会以可视化编辑模式打开 feature 文件
|关键字	|说明|
|:---|:---|
|Feature	|功能，剧本，用来定义此feature文件标题|
|Background	|背景，用来定义场景运行的前提条件|
|Scenario	|场景，定义运行场景|
|ScenarioOutline	|场景大纲 当场景有多种情况可以通过定义不同参数来实现，使用场景大纲，下面必须配合使用Examples。|
|Examples	|例子，只对 Scenario Outline 有效，定义数据。|
|Given|	假如，操作步骤关键字，用来描述操作条件|
|When	|当，操作步骤关键字，用来描述操作步骤|
|And	|而且，操作步骤关键字，用来描述并且条件|
|Then	|那么，操作步骤关键字，用来描述操作结果|
|*	|操作步骤关键字，泛指一切操作|
