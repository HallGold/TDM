<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <div class="ice-container">
                <el-form :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editFormDialog"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="是否使用用户级别:" label-width="140px" prop="isUsrLv">
                                <ice-select placeholder="是否有合作商" map-type-code="YES_NO"
                                            v-model="editData.isUsrLv">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="服务级别:" label-width="140px" prop="lv">
                                <div style="width:100%">
                                    <ice-select placeholder="请选择" map-type-code="SC_LEVEL"
                                        v-model="editData.lv" style="width:85%;float:left">
                                    </ice-select>
                                    <el-button type="info"
                                        icon="el-icon-search"
                                        @click="innerSLAVisible = true" 
                                        style="float:right" plain>
                                    </el-button>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="主管部门:" label-width="140px" prop="deptName">
                                <ice-dept-selector
                                v-model="editData.deptName"
                                :chooseItem="'single'"
                                mode="onlySelect"
                                @select-confirm="selectDeptConfirm">
                            </ice-dept-selector>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="有效开始时间:" label-width="140px" prop="gmtBegin">
                                <!-- <el-input placeholder="有效开始时间" v-model="editData.availableStartTime" maxlength="36"></el-input> -->
                                <el-date-picker
                                    v-model="editData.gmtBegin"
                                    type="date"
                                    @change="changeGmtBegin"
                                    placeholder="选择日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="有效结束时间:" label-width="140px" prop="gmtEnd">
                                <!-- <el-input placeholder="有效结束时间" v-model="editData.availableEndTime" maxlength="36"></el-input> -->
                                <el-date-picker
                                    v-model="editData.gmtEnd"
                                    type="date"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"
                                    placeholder="选择日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        <ice-dialog width="900px" title="查看服务级别信息" :visible.sync="innerSLAVisible">
            <div style="flex-grow: 1;display: flex;flex-direction: row;height: 400px">
                 <ice-query-grid
                        data-url="/pro/ProScSlaLevel/list?lvType=1"
                        :columns="columns"
                        ref="mainQueryGrid">
                </ice-query-grid>
            </div>
        </ice-dialog>
    </div>
    
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import common from '@/utils/common.js';
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IceDialog from "../../../components/common/base/IceDialog";
    export default {
        name: "ProScBizCatalogDialog",
        props:{
            checkedIds:{
                type: String,
            }
        },
        components: {IceDialog, IceQueryGrid,IceSelect,IceTree,IceDeptSelector},
        data(){
            let editColumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '用户代码', code: 'usercode', hidden: true},
                {label: '运维组织ID', code: 'tendId', hidden: true},
                {label: '是否使用用户级别', code: 'isUsrLv', width: 100,required: true},
                {label: '服务级别', code: 'lv', width: 180,required: true,mapTypeCode: "SC_LEVEL"},
                {label: '主管部门', code: 'deptName', width: 160},
                {label: '有效开始时间', code: 'gmtBegin', width: 160},
                {label: '有效结束时间', code: 'gmtEnd', width: 120},];
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '区域ID', code: 'areaId', hidden: true},
                {label: '区域名称', code: 'areaname', width: 120, required: true},
                {label: 'SLA指标', code: 'sname', width: 120, required: true},
                {label: '指标分类', code: 'category', width: 100, required: true,mapTypeCode: "PRO_SLA_CATEGORY"},
                {label: '备注', code: 'inputTxt', width: 100,  required: true},
                {label: '创建人', code: 'updateUser', width: 100},
                {label: '创建时间', code: 'updateDate', width: 130,sortable:true},
                ]
            return {
                columns:[
                    {label: '主键id', code: 'loid', hidden: true},
                    {label: '区域', code: 'areaName', width: 125},
                    {label: 'SLA指标', code: 'sname', width: 125},
                    {label: '等级1', code: 'lv1', width: 100},
                    {label: '等级2', code: 'lv2', width: 100},
                    {label: '等级3', code: 'lv3', width: 100},
                    {label: '等级4', code: 'lv4', width: 100},
                    {label: '等级5', code: 'lv5', width: 100},
                    {label: '等级6', code: 'lv6', width: 100},
                    {label: '等级7', code: 'lv7', width: 100},
                ],
                editData: common.toInitData(editColumns, {
                    isUsedUserLevel: '0',
                    serviceLevel: '',
                    // areaShortname: this.treeName + ''
                }),
                editRules: common.toFormRules(editColumns),
                innerSLAVisible:false,
                selectedNode:{},
                options:[
                    {label:'1',value:'1'},
                    {label:'2',value:'2'},
                    {label:'3',value:'3'},
                    {label:'4',value:'4'},
                    {label:'5',value:'5'},
                    {label:'6',value:'6'},
                    {label:'7',value:'7'},
                ]
            }
        },
        methods:{
            /**时间过滤*/
            timeFilter(time) {
                if (time < new Date(this.editData.gmtBegin)) {
                    return true
                }
                return false;
            },
            changeGmtBegin() {
                if ( new Date(this.editData.gmtBegin) >  new Date(this.editData.gmtEnd)) {
                    this.editData.gmtEnd = '';
                }
            },
            show(){
                this.$refs.editFormDialog.resetFields();
            },
            refresh() {
                // this.$refs.mainQueryGrid.refresh();
            },
            saveData(){
                this.$refs['editFormDialog'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    // this.forEach(item => {
                    let list = []
                    this.checkedIds.split(',').forEach(item => {
                        if(item){
                            let param = Object.assign({}, this.editData);
                            param.oid = item
                            list.push(param)
                        }
                    })
                    this.$axios.post("/pro/ProScBizCatalog/allUpdate", {"list": JSON.stringify(list)})
                        .then(result => {
                            this.$emit('closeDialog')
                            this.$message.success("保存成功");
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            selectDeptConfirm(datas){
                this.editData.managementId = datas[0].deptCode;
            },
        },
    }
</script>

<style scoped>

</style>