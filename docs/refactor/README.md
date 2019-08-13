# 重构 - 找出代码的 24 种坏味道
基于 Martin Fowler 所指导的重构，代码的24 条坏味道。

## 1. 神秘命名 / Mysterious Name
深思熟虑如何给**函数**、**模块**、**变量**、**类**命名，使它们清晰表达自己的功能和用法。
### <span id="s124">改变函数声明(124)</span>
常见改名手段 1

#### 函数改名 / 简单作法
```js
function circum(radius){ # 围绕
  return 2 * Math.Pi * radius;
}

function circumference()(radius){ # 圆周
  return 2 * Math.Pi * radius;
}
```
::: tip
好的命名能一眼看出用途，不必查看实际代码。
:::
#### 函数改名 / 迁移式作法
```js
function circum(radius){
  return circumference(radius);
}

function circumference(radius){
  return 2 * Math.Pi * radius;
}
```
::: tip
找出调用旧代码的地方改成新代码，改完后即可执行测试。未来所有调用者都改完后，就可以删除旧函数。
:::

### <span id="s137">变量改名(137)</span>
常见改名手段 2
```js
let a = hight * width
```
⇩
```js
let area = hight * width
```
::: tip
好的变量命名可以很好解釋一段程式是干什麼用的，是整洁编程的核心。可将类型信息也放进变数名里，例如：aCustomer。
:::

### <span id="s224">字段改名(244)</span>
常见改名手段 3

```js
class Organization{
  get name(){...}
}
```
⇩
```js
class Organization{
  get title(){...}
}
```
::: tip
数据结构是理解程序行为的关键。所以字段的命名对理解非常重要。
:::

## 2. 重复代码 / Duplicated Code
在一个以上的地方看到相同的代码结构，可以肯定，将它们合而为一会让代码更好。
### <span id="s106">提炼函数(106)</span>
当一个类的两个函数里看到相同的表达式，我们就需要采用`提炼函数`提炼出重复部分，让两地都可以调用。
```js
function printOwing(invoice){
  printBanner();
  let outstanding=calculateOutstanding();

  //print details
  console.log(`name:${invoice.customer}`)
  console.log(`amount:${outstanding}`)
}
```
⇩
```js
function printOwing(invoice){
  printBanner();
  let outstanding=calculateOutstanding();
  printDetails(outstanding);

  function printDetails(outstanding){
    console.log(`name:${invoice.customer}`);
    console.log(`amount:${outstanding}`);
  }
}
```
::: tip
将意图与现实分开，如果需要花时间浏览一段代码才能弄清楚它到底在做什么，那就应该提炼到一个涵数中去。
:::

### <span id="s223">移动语句(223)</span>
若代码只是相似并非相同，可先尝试`移动语句`重整代码顺序，把相似的放一起。

```js
const pricingPlan = retrievePricingPlan();
const oder = retreiveOrder();
let charge;
const chargePerUnit = pricingPlan.unit;
```
⇩
```js
const pricingPlan = retrievePricingPlan();
const chargePerUnit = pricingPlan.unit;
const oder = retreiveOrder();
let charge;
```
::: tip
几行代码用了同一个数据结构，最好将它们集中在一起，而不是参杂在代码中。这也常是`提取代码`的事前工作。
:::

### <span id="s350">函数上移(350)</span>
若重复的部份位于同一个超类的不同子类中，使用`函数上移`，避免两个子类之间互相调用。
```js
class Employee{...}

class Salesman expends Employee{
  get name(){...}
}
class Engineer expends Employee{
  get name(){...}
}
```
⇩
```js
class Employee{
  get name(){...}
}

class Salesman expends Employee{...}
class Engineer expends Employee{...}
```
::: tip
系统内有相同的函数，就会面临修改其一，但另一各未能修改的风险。
:::

