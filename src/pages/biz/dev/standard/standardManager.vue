<template>
    <div class="content-filled">
        <ice-tree-grid :load-url="ENUMS.ACTIONS.STANDARD_TREE_DEV.URL()"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="code"
                       children-prop="childCategory"
                       :lazy="false"
                       chooseItem="multiple"
                       :data-url="ENUMS.ACTIONS.GET_STANDARD_TREE_DEV_LIST.URL()"
                       :pagination="false"
                       :columns="columns"
                       :buttons="buttons"
                       :query="query"
                       :operations="operations"
                       @selection-change="handleSelectionChange"
                       @node-click="dataTree">
        </ice-tree-grid>
        <standard-edit ref="edit"
                       :is-success="isSuccess"
                       :is-edit="isEdit"
                       :main-data-form="mainDataForm"
                       :category="category"></standard-edit>
    </div>
</template>

<script>
    import IceTreeGrid from "@/components/common/base/IceTreeGrid";
    import StandardEdit from "./standardEdit";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"

    export default {
        name: "standardManager",
        mixins: [bizComm, devComm],
        components: {StandardEdit, IceTreeGrid},
        data() {
            return {
                query: [
                    {code: 'propertyName', label: '属性名', type: 'input'},
                    {
                        type: 'static', code: 'category', exp: '=', value: () => {
                            return this.category
                        }
                    }
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '属性名', code: 'propertyName', width: 200},
                    {
                        label: '是否必填', code: 'necessary', width: 150, renderCell(h, data) {
                            return data.row.necessary == 1 ? '是' : '否'
                        }
                    },
                    {
                        label: '是否启用', code: 'using', width: 150, renderCell(h, data) {
                            return data.row.using == 1 ? '是' : '否'
                        }
                    },
                    {label: '排序', code: 'sort', sortable: true, width: 120},
                    {label: '属性说明', code: 'detail'},
                ],
                buttons:[],
                operations: [
                    {name: '修改', callback: this.upDataItem},
                    {name: '查看', callback: this.detailsItem, dbclick: true}
                ],
                mainDataForm: {//编辑--表单对象
                    propertyName: '',
                    sort: '',
                    necessary: '1',
                    using: '',
                    detail: ''
                },
                ids: '',                         //oid，用于启用，禁用的参数
                category: '',                    //所属类型的code值
                isEdit: false,                   //是否为编辑状态
                paramsItem: {                    //导出参数
                    columns: [],
                    conditions: [],
                    size: 100000,
                    current: 1,
                    exportColumns: '',
                    exportTitle:'设备规格维护',
                    conditionLink: 'AND'
                },
            }
        },
        methods: {
            /**新增*/
            addItem() {
                this.isEdit = true;
                this.mainDataForm = {
                    propertyName: '',
                    sort: '',
                    necessary: '1',
                    using: '',
                    detail: ''
                };
                this.mainDataForm.using = this.ENUMS.YES_NO.YES.toString();
                this.mainDataForm.necessary = this.ENUMS.YES_NO.YES.toString();
                this.$refs.edit.openDialog();
            },
            /**保存成功后的回调*/
            isSuccess() {
                this.refreshItem();
            },
            /**页面数据刷新*/
            refreshItem() {
                this.$refs.iceGrid.$refs.queryGrid.refresh();
                this.$nextTick(() => {
                    this.ids = '';
                });
            },
            /**查看*/
            detailsItem(row) {
                this.isEdit = false;
                this.getData(row);
            },
            /**修改*/
            upDataItem(row) {
                this.isEdit = true;
                this.getData(row);
            },
            /**导出*/
            exportExcel() {
                this.paramsItem.columns = ['propertyName', 'necessary', 'using', 'sort', 'detail'];
                this.paramsItem.exportColumns = 'propertyName::属性名::,necessary::是否启用::,using::是否启用::,' +
                    'sort::排序::,detail::属性说明::';
                let headers = {'Accept': 'application/ice-xls;q=1,*/*;q=0.5'};
                this.$axios.get("/biz/BizDevChildTypeProperty/page", {
                    params: this.paramsItem,
                    headers: headers,
                    responseType: 'blob'
                }).then(success => {
                    this.$message.success("导出成功");
                }).catch(error => {
                    this.$message.error(error.msg);
                });
            },
            /**获取单条数据--用于查看，修改*/
            getData(row) {
                this.axios(this.ENUMS.ACTIONS.GET_STANDARD_TREE_DEV_LIST_SINGLE, {"id": row.oid}, [res => {
                    //成功的回调
                    this.mainDataForm = res.data;
                    this.mainDataForm.necessary = this.mainDataForm.necessary.toString();
                    this.mainDataForm.using = this.mainDataForm.using.toString();
                    this.$nextTick(() => {
                        this.$refs.edit.openDialog();
                    })
                }, res => {
                    //有返回值，返回的内容与实际不符
                    this.$message.error(res.msg);
                }, res => {
                    //catch到的内容
                    this.$message.error(res.msg);
                }]);
            },

            /**禁用*/
            disabledItem() {
                if (this.ids) {
                    this.axios(this.ENUMS.ACTIONS.DISABLED_STANDARD_TREE_DEV_LIST,{"ids":this.ids,"type":this.ENUMS.YES_NO.NO},[res=>{
                        this.refreshItem();
                    }],[res=>{
                        this.$message.error(res.msg);
                    }],[res=>{
                        this.$message.error(res.msg);
                    }]);
                } else {
                    this.$message.warning("请选择需要禁用的数据");
                }
            },
            /**启用*/
            enabledItem() {
                if (this.ids) {
                    this.axios(this.ENUMS.ACTIONS.ENABLED_STANDARD_TREE_DEV_LIST,{"ids":this.ids,"type":this.ENUMS.YES_NO.YES},[res=>{
                        this.refreshItem();
                    }],[res=>{
                        this.$message.error(res.msg);
                    }],[res=>{
                        this.$message.error(res.msg);
                    }]);
                } else {
                    this.$message.warning("请选择需要启用的数据");
                }

            },
            /**树形节点获取*/
            dataTree(code) {
                this.category = code+'';
                this.ids = '';
            },
            /**列表多选框返回所选择的行信息*/
            handleSelectionChange(rows) {
                this.ids = '';
                this.paramsItem = {
                    columns: [],
                    conditions: [],
                    size: 100000,
                    current: 1,
                    exportColumns: '',
                    exportTitle:'设备规格维护',
                    conditionLink: 'AND'
                };
                rows.forEach(item => {
                    this.ids += ',' + item.oid;
                    this.paramsItem.conditions.push({
                        column: 'oid',
                        exp: 'in',
                        value: item.oid
                    });
                });
                this.ids = this.ids.substr(1);
            },
            /**初始化按钮*/
            initButtons() {
                this.buttons = [Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.addItem}),//新增
                    Object.assign({}, this.COMM_ENUMS.BUTTON.FORBIDDEN, {callback: this.disabledItem}),//禁用
                    Object.assign({}, this.COMM_ENUMS.BUTTON.USING, {callback: this.enabledItem}),//启用
                    /*Object.assign({}, this.COMM_ENUMS.BUTTON.DOWNLOAD),//导入--待实现
                    Object.assign({}, this.COMM_ENUMS.BUTTON.UPLOAD,{callback: this.exportExcel}),//导出*/
                ];
            },
        },
        mounted() {
            this.initButtons();
        }
    }
</script>

<style scoped>

</style>