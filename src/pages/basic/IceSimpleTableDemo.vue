<template>
    <ice-simple-table style="width: 100%;"
                      class="hahah"
                      height="auto"
                      ref="grid"
                      :remoteQuery="true"
                      :remotePager=" true"
                      :editable="true"
                      queryUrl="/biz/BizSoftwareInfo/admin/list"
                      resizable
                      border
                      auto-resize
                      @resizable-change="resizableChange"
                      @select-change="checkboxChange"
                      :edit-rules="validRules"
                      :toolbar="tableToolbar"
                      :checkbox-config="{reserve: true}"
                      :columns="tableColumn">

    </ice-simple-table>
</template>

<script>

    import printUtil from '@/utils/printUtil'

    export default {
        name: "IceSimpleTableDemo",
        data() {
            return {
                tableColumn: [
                    {type: 'checkbox', width: 50, fixed: 'left'},
                    {field: 'oid', visible: false, primaryKey: true},
                    {type: 'seq', title: '序号', width: 60, fixed: 'left'},
                    {
                        field: 'softName',
                        title: '软件名称',
                        width: 160,
                        align: 'left',
                        sortable: true,  //启用当前列排序功能
                        defaultSort: "asc", //当前列默认排序
                        type: 'input',      //当单元格需要编辑或者自动格式化数据时必须选择相应的数据类型
                        filterable: true,  //启用当前列头查询功能
                        filterProps: {     //对过滤器的属性
                            type: 'textRange',  //修改查询框类型，text 文本比配查询  textRange  文本范围查询
                            props: {}
                        },
                        showOverflow: true,
                        fixed: 'left',
                        /* editRender: {
                             name: 'IceInput',
                         },*/
                        quickQuery: false   //指定当前列支持快速查询
                    },
                    {
                        field: 'lockedStatus',
                        title: 'lockedStatus0',
                        width: 160,
                        sortable: true,
                        align: 'left',
                        type: 'select',
                        filterable: true,
                        props: {
                            /* mapTypeCode: 'enabled'*/
                            dataUrl: '/biz/ProEvtWorkTicketLog/cazjlList?workTicket=IM_202002060001_02',
                            textProp: "operationTypeName",
                            codeProp: "oid"
                        },
                        editable: true   // 当前列是否可编辑
                    },
                    {
                        field: 'softVersion',
                        title: 'softVersion',
                        filterable: true,
                        type: 'input',
                        width: 160,
                        sortable: true
                    },
                    {
                        field: 'updateDate',
                        title: 'updateDate',
                        showOverflow: true,
                        width: 200,
                        type: 'date',
                        sortable: true,
                        align: 'left'
                    },
                    {
                        field: 'fileId',
                        title: 'file',
                        showOverflow: true,
                        width: 200,
                        type: 'file',
                        sortable: false,
                        align: 'left'
                    },
                    {
                        title: '操作',
                        type: 'button',
                        align: 'center',
                        fixed: 'right',
                        width: 120,

                        buttons: [{name: '行保存', code: 'save_row'},
                            {
                                name: '删除', code: 'delete_row', remote: true, visible: row => {
                                    return row.softName == '服服服服'
                                }
                            }]
                        /*cellRender: {
                            name: 'IceRowButton',
                            buttons: [{name: '哈哈', code: 'save_row'},
                                {name: '删除', code: 'delete_row', remote: true}]
                        }*/
                    },
                ],
                tableData: [],
                tableToolbar: {
                    id: "123", //可以忽略
                    buttons: [
                        {
                            code: 'insert_actived', icon: 'el-icon-plus', name: '新增', disabled: _ => {
                                //console.log(this.$refs.grid)
                                return this.$refs.grid ? this.$refs.grid.getCheckboxRecords() == 0 : false
                            }
                        },
                        {
                            code: 'full_validate',//select_validate 校验选中的数据
                            name: '数据校验',
                            recordsCallback: ({error, insertRecords, removeRecords, updateRecords}) => {
                                if (!error) {
                                    console.log(insertRecords, removeRecords, updateRecords)
                                } else {
                                    console.log(error)
                                }
                            }
                        },
                        {
                            name: '数据导出',
                            dropdowns: [
                                {code: 'open_import', name: '高级导入'},
                                {code: 'open_export', name: '高级导出'}
                            ]
                        },
                        {
                            name: '数据导出',
                            dropdowns: [
                                {code: 'open_import', name: '高级导入'},
                                {code: 'open_export', name: '高级导出'}
                            ]
                        },
                        {
                            code: 'delete', name: '自定义按钮', click: _ => {

                                printUtil.print({
                                    title: '非授权人员申请进入',
                                    titleStyle: 'height:40px;line-height:40px;font-size:24px',
                                    rows: [
                                        [{
                                            colspan: 24,
                                            label: '测试的1',
                                            value: '哈哈哈哈哈哈哈哈',
                                            style: 'color:red;text-align:center;'
                                        }],


                                        [{
                                            colspan: 12,
                                            label: '测试的21',
                                            value: '哈哈哈哈哈哈哈哈'
                                        }, {
                                            colspan: 12,
                                            label: '测试的22',
                                            value: '哈哈哈哈哈哈哈哈'
                                        }],
                                        [{
                                            colspan: 24,
                                            label: '网格标题',
                                            labelStyle: 'textAlign:center'
                                        }],

                                        [{
                                            colspan: 24,
                                            type: 'table',
                                            value: this.$refs.grid.getLabelData(['softName', 'lockedStatus', 'softVersion', 'updateDate', 'fileId']),
                                            columns: [

                                                {prop: 'softName', width: '20%'},
                                                {prop: 'lockedStatus', width: '20%'},
                                                {prop: 'softVersion', width: '20%'},
                                                {prop: 'updateDate', width: '20%'},
                                                {prop: 'fileId', width: '20%'}
                                            ]
                                        }],

                                        [{
                                            colspan: 24,
                                            label: '陪同人员确认',
                                            type: 'embed',
                                            value: [

                                                [{
                                                    colspan: 12,
                                                    labelColspan: 4,
                                                    label: '实际进入时间',
                                                    value: '2020-2-29'
                                                }, {
                                                    colspan: 12,
                                                    labelColspan: 4,
                                                    label: '实际离开时间',
                                                    value: '2020-2-30'
                                                }],
                                                [{
                                                    colspan: 24,
                                                    labelColspan: 4,
                                                    label: '测试的1',
                                                    value: '哈哈哈哈哈哈哈哈',
                                                    style: 'color:red;text-align:center;'
                                                }],
                                            ]
                                        }],


                                    ]
                                })
                                // const data = this.$refs.grid.getLabelData(['softName']);
                                //console.log(data)
                                //console.log(this.$refs.grid.getCheckboxRecords())
                            }
                        },
                        {
                            name: '禁用按钮',
                            visible: false,
                            code: 'ttttt',
                            dropdowns: [
                                {
                                    code: 'other1',
                                    name: '下拉的按钮1',
                                    disabled: false
                                },
                                {
                                    code: 'other2',
                                    name: '下拉的按钮2',
                                    disabled: true
                                },
                                {
                                    code: 'other3',
                                    name: '下拉的按钮3',
                                    disabled: false
                                }
                            ]
                        }
                    ],
                    refresh: true, // 刷新按钮
                    import: true, // 导入按钮
                    export: true, // 导出按钮
                    zoom: true, // 最大化按钮
                    // 列宽操作记录
                    /*resizable: {
                        storage: true
                    },*/
                    // 列操作记录
                    custom: {
                        storage: true
                    }
                },
                validRules: {
                    softName: [
                        {required: true, message: '名称必填'},
                        {min: 3, max: 50, message: '名称长度在 3 到 50 个字符'}
                    ]
                }
            }
        },
        methods: {
            resizableChange() {

                //debugger

                /*this.$refs.grid.recalculate().then(_ => {
                    this.$refs.grid.computeRowHeight()
                })*/

            },
            checkboxChange() {
                //debugger
            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {}
    }

</script>


<style scoped>

</style>