## 3. 过长函数 / Long Function
我们应该积极的分解函数，让函数变短，保持清晰。
### 提炼函数(106)
99% 将函数变短，只需使用`提炼函数`。
参考：[重复代码 Duplicated Code | 提炼函数(106)](#s106)

### <span id="s178">以查询取代临时变量(178)</span>
消除因`提炼函数`所造成的大量参数与临时变量。
```js
const basePrice = this._quantity * this._itemPrice;
if(basePrice>1000){
  return basePrice * 0.95
}else{
  return basePrice * 0.98
}
```
⇩
```js
get basePrice() = {this._quantity * this._itemPrice;}
...

if(this.basePrice>1000){
  return this.basePrice * 0.95
}else{
  return this.basePrice * 0.98
}
```
::: tip
分解一个冗长的函数时，将变量提取到函数里能使过程更为简单，因为不需要将变量作为参数传给提炼出来得函数。良好效果表现在类别及嵌函数的使用上。
:::

### <span id="s140">引入参数对象(140)</span>
可将过长得参数表变得更简洁。
```js
function amountInvoiced(startDate,endDate){...}
function amountReceived(startDate,endDate){...}
function amountOverdue(startDate,endDate){...}
```
⇩
```js
function amountInvoiced(aDateRange){...}
function amountReceived(aDateRange){...}
function amountOverdue(aDateRange){...}
```
::: tip
将数据组成结构，可以避免众多函数参杂造成的`数据泥团`。
:::

### <span id="s319">保持对象完整(319)</span>
可将过长得参数表变得更简洁。
```js
const low = aRoom.daysTempRange.low;
const high = aRoom.daysTempRange.high;
if(aPlan.withRange(low,high))
```
⇩
```js
if(aPlan.withRange(aRoom.daysTempRange))
```
::: tip
如果从一个记录结构中取出几个值，然后把这几个值传递给一个函数，我会更倾向于将整个记录结构传给该参数，在函数内部导出所需要的值。
:::

### <span id="s337">以命令取代函数(337)</span>
临时参数及变量的杀手。
```js
function score(candidate,medicalExam,scoringGuide){
  let result = 0;
  let healthLevel = 0;
  // long body code
}
```
⇩
```js
class Score{
  constructor(candidate,medicalExam,scoringGuide){
    this._canicate = candidate;
    this._medicalExam=medicalExam;
    this._scoringGuide=scoringGuide;
  }
  execute(){
    this._result=0;
    this._healthLevel=0;
    // long body code
  }
}
```
::: tip
将函数封装成对象，我们称为**命令**。大部分需求，函数即可达到(95%)，当函数无法到需求时，才会使用命令对象。
:::

### <span id="s324">以查询取代参数(324)</span>
如果向某参数发起查询而获得另一个参数值，那就可采`以查询取代参数`，去掉第二个参数。
```js
availableVacation(anEmployee,anEmployee.grade);
function availableVacation(anEmployee,grade){...}
```
⇩
```js
availableVacation(anEmployee);
function availableVacation(anEmployee){
  const grade = anEmployee.grade;
  // calculate vacation
}
```
::: tip
将获得正确参数值的责任转到函数本身。若移除参数会造成函数不必要的依赖关系或是引用透明性，则不使用。
:::

### <span id="s260">分解条件表达式(260)</span>
提取条件表式和循环。
```js
if(!aDate.isBefore(plan.summerStart)&&!aDate.isAfter(plan.summerEnd))
```
⇩
```js
if(summer())
  charge = summerCharge();
else
  charge = regularCharge();
```
::: tip
复杂的条件逻辑是最常导致复杂度上升，以函数提炼复杂的判断条件。
:::
### <span id="s272">以多态取代条件表达式(272)</span>
多个 switch 语句基于同一个条件进行分支选择，就该用`以多态取代条件表达式`。
```js
switch(bird.type){
  case 'EuropenSwallow':
    return "average";
  case 'AfricanSwallow':
    return (bird.numberOfCoconuts>2) ?"tired":"average";
  case 'NorwegianBlueParrot':
    return (bird.voltage >100) ?"scorched":"beautiful";  
  default:
    return "unknown";
}
```
⇩
```js
class EuropenSwallow{
  get plumage(){
    return "average";
  }
}

class AfricanSwallow{
  get plumage(){
    return (bird.numberOfCoconuts>2) ?"tired":"average";
  }
}

class NorwegianBlueParrot{
  get plumage(){
    return (bird.voltage >100) ?"scorched":"beautiful"; 
  }
}
```
::: tip
复杂条件逻辑时，可采用多态來改善。
:::

### <span id="s227">拆分循环(227)</span>
循环所提取出来的函数，如果还是做著多件事，会造成很难命名，此时需要`拆分循环`。
```js
let averageAge = 0;
let totalSalary = 0;
for(const p of people){
  averageAge += P.page;
  totalSalary += p.salary;
}
averageAge = averageAge / people.length;
```
⇩
```js
let totalSalary = 0;
for(const p of people){
  totalSalary += p.salary;
}

let averageAge = 0;
for(const p of people){
  averageAge += P.page;
}

averageAge = averageAge / people.length;
```
::: tip
将循环拆分，让一个循环只做一件事。
:::

## 4. 过长参数列表 / Long Parameter List
过长的参数列表，经常令人迷惑。
### 以查询取代参数(324)
可向某个参数发起查询而获得另一个参数值，以去掉参数。
参考：[过长函数 Long Function ｜ 以查询取代参数(324)](#s324)

### 保持对象完整(319)
正从现有的数据结构中抽出很多数据项，可考虑使用`保持对象完整`，直接传入原来的数据结构。
参考：[过长函数 Long Function | 保持对象完整(319)](#s319)

### 引入参数对象(140)
可将多个参数合并成一个对象。
参考：[过长函数 Long Function | 引入参数对象(140)](#s140)

### <span id="s314">移除标记参数(314)</span>
若参数被用作区别函数行为的标记
```js
function steDimension(name,value){
  if(name==="height"){
    this._height=value;
    return;
  }
  if(name==="width"){
    this._width=value;
    return;
  }
}
```
⇩
```js
function setHeight(value){this._height=value;}
function setWidth(value){this._width=value;}
```
::: tip
当参数值会影响函数内部的控制流，我们才称为标记参数。标记参数让人难以理解哪些函数可以调用，该怎么调用。
:::
### <span id="s144">函数组合成类(144)</span>
将共用参数变成类得共用字段。
```js
function base(aReading){...}
function taxableCharge(aReading){...}
function calculateBaseCharge(aReading){...}
```
⇩
```js
class Readng{
  base(){...};
  taxableCharge(){...};
  calculateBaseCharge(){...}
}
```
::: tip
当一组函数形影不离的操作著同一组数据，我们就可以建个类。
:::

## 5. 全局数据 / Global Data
全局变量在程式码内的每个角落沟可以修改它，可想出现 bug 时的追踪有多困难。

### <span id="s132">封装变量(132)</span>
首要得防御手段
```js
let defaultOwner = {firstName:"Martin",lastName:"Flower"}
```
⇩
```js
let defaultOwnerData = {firstName:"Martin",lastName:"Flower"}
export function defaultOwner(){
  return defaultOwnerData;
}
export function setDefaultOwner(arg){defaultOwnerData = arg;}
```
::: tip
对所有可变的数据，只要作用域超过单个函数，就将其封装。
:::

## 6. 可变数据 / Mutable Data
对数据的修改，经常导致出乎意料的结果和难以发现的 bug。
### 封装变量(132)
确保所有的数据更新都可够过特定的函数进行，更容易监控演进。
参考：[全局数据 Global Data｜ 封装变量(132)](#s132)

### <span id="s240">拆分变量(240)</span>
如果一个变量不同时候被存储不同东西，可拆分各自不同用途的变量，变免危险的更新操作。
```js
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log(temp)
```
⇩
```js
const perimeter = 2 * (height + width);
console.log(perimeter)
const area = height + width;
console.log(area)
```
::: tip
每个变量只负责单一个责任。
:::

### 移动语句(223)
将没有副作用的代码跟执行数据更新的代码分开。
参考：[重复代码 Duplicated Code｜ 移动语句(223)](#s223)

### 提炼函数(106)
将没有副作用的代码跟执行数据更新的代码分开。
参考：[重复代码 Duplicated Code | 提炼函数(106)](#s106)

### <span id="s306">将查询函数和修改函数分离(306)</span>
确保不会调用到有副作用的代码。
```js
function getTotalOutstandingAndSendBill(){
  const result = customer.invoices.reduce((total,each) => each.amount + total,0)
  sendBill();
  return result;
}
```
⇩
```js
function getTotalOutstandingAndSendBill(){
  return customer.invoices.reduce((total,each) => each.amount + total,0)
}
function sendBill(){
  emailGeteway.send(formatBill(customer));
}
```
::: tip
除去函数的副作用。
函数副作用 指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。例如修改全局变量（函数外的变量）或修改参数。
:::

### <span id="s331">移除预设函数(331)</span>
不需要更新的数据，请使用`移除预设函数`。
```js
class person{
  get name(){...}
  get name(aString){...}
}
```
⇩
```js
class person{
  get name(){...}
}
```
::: tip
不希望在对象创建后字段还有机会被改变，就不要提供设值函数。
:::
### <span id="s248">以查询取代派生变量(248)</span>
避免捆扰、bug 和加班，别让可变数据的值可以在其他地方被计算出来。
```js
get discountedTotal(){
  return this._discountedTotal;
}
set discount(aNumber){
  const old = this._discount;
  this._discount=aNumber;
  this._discountedTotal+=old-aNumber;
}
```
⇩
```js
get discountedTotal(){
  return this._baseTotal-this._discount;
}
set discount(aNumber){
  this._discount=aNumber;
}
```
::: tip
避免一处修改数据，一處卻造成破壞，尽量把可变数据的作用限制在最小范围。
:::

### 函数组合成类(144)
限制对变量进行修改的代码量。
参考：[过长参数列表 Long Parameter List｜ 函数组合成类(144)](#s144)

### <span id="s149">函数组合成变换(149)</span>
限制对变量进行修改的代码量。
```js
function base(aReading){...}
function taxableCharge(aReading){...}
```
⇩
```js
function enrichReading(argReading){
  const aReading = _.cloneDeep(argReading);
  aReading.baseCharge = base(aReading);
  aReading.taxableCharge = taxableCharge(aReading);
  return aReading;
}
```
::: tip
将所有的派生数据逻辑收拢到一处，这样始终可以在固定地方更新逻辑，也可避免重复。
:::

### <span id="s252">将引用对象改成值对象(252)</span>
如果一个变量在其内部结构中包含了数据，请用`将引用对象改成值对象`替换整个数据结构。
```js
class Produt{
  applyDiscount(arg){ this._price.amount - = arg;}
}
```
⇩
```js
class Produt{
  applyDiscount(arg){ 
    this._price=new Money(this._price.amount-arg,this._price_currency);
  }
}
```

## 7. 发散式变化 / Divergent Change
某个模块经常因为不同原因，在不同方向发生变化，便会出现发散式变化。每加入新需求变，需要更动两个以上地方，便是发散式变化的徵兆
### <span id="s154">拆分阶段(154)</span>
若发生变化的两个方向，有先后次序关系，我们可以用`拆分阶段`将两者拆开。
```js
const orderData = orderString.split(/\s+/);
const productPrice = priceList[orderData[0].split["-"][1]];
const orderPrice = parseInt(orderData[1]) * productPrice;
```
⇩
```js
const orderRecord = parseOrder(order);
const orderPrice = price(orderRecord,productList);

function parseOrder(aString){
  const values = aString.split(/\s+/);
  return ({
    productID:values[0].split("-")[1],
    quantity:parseInt(values[1]),
  });
}
function price(order,priceList){
  return order.quantity * priceList[productID];
}
```
::: tip
将同时处理两件事的代码拆成各自独立的模块，避免修改时要同时理解两件事。类似编译器的例子，将任务拆解成一系列的动作，每一步都有明确得范围，我们可以聚焦其中一步，而不用思考其他步骤。
:::

### <span id="s198">搬移函数(198)</span>
若两者方向间有更多的来回调用，需先创建模块，用`搬移函数`把处理逻辑分开。
```js
class Account{
  get overdraftCharge(){...}
}
```
⇩
```js
class AccountType
  get overdraftCharge(){...}
}
```
::: tip
当函数频繁的引用其他上下文中的元素，而对自身上下文元素却关心甚少。
:::

### 提炼函数(106)
函数内混合了两类的处理逻辑，需先提炼函数，再做搬移。
参考：[重复代码 Duplicated Code | 提炼函数(106)](#s106)

### <span id="s182">提炼类(182)</span>
如果模块是以类形式定义，则用提炼类做拆分。
```js
class Person{
  get officeAreaCode(){ return this._officeAreaCode; }
  get officeNumber(){ return this._officeNumber; }
}
```
⇩
```js
class person{
  get officeAreaCode(){ return this._telephoneNumber.areaCode; }
  get officeNumber(){ return this._telephoneNumber.number; }
}
class telephoneNumber{
  get areaCode() { return this._areaCode; }
  get number() { return this._number; }
}
```
::: tip
类随著功能不断叠加会，会越来越复杂，很快的就会一团乱，此时需要考虑哪些部分可以分离成一个独立类。
:::

## 8. 散彈式修改 / Shotgun Surgery
每遇到不同的变化，需要在不同的类内做修改，便是散彈式修改。

### 搬移函数(198)
将需要修改的代码四处散落，很找得到它，`搬移函数`需要采用放进模块。
参考：[发散式变化 Divergent Change | 搬移函数(198)](#s198)
### <span id="s207">搬移字段(207)</span>
`搬移字段`配合`搬移函数`，将需要修改的代码放进模块。
```js
class Customer(){
  get plan(){ return this._plan; }
  get discountRate(){ return this._discountRate; }
}
```
⇩
```js
class Customer(){
  get plan(){ return this._plan; }
  get discountRate(){ return this.plan.discountRate; }
}
```
::: tip
调整数据结构，保持意图清晰
:::

### 函数组合成类(144)
如果很多函数都在操作类似数据，使用`函数组合成类`。
参考：[过长参数列表 Long Parameter List｜ 函数组合成类(144)](#s144)

### 函数组合成变换(149)
函数的功能是转化或充实数据结构。
参考：[可变数据 Mutable Data | 函数组合成变换](#s149)

### 拆分阶段(154)
函数的输出组合用作其他委托者的计算逻辑,可时就需要将此处`拆分阶段`。
参考：[发散式变化 Divergent Change | 拆分阶段](#s154)

### 内联函数(115)
将不该分散的逻辑放回一块。
参考：[中間人 Middle Man | 内联函数(115)](#s115)

### 内联类(116)
将不该分散的逻辑放回一块。
参考：[夸夸其談通用性 Speculative Generality | 内联类(186)](#s186)

## 9. 依戀情結 / Feature Envy
模块，代码区分出区域，最大化区域的内部交互，最小化跨区域的交互。我们会发现一函数跟另一个模块或数据交流格外频繁，远胜于自己模块内部的交流。

### 搬移函数(198)
从另一对象调用大半功能的函数，就让该函数跟数据在一起吧。
参考：[ 发散式变化 Divergent Change | 搬移函数(198)](#s198)

### 提炼函数(106)
函数内若只有一小部分有这苦，就先`提炼函数`，再`搬移函数`。
参考：[重复代码 Duplicated Code ｜ 提炼函数(106)](#s106)

## 10. 數據泥團 / Data Clumps
将散落在类中的数据字段和函数中的相同参数提炼到一个独立的对象中。

### 提炼类(182)
找出这些数据以字段出现的地方，`提炼类`将它门移到独立对象中。
参考：[发散式变化 Divergent Change | 提炼类(182)](#s182)

### 引入参数对象(140)
将注意力放到函数签名(js 没有函数签名)上。js 作法是将函数参数列表缩短。
参考：[过长函数 Long Function | 引入参数对象(140)](#s140)

### 保持对象完整(319)
将注意力放到函数签名(js 没有函数签名)上。js 作法是将函数参数列表缩短。
参考：[过长函数 Long Function | 保持对象完整(319)](#s319)

## 11. 基本類型偏執 / Primitive Obsession
建立与问题域有用的基本类型

### <span id="s174">以对象取代基本类型(174)</span>
以`以对象取代基本类型`将单独存在的数据值替换成对象。
```js
order.filter(o=>"heigh"===o.priority || "rush"===o.priority)
```
⇩
```js
order.filter(o=>o.priority.higherThan(new Priority("normal")))
```
::: tip
一开始的开发，对数据的需求可能仅是简单型态，随著业务的变化，数据的使用型态也会改变。
:::

### 以子类取代类型码(362) + 以多态取代条件表达式(272)
如果欲替换的数据值是控制条件的类型码，则可用` 以子类取代类型码`＋`以多态取代条件表达式`。
参考：[過大的類 Large Class | 以子类取代类型码(362)](#s362)
参考：[过长函数 Long Function ｜ 以多态取代条件表达式(272)](#s272)

### 提炼类(182) + 引入参数对象(140)
如果有一组总是出现的基本类型数据。可用`提炼类`+ `引入参数对象`，移除数据泥团。
参考：[发散式变化 Divergent Change | 提炼类(182)](#s182)
参考：[过长函数 Long Function | 引入参数对象(140)](#s140)

## 12. 重複的 switch / Repeated Switches
重复 Switch 的问题在于，每当想增加一个选择分支时，必须找到所有的 switch。使用多态。

### 以多态取代条件表达式(272)
把 switch 以多态取代。
参考：[过长函数 Long Function ｜ 以多态取代条件表达式(272)](#s272)

## 13. 循環語句 / loops
以 pipline 来取代循环语句，可以让程式的意图更清楚。

### <span id="s231">以管道取代循环(231)</span>
```js
const names = [];
for (const i of input){
  if(i.job==="programmer"){
    names.push(i.name);
  }
}
```
⇩
```js
const names=input
  .filter(i=>i.job==="programmer")
  .map(i=>i.name);
```
::: tip
如今越来越多的编程语言提供更好的语言结构来处理迭代过程，称集合管道(collection pipeline)。
:::


## 14. 冗贅的元素 / Lazy Element
别高估了此前类或函数的能力，设想未来它会变大变复杂，有时他只是个简单的功能。

### 内联函数(115)
参考：[中間人 Middle Man | 内联函数(115)](#s115)

### 内联类(186)
参考：[夸夸其談通用性 Speculative Generality | 内联类(186)](#s186)
### 摺叠继承系统(380)
若处于一个继承体系，可用`摺叠继承系统`。
参考：[夸夸其談通用性 Speculative Generality | 摺叠继承系统(380)](#s380)

## 15. 夸夸其談通用性 / Speculative Generality
企图以各式各样的钩子和特殊情况来处理非必要的事情。用不到的就移除它，别去假设未到的场景而增加不必要的弹性。

### <span id="s380">摺叠继承系统(380)</span>
某个抽象类没太大作用，请`摺叠继承系统`。
```js
class Employee {...}
class Salesman extends Employee {...}
```
⇩
```js
class Employee {...}
```
::: tip
随著继承演化，重构继承体系时，会发现某些类已和超类没差别，这时就会将子类和超类合并。
:::

### 内联函数(115)
`内联函数`除去不必要的委托。
参考：[中間人 Middle Man | 内联函数(115)](#s115)

### <span id="s186">内联类(186)</span>
`内联类`除去不必要的委托。
```js
class person{
  get officeAreaCode(){ return this._telephoneNumber.areaCode; }
  get officeNumber(){ return this._telephoneNumber.number; }
}
class telephoneNumber{
  get areaCode() { return this._areaCode; }
  get number() { return this._number; }
}
```
⇩
```js
class Person{
  get officeAreaCode(){ return this._officeAreaCode; }
  get officeNumber(){ return this._officeNumber; }
}
```
::: tip
与`[提炼类(182)](#s182)`作用相反。一个类不再有存在的理由，便可使其"萎缩",塞进另一个类中。
:::

### 改变函数声明(124)
若函数的某些参数未被用上,`改变函数声明`，去掉参数。
参考：[神秘命名 Mysterious Name | 改变函数声明(124)](#s124)

### 移除死代码(237)
若函数或类只供测试用例使用，先删掉测试用例，再`移除死代码`。
```js
if(false){
  doSomethingThatUseToMatter();
}
```
⇩
```js
```
::: tip
一段代码不再被使用，应立刻消灭它，避免日后花更高的成本去理解这样一个不会被用到代码。勿用注解方式。
:::

## 16. 臨時字段 Temporary Field
避免发生猜测，请将仅为特定情况使用到的代码独立出去。

### 提炼类(182)
为孤儿造一个家。
参考：[发散式变化 Divergent Change | 提炼类(182)](#s182)

### 搬移函数(198)
将相关的代码都放进新家吧
参考：[ 发散式变化 Divergent Change | 搬移函数(198)](#s198)

### <span id="s289">引入特例(289)</span>
变量不合法时创一个替代对象。
```js
if(aCustomer === "unknown"){ customerName = "occupant"; }
```
⇩
```js
class customerName{
  get name() { return "occupant"; }
}
```
::: tip
代码中某段常被呼叫，用来检查某个特殊值。创建一个特例元素，用来处理共用处理。特例可以一个字面量对象、含有行为的对象或类
:::

## 17. 過長的消息鏈 / Message Chains
当请求动作表现出来的是一连串的依赖，我们就需要去思考最终所得对象是用来干什么的。

### 隐藏委托关系(189)
可以在消息链的不同位置使用`隐藏委托关系`。
参考：[內幕交易 Insider Trading | 隐藏委托关系(189)](#s198)

### 提炼函数(106)
再找出最终得到的对象是用来作什么的，将带马蹄练到一个函数中。
参考：[重复代码 Duplicated Code ｜ 提炼函数(106)](#s106)

### 搬移函数(198)
再将函数推入消息链。若还有其他客户端代码需要访问链上的其他对象，同样再添加一个函数来完事。
参考：[ 发散式变化 Divergent Change | 搬移函数(198)](#s198)

## 18. 中間人 / Middle Man
某个类中的接口中有一半以上的函数都委托给其他类，这就发生了过度委托

### <span id="s192">移除中间人(192)</span>
直接和负责的对象打交道。
```js
manager = aPersion.manager;
class Person{
  get manager(){
    return this.Department.manager;
  }
}
```
⇩
```js
manager = aPersion.department.manager;
```
### <span id="s115">内联函数(115)</span>
把不做正事的函数放进调用端。
```js
function getRating(driver){
  return moreThanFiveLateDeliveries(driver)? 2 : 1 ;
}

function moreThanFiveLateDeliveries(driver){
  return driver.numberOfLateDeliveries > 5;
}

```
⇩
```js
function getRating(driver){
  return (driver.numberOfLateDeliveries > 5)? 2 : 1 ;
}
```

### 以委托取代超类(399)
若中间人还也其他动作，可将动作提取为真正对象。
参考：[被拒絕的遺贈 Refused Bequest | 以委托取代超类(399)](#s381)

### 以委托取代子类(381)
若中间人还也其他动作，可将动作提取为真正对象。
参考：[被拒絕的遺贈 Refused Bequest | 以委托取代子类(381)](#s381)


## 19. 內幕交易 /  Insider Trading
模块之间一定的数据交换是不可避免的，但我们还是会尽量避免这情况，将交换都放道明面上来。

### 搬移函数(198)
使用`搬移函数`吧，可减模块间的窃窃私语。
参考：[ 发散式变化 Divergent Change | 搬移函数(198)](#s198)
### 搬移字段(207)
加上`搬移字段`，可减模块间的窃窃私语。
参考：[散彈式修改 Shotgun Surgery ｜ 搬移字段(207)](#s207)
### <span id="s189">隐藏委托关系(189)</span>
将另一个模块变成两者的中介
```js
manager=aPerson.department.manager;
```
⇩
```js
manager=aPerson.manager;
class Person{
  ...
  get manager() {return this.department.manager}
}
```
::: tip
透过 建立委托函数 manager，隐藏了 department 的工作原理。
:::

### 以委托取代子类(381)

参考：[被拒絕的遺贈 Refused Bequest | 以委托取代子类(381)](#s381)

### 以委托取代超类(399)

参考：[被拒絕的遺贈 Refused Bequest | 以委托取代超类(399)](#s381)

## 20. 過大的類 / Large Class
想利用一个类就把所有的事情做完，往往重复代码的情况就会接踵而至。

### 提炼类(182)
彼此相关的变数应该放在一起，可先利用`提炼类`，将代码练到新类。
参考：[发散式变化 Divergent Change | 提炼类(182)](#s182)

### 提炼超类(375)
如组件适合做成一个类，可使用`提炼超类`。
参考：[異曲同工的類 Alternative Classes with Different Interfaces | 提炼超类(375)](#s375)

### <span id="s362">以子类取代类型码(362)</span>
如组件适合做成一个类，也可使用`以子类取代类型码`。
```js
function createEmployee(name,type){
  return new Employee(name,type)
}
```
⇩
```js
function createEmployee(name,type){
  switch (type){
    case "engineer": return new Engineer(name);
    case "salesman": return new Salesman(name);
    case "manager": return new Manager(name); 
  }
}
```
::: tip
可将类型码传入类别，使用多态来管理
:::

## 21. 異曲同工的類 / Alternative Classes with Different Interfaces
使用类的好处，即可以在需要时进行替换。 我们需要做..

### 改变函数声明(124)
1.两个接口一致才能替换，所以我们需要先使用`改变函数声明`，将函数签名变得一致。
参考：[神秘命名 Mysterious Name | 改变函数声明(124)](#s124)

### 搬移函数(198)
2.反覆`搬移函数`，将行为移入类，直到两者协议一致。
参考：[ 发散式变化 Divergent Change | 搬移函数(198)](#s198)

### <span id="s375">提炼超类(375)</span>
如果搬移过程造成代码重复，适时使用`提取超类`。

```js
class Development{
  get totalAnnualCost(){...}
  get name(){...}
  get headCount(){...}
}

class Employee{
  get annualCost(){...}
  get name(){...}
  get id(){...}
}
```
⇩
```js
class Party{
  get name(){...}
  get annualCost(){...}
}

class Department extends Party{
  get annualCost(){...}
  get headCount(){...}
}

class Employee extends Party{
  get annualCost(){...}
  get id(){...}
}
```
::: tip
看到两个类在做相同的事情，可以利用基本的继承机制将相似之处提取到超类。
:::

## 22. 純數據類 / Data class
仅拥有一些字段，及用于访问这些字段的函数。没其他的了。
### <span id="s162">封装记录(162)</span>
若常被操控著，请尽早封装。不需修改的数据无需封装。
```js
organization = {
  mame:"Acme Gooseberries",
  country:"GB"
};
```
⇩
```js
class organization{
  constructor(data){
    this._name = data.name;
    this._country = data.country;
  };
  get name(){ return this._name;};
  set name(arg){this._name = arg}
  get country(){ return this._country;};
  set country(arg){this._country = arg}
}
```
::: tip
将记录型结构的`可变数据`以`类对象`储存，类对象可以隐藏细节，不必追究储存的细节和计算的过程。
:::

### 移除预设函数(331)
不需异动的数据，就别让它被异动
参考：[可变数据 Mutable Data ｜ 移除预设函数(331)](#s331)

### 搬移函数(198)
将操控著此处数据的调用者找出，`搬移函数`，将调用行为搬到该类来。
参考：[可变数据 Mutable Data ｜ 搬移函数(198)](#s198)

### 提炼函数(106)
若无法搬移整个函数，就请`提炼函数`，产生可被搬移的函数。
参考：[重复代码 Duplicated Code ｜ 提炼函数(106)](#s106)

### 拆分阶段(154)
纯数据调用对象，被用作函数的返回结果，得到中转数据结构。
参考：[发散式变化 Divergent Change | 拆分阶段](#s154)

## 23. 被拒絕的遺贈 / Refused Bequest
子类应该依照真实需求去复用超类的的行为，若用不到超类的功能，就别去继承。

### <span id="s359">函数下移(359)</span>
继承的超类里，用不到的函数，就移到独立的新子类里去。如此超类便只持有所有子类共享的东西。
```js
class Employee{
  get quota(...)
}
class engineer extends Employee{...}
class salesman extends Employee{...}
```
⇩
```js
class Employee{...}
class engineer extends Employee{...}
class salesman extends Employee{
  get quota(...)
}
```
::: tip
如果超类内的某个函数，只与一个子类有关，那么最好将其移走，挪到子类去。
:::
### 字段下移
继承的超类里，用不到的字段，就移到独立的新子类里去。如此超类便只持有所有子类共享的东西。
```js
class Employee{
  private String quota;
}
class engineer extends Employee{...}
class salesman extends Employee{...}
```
⇩
```js
class Employee{...}
class engineer extends Employee{...}
class salesman extends Employee{
  private String quota;
}
```
::: tip
如果字段只被子类使用，便从超类移到子类去。
:::
### <span id="s381">以委托取代子类(381)</span>
继承关系遇到问题时，`以委托取代子类`是常见情况。
```js
class Order{
  get daysToShip(){
    return this._warehouse.daysToShip;
  }
}
class PriorityOrder extends Order{
  get daysToShip(){
    return this._priorityPlan.daysToShip;
  }
}

```
⇩
```js
class Order{
  get daysToShip(){
    return (this._priorityOrderDelegate)
      ? this._priorityDelegate.daysToShip
      : this._warehouse.daysToShip;
  }

}
class PriorityOrderDelegate{
  get daysToShip(){
    return this._priorityPlan.daysToShip;
  }
}
```

### <span id="s399">以委托取代超类(399)</span>
继承关系遇到问题时，`以委托取代超类`是常见情况。
```js
class List {...}
class stack extends List {...}
```
⇩
```js
class stack {
  constructor(){
    this._storage = new List();
  }
}
class List {...}
```
::: tip
如果超类的一些函数对子类并不适用，就说明我们不应该通过继承来获得超类得功能。改用委托。
:::

## 24. 注释 / Comments
此处不是否定注解的功用。而是留心省思我们代理里下注解的地方，是不是有前面提到的坏味道。代码中有注解的地方，是我们对传达没法握，觉得该处没法清楚让未来的修改者理解。试著让注释变得多馀看看。

### 提炼函数(106)
若需要注释来解释代码块，请先试试`提炼函数`。
参考：[重复代码 Duplicated Code | 提炼函数(106)](#s106)

### 改变函数声明(124)
好的函数命名可以一眼看出函数用途，不必查看代码。函数的参数亦是。
参考：[神秘命名 Mysterious Name | 改变函数声明(124)](#s124)

### 引入断言(302)
以断言来说明程式码规格需求。
```js
if(this.discountRate){
  base=base-(this.discountRate*base);
}
```
⇩
```js
assert(this.discountRate>=0)
if(this.discountRate){
  base=base-(this.discountRate*base);
}
```
::: tip
当某个条件为真时，某段代码才能正常运行。断言对于交流很有帮助，可以告诉阅读者，程式执行道该处时，对当前状态做了何种假设。
:::
