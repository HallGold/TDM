# IceDatePicker(日期选择控件)

## 功能说明
    IceDatePicker主要基于ElDatePicker进行功能扩展，扩展时间范围选择

## 参数说明
 1. <b>max  (日期选择最大值)</b>

    类型：String

    默认值：无

    是否可为空：&radic;

    说明：采用days:1等[表达式](/components/IceDatePicker.html#表达式说明)

 2. <b>min  (日期选择最小值)</b>

    类型：String

    默认值：无

    是否可为空：&radic;

    说明：采用days:1等[表达式](/components/IceDatePicker.html#表达式说明)

 3. <b>timeFilter  (日期选择范围过滤函数)</b>

    类型：Function

    默认值：无

    是否可为空：&radic;

    说明：优先级最高(高于min和max)，格式：time=>{return true}  返回Boolean

 4. <b>value  (日期选择框值，可以配合v-model使用)</b>

    类型：\[Date, String\]

    默认值：无

    是否可为空：&times;




## 表达式说明

    表达式采用(日期范围类型：数值)方式进行表达，日期范围类型有：
        days(天)、weeks(周)、months(月)、years(年)

    如：days:1  表示明天  weeks:1  表示下周当前时间  months、years以此类推

    配合min和max,如min:"weeks:-1"  max:"days:0" 表示日期选择范围为最近一周

## 其它说明

    本组件主要对ElDatePicker进行功能扩展，ElDatePicker可用属性可和事件都可以在本组件上使用

   参考[DatePicker](http://element-cn.eleme.io/#/zh-CN/component/date-picker#attributes)