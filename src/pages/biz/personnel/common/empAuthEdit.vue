<template>
    <div style="width: 100%">
        <ice-editable-table :data="tableData" :rules="tableRules">
            <el-table-column type="index" label="序号"></el-table-column>
            <ice-editable-table-column prop="a" label="角色">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.a">
                        <el-option label="一般用户" value="1"></el-option>
                        <el-option label="系统管理员" value="2"></el-option>
                    </el-select>
                </template>
            </ice-editable-table-column>
            <ice-editable-table-column prop="b" label="系统类别">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.b">
                        <el-option label="基础服务" value="1"></el-option>
                        <el-option label="网络服务" value="2"></el-option>
                        <el-option label="基础服务" value="3"></el-option>
                    </el-select>
                </template>
            </ice-editable-table-column>
            <ice-editable-table-column prop="c" label="系统名称/密级" :width="260">
                <template slot-scope="scope">
                    <div style="width: 100%">
                        <el-select v-model="scope.row.c" multiple collapse-tags style="width: 83%">
                            <el-option label="安全产品/机密" value="1"></el-option>
                            <el-option label="网络服务/绝密" value="2"></el-option>
                            <el-option label="基础服务/公开" value="3"></el-option>
                        </el-select>
                        <el-button style="width: 17%" class="el-icon-edit-outline"></el-button>
                    </div>
                </template>
            </ice-editable-table-column>
            <ice-editable-table-column prop="d" label="变更类型">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.d">
                        <el-option label="开通" value="1"></el-option>
                        <el-option label="回收" value="2"></el-option>
                    </el-select>
                </template>
            </ice-editable-table-column>
            <ice-editable-table-column prop="e" label="权限描述" :width="300">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.e"></el-input>
                </template>
            </ice-editable-table-column>
            <ice-editable-table-column prop="f" label="应用三员" :width="null">
                <template slot-scope="scope">
                    <el-button type="text" @click="detailsItem(scope.row)">详情</el-button>
                </template>
            </ice-editable-table-column>

        </ice-editable-table>
        <ice-dialog width="830px" :visible.sync="dialogVisible" title="详情">
            <ice-query-grid :gridData="gridData"
                            :pagination="false"
                            :query="query"
                            :columns="columns"></ice-query-grid>
            <div class="ice-button-bar">
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    export default {
        name: "empAuthEdit",
        components: {IceQueryGrid, IceDialog, IceEditableTableColumn, IceEditableTable},
        data(){
            return{
                tableData:[{a:'',b:'',c:'',d:'',e:''}],
                tableRules:{},
                gridData:[
                    {a:'OA系统',b:'系统管理员',c:'张三',d:'122室',e:'068972'},
                    {a:'OA系统',b:'安全管理员',c:'李四',d:'123室',e:'068973'},
                    {a:'OA系统',b:'审计管理员',c:'王五',d:'125室',e:'068975'},
                ],
                query:[
                    {label:'系统名称',type:'input',code:'a',exp:'upperLike',value:''},
                    {label:'类型',type:'input',code:'b',exp:'like',value:''},
                    {label:'姓名',type:'input',code:'c',exp:'like',value:''},
                    {label:'部门',type:'input',code:'d',exp:'like',value:''},
                    {label:'电话',type:'input',code:'e',exp:'like',value:''},
                ],
                columns:[
                    {label:'系统名称',code:'a'},
                    {label:'类型',code:'b'},
                    {label:'姓名',code:'c'},
                    {label:'部门',code:'d'},
                    {label:'电话',code:'e'}
                    ],
                dialogVisible:false
            }
        },
        methods:{
            /**
             * 详情
             */
            detailsItem(row){
                this.dialogVisible = true;
            },
            /**
             * 取消
             */
            closeDialog(){
                this.dialogVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>