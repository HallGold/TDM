<template>
    <div class="ice-container">
        <el-table  :data="tableData"
                   size="medium"
                   border="true"
                   style="width: 100%"
                   @cell-dblclick="cellDblclick">
            <div v-for="(item,index) in columns" :key="index" >
                <el-table-column
                        :prop="item.code"
                        :label="item.label"
                        :width="item.width">
                    <template slot-scope="{row,$index}">
                        <div v-if="item.isEdit">
<!--                            input编辑-->
                                <el-input v-if="item.props === undefined || item.props.type==='input'"
                                        v-model="row[item.code]"
                                        @change="inputHandleEdit(row, $index)"
                                        @blur="inputBlur"
                                        autofocus = "true"
                                        :disabled="!showEdit[$index][item.code]"
                                 />
    <!--                            下拉编辑-->
                                <el-select
                                        v-if="item.props != undefined && item.props.type==='select'"
                                        v-model="row[item.code]" placeholder="请选择"
                                        :multiple="item.props.multiple"
                                        :disabled="!showEdit[$index][item.code]"
                                        @change="selectHandleEdit(row, $index,row[item.code],item.props.selectData)">
                                    <el-option
                                            v-for="data in item.props.selectData"
                                            :key="data[item.props.propName.value]"
                                            :label="data[item.props.propName.label]"
                                            :value="data[item.props.propName.value]">
                                    </el-option>
                                </el-select>
                        </div>
                        <span v-else :class="'t-'+(item.align===undefined?'center':item.align)">{{row[item.code]}}</span>
                    </template>
                </el-table-column>
            </div>
<!--            <el-table-column label="操作" width="100">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
        </el-table>
        <div v-if="isPagination">
            <el-pagination
                    class="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'TdmQueryGrid',
        inheritAttrs: false,
        props: {
            isPagination:{
                type:Boolean,
                default: true
            },
            tableData:Array,
            columns:Array,
            dataUrl:String,

        },
        data() {
            return {
                /*页码*/
                current: 1,
                /*数量*/
                size:20,
                total:100,
                showEdit:[]
            }

        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            /*下拉框值改变*/
            selectHandleEdit (row,index,item,selectData) {
                for (let i in selectData) {
                    if(selectData[i].value === item.value){
                        item.label = selectData[i].label;
                    }
                }
                this.tableData[index] = row;
                this.setShowEditInit();
            },
            // 初始化单元格显示状态
            setShowEditInit () {
                for (let item of this.showEdit) {
                    for (let innerItem in item) {
                        item[innerItem] = false
                    }
                }
            },
            //双击单元格
            cellDblclick(row, column, cell, event){
                console.log("selectData",this.columns);
                this.setShowEditInit()
                let nowObj = column.property
                let index = this.tableData.findIndex((item) => {
                    return item.id === row.id
                })
                this.showEdit[index][nowObj] = !this.showEdit[index][nowObj]
            },
            /*添加编辑状态*/
            setShowEdit(){
                let tempShowEdit = []
                for (let item of this.tableData) {
                    let tempShow = {}
                    for (let innerItem in item) {
                        tempShow[innerItem] = false
                    }
                    tempShowEdit.push(tempShow)
                }
                this.showEdit = tempShowEdit
            },
            // 失焦
            inputBlur () {
                this.setShowEditInit()
            },
            /*input改变值*/
            inputHandleEdit (row, index) {
                this.tableData[index] = row
            },
            getTableData(){
                console.log("this.dataUrl",this.dataUrl);
                let params = {};
                params.current = this.current;
                params.size = this.size;
                this.$axios.get(this.dataUrl,{params:params}).then(result => {
                    this.loading = false;
                     if(result.status==200){
                         this.tableData = result.data.records;
                         this.total = result.data.total;
                     }else{

                     }
                });
            }
        },
        created() {
            console.log("isPagination",this.isPagination);
            if(this.dataUrl){
                this.getTableData();
            }
        },
        watch: {
            tableData: function () {
                this.setShowEdit()
            }
        },
    }

</script>

<style lang="less" scoped>
    .pagination {
        float: right;
        flex-shrink: 0;
    }
    .t-center {
        text-align: center;
    }
    .t-right {
        text-align: right;
    }
    .t-left {
        text-align: left;
    }
    table{
        border:solid 1px #add9c0;
    }
    td{
        border:solid 1px #add9c0 !important;
    }
</style>

