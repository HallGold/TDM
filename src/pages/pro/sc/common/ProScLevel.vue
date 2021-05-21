<template>
    <ice-dialog title="新增级别信息"
                width="800px"
                :visible.sync="dialogEditVisible"
                remounted>
        <ice-editable-table height="400" :data="tableData" :rules="tableRules" ref="elTable">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column  width="150" label="区域" prop="areaName"></el-table-column>
            <el-table-column  width="120" label="SLA指标" prop="sname"></el-table-column>
            <el-table-column  width="100" label="等级" prop="lv"></el-table-column>
            <ice-editable-table-column input-type="select"
                                       map-type-code="SC_OPTION"
                                       :width="120"
                                       label="操作符"
                                       prop="op"></ice-editable-table-column>
            <ice-editable-table-column :min="0"
                                       :max="99"
                                       :precision="0"
                                       input-type="number"
                                       :width="120"
                                       label="级别目标值"
                                       prop="target"></ice-editable-table-column>
            <ice-editable-table-column input-type="select"
                                       map-type-code="SC_TIME"
                                       :width="120"
                                       label="单位"
                                       prop="unit"></ice-editable-table-column>
        </ice-editable-table>
        <div class="ice-button-bar">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </ice-dialog>
    
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    export default {
        name: "ProScLevel",
        components: {IceEditableTableColumn, IceEditableTable, IceDialog},
        data(){
            return{
                tableData:[],//table列表数据
                tableRules:{//table列表的字段验证规则
                    op: {
                        required: true, message: '请选择操作符', trigger: 'change'
                    },
                    target: {
                        required: true, type: 'number', whitespace: true, message: '请填写级别目标值', trigger: 'blur'
                    },
                    unit: {
                        required: true, message: '请选择单位', trigger: 'change'
                    },
                },
                dialogEditVisible:false,        //弹窗开关属性
                lvType:1,                       //服务类型
            }
        },
        methods:{
            /**
             * 打开弹窗
             * @param url
             * @param params
             */
            openDialog(url,lvType){
                this.lvType = lvType;
                let _this = this;
                this.$axios.get(url).then(success=>{
                    _this.tableData = [];
                    _this.tableData = success.data;
                    let lv = 2;
                    lv = _this.getLv(this.tableData[0]);
                    _this.tableData.forEach(item=>{
                        item.lv = lv;
                    });
                    _this.dialogEditVisible = true;
                }).catch(e=>{
                    this.$message.error(e.msg);
                })
            },
            /**
             * 获取当前等级并设置等级为原+1--不超过7级的状态下
             * @param item
             * @returns {*}
             */
            getLv(item){
                if(item.lv7){
                    return false
                }else if(item.lv6){
                    return 7;
                }else if(item.lv5){
                    return 6;
                }else if(item.lv4){
                    return 5;
                }else if(item.lv3){
                    return 4;
                }else if(item.lv2){
                    return 3;
                }else {
                    return 2;
                }
            },
            /**
             * 保存
             */
            save(){
                this.tableData.forEach(item=>{
                    item.criteriaId = item.oid;
                    item.lvType = this.lvType;
                    delete item.oid;
                });
                this.$refs.elTable.validateAll((valid)=>{
                    if(valid){
                        this.$axios.post('/pro/ProScSlaLevel/saveLevel', {"list": JSON.stringify(this.tableData)}).then(res=>{
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.$emit("isSuccess");
                        }).catch(e=>{
                            this.$message.error(e.msg);
                        })
                    }
                })
            },
            /**
             * 取消
             */
            closeDialog(){
                this.dialogEditVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>