<template>
    <div class="form-content" style="max-height: 500px;overflow-y: scroll;overflow-x: hidden">
        <ice-grid-layout  name="SLA名称" :columns="1">

            <div style="margin-bottom: 2px;">
                SLA指标:
                <el-select placeholder="请选择" v-model="mainData.slaTarget">
                    <el-option v-for="item in SLAList"
                            :key="item.oid"
                            :label="item.sname"
                            :value="item.oid"></el-option>
                </el-select>
            </div>
        
        </ice-grid-layout>
        <ice-form-group name="参考指标">
            <div class="grid-bar" style="width: 100%;">
                <div style="margin-bottom: 2px">
                    <el-button type="primary" @click="addDetailItem">新增</el-button>
                </div>
                <ice-editable-table :data="mainData.editTables" style="width: 100%" v-model="mainData.editTables"
                                    ref="editTable" >
                    <el-table-column :width="150" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <ice-editable-table-column prop="lv"
                        label="级别"
                        :width="150"
                        input-type="select"
                        map-type-code="SC_LEVEL" >
                    </ice-editable-table-column>
                    <ice-editable-table-column prop="op"
                        label="操作符"
                        :width="150"
                        input-type="select"
                        map-type-code="SC_OPTION" >
                    </ice-editable-table-column>
                    <ice-editable-table-column prop="target"
                        label="级别目标值"
                        :width="150"
                        input-type="input" >
                    </ice-editable-table-column>
                    <ice-editable-table-column prop="unit"
                        label="单位"
                        :width="150"
                        input-type="select"
                        map-type-code="SC_TIME">

                    </ice-editable-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text"
                                        size="small" @click="deleteDetailItem(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </ice-editable-table>
            </div>
        </ice-form-group>
    </div>
</template>

<script>
    // import 'quill/dist/quill.core.css';
    // import 'quill/dist/quill.snow.css';
    // import 'quill/dist/quill.bubble.css';
    // import {quillEditor} from 'vue-quill-editor';
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceSingleUpload from "@/components/common/base/IceSingleUpload";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceFormGroup from "@/components/common/base/IceFormGroup";
    import common from '@/utils/common.js';
    export default {
        name: "ProScSlaLevel",
        props:{
            regionId:{
                type: String,
                default: ''
            }
        },
        components: {
            IceFormGroup,
            // quillEditor,
            IceSelect,
            IceSingleUpload,
            IceGridLayout,
            IceFlowForm,
            IceEditableTableColumn,
            IceEditableTable,
            
            // AppactionEdit
        },
        data() {
            return {
                // editRules: {
                //     deviceCode: {required: true,whitespace: true, message: '请输入设备编号', trigger: 'blur'},
                //     deviceName: {required: true,whitespace: true, message: '请输入设备名称', trigger: 'blur'},
                //     deviceType: {required: true,whitespace: true, message: '请输入设备类型', trigger: 'blur'},
                //     deviceIp: {required: true,whitespace: true, message: '请输入设备IP', trigger: 'blur'},
                //     deviceLocation: {required: true,whitespace: true, message: '请输入位置', trigger: 'blur'},
                //     deviceUser: {required: true,whitespace: true, message: '请输入责任人', trigger: 'blur'}
                // },
                mainData:{
                    slaTarget:'',
                    editTables:[]
                },
                SLAList:[]
            }
        },
        methods: {
            /**新增下拉需要的值*/
            addDetailItem() {
                if(this.mainData.editTables.length >= 7){
                    this.$message.error('最多只有七个级别');
                }else{
                    this.mainData.editTables.push({lv: '', op: '',target:'', unit: ''})
                }
                
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                this.mainData.editTables.splice(index, 1);
            },
            saveData(){
                if(this.mainData.editTables.length>0){
                    let list = []
                    this.mainData.editTables.forEach(item => {
                        let param = Object.assign({}, item);
                        param.areaId = this.regionId;
                        param.criteriaId = this.mainData.slaTarget;
                        param.lvType = 1
                        list.push(param)
                    });
                    //获取服务项信息

                    this.$axios.post('/pro/ProScSlaLevel/saveOrUpdate',{"list": JSON.stringify(list)})
                            .then(result => {
                                this.$message.success("保存成功");
                                this.$emit('closeSlaDialog')
                            }).catch(error => {
                            this.$message.error(error.msg);
                        });
                }else{
                    this.$message.error('新增级别不能为空');
                }
                
            }
        },
        mounted(){
            this.$nextTick(() =>{
                //获取服务项信息
                this.$axios.get('/pro/ProScSlaLevel/allCriteria', {"params": {"areaId": this.regionId}})
                        .then(result => {
                            this.SLAList = result.data
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
            });
        }
    }
</script>
<style lang="less" scoped>

.dev-container {
    width: 94%;
    background-color: #FFFFFF;
    overflow-y: auto;
    height: 400px;
    max-height: 400px;
}

.required-star {
    color: red;
}

.tableBtn {
    margin-bottom: 8px;
    margin-left: 8px;
}
.form-content {
        width: 100%;
    }
</style>


