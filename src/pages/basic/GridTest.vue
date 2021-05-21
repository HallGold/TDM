<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">


        <!--        <ice-form-panels >

                </ice-form-panels>

                <ice-form-panels >

                </ice-form-panels>

                <ice-form-panels >

                </ice-form-panels>-->

        <!--<ice-query-grid title="数据显示标题"
                        data-url="/query"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        @select-confirm="selectConfirm"
                        :buttons="buttons">
        </ice-query-grid>-->
        <!--<ice-grid-layouts :columns="4" gutter="20px">

        </ice-grid-layouts>-->
        <!-- <el-table
                 :data="gridDataList"
                 :stripe="true"
                 height="100%"
                 style="width: 100%;">
             <el-table-column
                     :fit="true"
                     prop="input"
                     label="测试input">
                 <template slot-scope="scope">
                     <el-input v-model="scope.row.input"></el-input>
                 </template>
             </el-table-column>

             <el-table-column
                     :fit="true"
                     prop="select"
                     label="测试下拉框">
                 <template slot-scope="scope">
                     <ice-select v-model="scope.row.select" map-type-code="select">

                     </ice-select>
                 </template>
             </el-table-column>
             <el-table-column
                     :fit="true"
                     prop="select"
                     label="测试下拉框">
                 <template slot-scope="scope">
                     <ice-select v-model="scope.row.select" map-type-code="select">

                     </ice-select>
                 </template>
             </el-table-column>
             <el-table-column
                     :fit="true"
                     prop="select"
                     label="测试下拉框">
                 <template slot-scope="scope">
                     <ice-select v-model="scope.row.select" map-type-code="select">

                     </ice-select>
                 </template>
             </el-table-column>
             <el-table-column
                     :fit="true"
                     prop="select"
                     label="测试下拉框">
                 <template slot-scope="scope">
                     <ice-select v-model="scope.row.select" map-type-code="select">

                     </ice-select>
                 </template>
             </el-table-column>
         </el-table>-->
        <!--<el-button @click="validate(1)"></el-button>-->
        <!-- <router-link to="/basic/treetest">123</router-link>
         <ice-editable-table :data="gridDataList"
                             ref="table"
                             :stripe="true"
                             height="100%"
                             :rules="rules"
                             style="width: 100%;">
             <ice-editable-table-column prop="input"
                                        label="测试input" input-type="input">

             </ice-editable-table-column>
             <ice-editable-table-column prop="select"
                                        label="测试select"
                                        input-type="select"
                                        map-type-code="select">

             </ice-editable-table-column>
             <ice-editable-table-column prop="date"
                                        label="测试date"
                                        input-type="date">

             </ice-editable-table-column>
             <ice-editable-table-column prop="checkbox"
                                        label="测试checkbox"
                                        input-type="checkbox"
                                        checkbox-label="是/否">

             </ice-editable-table-column>
             <ice-editable-table-column label="测试scope">
                 <template slot-scope="scope">

                     <el-input v-model="scope.row[scope.prop]"></el-input>

                 </template>

             </ice-editable-table-column>

             <el-table-column label="操作">
                 <template slot-scope="scope">
                     <el-button type="text"
                                size="small" @click="validate(scope.$index)">保存
                     </el-button>
                 </template>
             </el-table-column>
         </ice-editable-table>-->


    </div>
</template>

<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'
    import IceSelect from '../../components/common/base/IceSelect.vue'


    import IceEditableTable from '../../components/common/base/IceEditableTable.vue'
    import IceEditableTableColumn from '../../components/common/base/IceEditableTableColumn.vue'


    export default {
        name: 'gridTest',
        data() {
            return {
                gridDataList: [
                    {input: '', select: '', checkbox: 'true'},
                    {input: '', select: ''},
                    {input: '', select: ''},
                    {input: '', select: ''},
                    {input: '', select: ''}
                ],
                rules: {
                    input: {type: "string", required: true, message: 'input不能为空'},
                    select: {type: "string", required: true, message: 'select不能为空'},
                },
                query: [{type: 'input', label: '条件1', code: 'query1'},
                    {
                        type: 'select', label: '条件2', code: 'query2',
                        list: [{label: '下拉1', value: '1'},
                            {label: '下拉2', value: '2'},
                            {label: '下拉3', value: '3'}]
                    },
                    {type: 'date', label: '条件3', code: 'query3'},
                    {
                        type: 'time', label: '条件4', code: 'query4', list: {
                            start: '08:30',
                            step: '00:15',
                            end: '18:30'
                        }
                    }, {type: 'input', label: '条件5', code: 'query5'},
                    {type: 'input', label: '条件6', code: 'query6'}, {type: 'input', label: '条件7', code: 'query7'},
                    {type: 'input', label: '条件8', code: 'query8'},],
                columns: [{label: '姓名', code: 'name', width: 120, sortable: true},
                    {label: '省份', code: 'province', width: 120, mapTypeCode: 'provinceMap', sortable: true},
                    {label: '市区', code: 'city', width: 120, mapTypeCode: 'cityMap'},
                    {label: '地址', code: 'address', width: 420},
                    {label: '邮编', code: 'zip', width: 120}],
                operations: [{name: '删除', callback: this.deleteItem}],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.deleteItem}],
                value: "",
                components: [{
                    id: 'testinput1',
                    type: "input",
                    x: 0,
                    y: 0,
                    w: 1,
                    h: 1,
                    name: "testinput1",
                    value: "",
                    label: "label1:",
                    rule: [{required: true, message: '请输入testinput1', trigger: 'blur'}],
                    attrs: {
                        'suffix-icon': 'el-icon-edit',
                    },
                    listeners: {
                        "blur": value => {
                            console.log(this);
                        }
                    }
                }, {
                    id: 'testinput2',
                    type: "input",
                    x: 1,
                    y: 0,
                    w: 2,
                    h: 1,
                    name: "testinput2",
                    value: "",
                    label: "label2:",
                    rule: [{required: true, message: '请输入testinput2', trigger: 'blur'}],
                    attrs: {
                        'suffix-icon': 'el-icon-edit',
                    },
                    listeners: {
                        "blur": value => {
                            console.log(this.sum())
                            console.log(this);
                        }
                    }
                }]
            }
        },
        methods: {
            deleteItem(item) {
                console.log(item)
            },
            validate(rowid) {
                this.$refs.table.validate(rowid);
            },
            selectConfirm(selections) {
                // debugger
            },
            alert() {
                alert(1)
            }
        },
        components: {

            IceQueryGrid,
            IceGridLayout,
            IceSelect,
            IceEditableTable,
            IceEditableTableColumn
        }
    }

</script>


<style scoped>

</style>
