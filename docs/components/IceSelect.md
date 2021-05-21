# IceSelect(通用下拉组件)

## 功能说明
    IceSelect主要基于ElSelect进行功能扩展，包括数据字典数据自动填充、下拉数据自动加载等

## 参数说明
 1. <b>value  (下拉框值，可以配合v-model使用)</b>

    类型：String

    默认值：无

    是否可为空：&times;

 2. <b>mapTypeCode  (数据字典编码)</b>

    类型：String

    默认值：无

    是否可为空：&radic;

    说明：mapTypeCode、dataUrl、options必须有一项有数据

 3. <b>dataUrl  (下拉数据加载url)</b>

    类型：String

    默认值：无

    是否可为空：&radic;


 4. <b>options  (下拉数据项)</b>

    类型：Array

    默认值：\[\]

    是否可为空：&radic;

 5. <b>textProp  (文本属项)</b>

    类型：String

    默认值：text

    是否可为空：&radic;

 6. <b>codeProp  (code属性项)</b>

    类型：String

    默认值：code

    是否可为空：&radic;

 7. <b>valueModel  (返回数据模式，主要是在多选模式下使用)</b>

    类型：String

    默认值：array

    是否可为空：&radic;

    说明：在多选模式下，value返回值默认为数组，如：\[1,2,3\]，如果返回模式为string,返回值是："1,2,3"

## 其它说明

    本组件主要对ElSelect进行功能扩展，ElSelect可用属性可和事件都可以在本组件上使用

   参考[select](http://element-cn.eleme.io/#/zh-CN/component/select#select-attributes)


## 注意项

    尽量不要在列表渲染组件中采用dataUrl的方式加载列表数据，如网格、v-for等