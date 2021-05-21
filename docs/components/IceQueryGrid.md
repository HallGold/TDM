# IceQueryGrid(通用查询网格组件)

## 功能说明
    IceQueryGrid主要用于网格数据查询，包括查询条件、查询操作按钮、网格Toolbar、数据网格和分页
[]()


## 参数说明
 1. <b>title  (网格显示标题)</b>
[]()
    类型：String, Array

    默认值：无

    是否可为空：&radic;

 2. <b>query  (网格查询列表)</b>

     类型：Array

     默认值：\[\]

     是否可为空：&radic;

     数组内item说明：

        type：类型，选择范围为：

             static：表示固定参数，在所有参数中优先级最高，无论查询条件连接符是AND还是OR，此条件必须满足

             tab: 表示此查询条件采用tab形式呈现，需要有tablist属性，如：
                  [{label: '全部', value: 'all'}, {label: '已发布', value: '1'}, {label: '未发布', value: '0'}]

             select：表示下拉框，默认采用IceSelect，所有相关参数均可直接使用

             input：表示文本输入框

             date：表示日期选择框，默认采用IceDatePicker，所有相关参数均可直接使用

             time：表示时间选择框，默认采用ElTimeSelect

        label：查询显示label

        code：查询控件关联code,此code为后台请求参数key，如果此字段需传递至后台，必填

        value：数据值,必填

        exp：表达式，此查询关系表达式，包括：=、<、<=、>、>=、in、notin、like，文本框默认为like,
             其他默认为=

        prefix:查询key前缀，主要配合code使用，用于处理自定义SQL表别名处理，如T1.name，T1为前缀


 3. <b>columns  (网格列清单)</b>

     类型：Array

     默认值：\[\]

     是否可为空：&times;

     数组内item说明：

        label：数据列名称，必填

        code：数据列数据关联属性，必填

        width：列宽，默认值无，必填

        mapTypeCode：数据字典code，当此列内容为数据字典时，自动翻译该列数据

        sortable：此列是否可排序

        showTips：此列是否显示tips，默认为true

        renderCell：自定义数据列渲染函数，必须使用JSX：(h, data)=>{}

     其他说明：列属性支持所有element-ui的[Table-column](http://element-cn.eleme.io/#/zh-CN/component/table#table-column-attributes)

 4. <b>operations  (网格操作列按钮清单,全部显示在网格右侧,固定列为操作列)</b>

     类型：Array

     默认值：\[\]

     是否可为空：&radic;

     数组内item说明：

        name：按钮名称，必填

        callback：按钮点击后回调方法，必填

        isShow：按钮是否显示判断函数，默认为：(row)=>{return true}

 5. <b>operationsWidth  (网格操作列宽度)</b>

     类型：Number

     默认值：120

     是否可为空：&radic;

 6. <b>buttons  (网格上方操作按钮，ToolBar)</b>

     类型：Array

     默认值：\[\]

     是否可为空：&radic;

     数组内item说明：

        name：按钮名称，必填

        icon：按钮图标，默认无

        type：按钮类型，默认为：primary

        callback：按钮点击后回调方法，必填

 7. <b>dataUrl  (数据请求URL)</b>

     类型：String

     默认值：无

     是否可为空：&radic;

     说明：dataUrl与gridData必须有一个有值


 8. <b>gridData  (网格数据，不建议采用此方式赋值)</b>

     类型：String

     默认值：无

     是否可为空：&radic;

     说明：dataUrl与gridData必须有一个有值

 8. <b>beforeBindData  (数据绑定前置处理函数,用于数据展示前数据处理操作)</b>

     类型：Function

     默认值：data => data

     是否可为空：&radic;

 9. <b>columnsNumber  (查询列表显示列数)</b>

     类型：Number

     默认值：4

     是否可为空：&radic;

 10. <b>queryModel  (查询列表显示模式)</b>

     类型：String

     默认值：quick

     是否可为空：&radic;

     说明：目前支持两种查询列表显示模式，quick(支持快速查询和高级查询), normal(普通查询)

 11. <b>chooseItem  (网格可选模式)</b>

     类型：String

     默认值：none

     是否可为空：&radic;

     说明：目前支持4种模式：

         none：默认无选择框，无选择按钮

         single：单选，单选按钮显示在网格左侧，一般用于弹出单选

         multiple：多选，出现多选框，下方出现确认取消按钮，一般用于弹出多选

         multipleForManage：多选，出现多选框，下方不出现按钮，主要用于数据批量操作

 12. <b>pagination  (是否启用分页)</b>

     类型：Boolean

     默认值：true

     是否可为空：&radic;

 13. <b>gridAutoRefresh  (网格加载后是否自动刷新数据)</b>

     类型：Boolean

     默认值：false

     是否可为空：&radic;

 14. <b>gridIndex  (网格是否显示序号)</b>

     类型：Boolean

     默认值：true

     是否可为空：&radic;

 15. <b>minHeight  (查询网格控件最小高度，一般用于弹出框中)</b>

     类型：Number

     默认值：500

     是否可为空：&radic;

 16. <b>textProp  (网格text属性，用于弹出选择时返回需要的文本值)</b>

     类型：String

     默认值：无

     是否可为空：&radic;

 17. <b>codeProp  (网格code属性，用于弹出选择时返回需要的code值)</b>

     类型：String

     默认值：无

     是否可为空：&radic;

## 其它说明

    尽量使用本组件作为查询列表显示，此控件统一处理了查询条件、查询字段、查询条件连接符等内容，
    可与后端查询无缝对接
