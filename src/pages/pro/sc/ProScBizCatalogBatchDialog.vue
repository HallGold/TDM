<template>
    <div >
        <ice-dialog title="选择服务项"
                    :visible.sync="dialogVisibleBatchProScBizCatalog"
                    :buttons="bathButtons"
                    :before-close="closeDialog"
                    width="1000px">
            <div class="ice-container" style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height:400px">

                <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
                    <ice-tree  load-url="/pro/ProScBizCatalogTemplate/createTree?categoryId="
                               label-prop="name"
                               value-prop="name"
                               :default-expanded-keys="['全部']"
                               :showTreeCheckbox="true"
                               @node-check="checkedNodesClick"
                               ref="tree"
                               style="width:25%">
                        <slot name="prefix" slot="prefix"></slot>
                    </ice-tree>
                    <div class="editableArea">
                        <el-form :model="editData" :rules="editRules" label-position="right"
                                 class="conditon-bar" ref="editFormDialog"
                                 style="margin-top: 20px">
                            <el-row :gutter="60">
                                <el-col :span="12">
                                    <el-form-item label="区域:" label-width="140px" prop="areaId">
                                        <el-select placeholder="请选择" v-model="editData.areaId">
                                            <el-option v-for="item in regionList"
                                                       :key="item.oid"
                                                       :label="item.shortname"
                                                       :value="item.oid"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否使用用户级别:" label-width="140px" prop="isUsrLv">
                                        <ice-select placeholder="是否有合作商" map-type-code="YES_NO"
                                                    v-model="editData.isUsrLv">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="60">
                                <el-col :span="12">
                                    <el-form-item label="服务级别:" label-width="140px" prop="lv">
                                        <div style="width:100%">
                                            <ice-select placeholder="请选择" map-type-code="SC_LEVEL"
                                                        v-model="editData.lv" style="width:75%;float:left">
                                            </ice-select>
                                            <el-button type="info"
                                                       icon="el-icon-search"
                                                       @click="innerSLAVisible = true"
                                                       style="float:right" plain>
                                            </el-button>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="主管部门:" label-width="140px" prop="deptName">
                                        <ice-dept-selector
                                                v-model="editData.deptName"
                                                :chooseItem="'single'"
                                                mode="onlySelect"
                                                @select-confirm="selectDeptConfirm"></ice-dept-selector>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="60">
                                <el-col :span="12">
                                    <el-form-item label="是否面向用户:" label-width="140px" prop="isTouser">
                                        <ice-select placeholder="是否面向用户" map-type-code="YES_NO"
                                                    v-model="editData.isTouser">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="审批路径:" label-width="140px" prop="apprRoute">
                                        <ice-select
                                                v-model="editData.apprRoute"
                                                map-type-code="PRO_SC_BIZ_CATALOG_TEMPLATE">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="60">
                                <el-col :span="12">
                                    <el-form-item label="有效开始时间:" label-width="140px" prop="gmtBegin">
                                        <el-date-picker
                                                v-model="editData.gmtBegin"
                                                type="date"
                                                @change="changeGmtBegin"
                                                placeholder="选择日期" format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="有效结束时间:" label-width="140px" prop="gmtEnd">
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
                </div>
            </div>
        </ice-dialog>

        <el-dialog width="30%" title="主管部门" :visible.sync="innerVisible" append-to-body>
            <div style="flex-grow: 1;display: flex;flex-direction: row;height: 350px">
                <ice-tree  load-url="/pro/ProBaseArea/tree"
                            label-prop="shortname"
                            value-prop="oid"
                        @node-click="handleNodeClick">
                    <slot name="prefix" slot="prefix"></slot>
                </ice-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible=false">取 消</el-button>
                <el-button type="primary" @click="saveManageDept">确 定</el-button>
            </div>
        </el-dialog>
        <ice-dialog width="600px" title="查看服务级别信息" :visible.sync="innerSLAVisible">
            <div style="flex-grow: 1;display: flex;flex-direction: row;height: 400px">
                 <ice-query-grid
                        data-url="/pro/ProScSlaLevel/list?lvType=1"
                        :columns="columns">
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
            tendId:{
                type: String,
                default: '0'
            }
        },
        components: {IceDialog, IceQueryGrid,IceSelect,IceTree,IceDeptSelector},
        data(){
            let editColumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '区域', code: 'areaId', width: 120, required: true, hidden: true},

                {label: '区域名称', code: 'areaname', width: 120},
                {label: '是否使用用户级别', code: 'isUsrLv', width: 100,required: true},
                {label: '服务级别', code: 'lv', width: 180,required: true,mapTypeCode:"SC_LEVEL"},
                {label: '主管部门', code: 'deptName', width: 160,required: true},
                {label: '是否面向用户', code: 'isTouser', width: 160},
                {label: '审批路径', code: 'apprRoute', width: 160,mapTypeCode: "PRO_SC_BIZ_CATALOG_TEMPLATE"},
                {label: '有效开始时间', code: 'gmtBegin', width: 120,sortable:true},
                {label: '有效结束时间', code: 'gmtEnd', width: 120,sortable:true},];
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},

                {label: '区域名称', code: 'areaname', width: 120, required: true},
                {label: 'SLA指标', code: 'sname', width: 120, required: true},
                {label: '指标分类', code: 'category', width: 100, required: true,mapTypeCode: "PRO_SLA_CATEGORY"},
                {label: '备注', code: 'inputTxt', width: 100,  required: true},
                {label: '创建人', code: 'updateUser', width: 100},
                {label: '创建时间', code: 'updateDate', width: 130,sortable:true,},
                ]
            return {
                columns:[
                    {label: '主键id', code: 'loid', hidden: true, width: 125},
                    {label: '区域', code: 'areaName', width: 125},
                    {label: 'SLA指标', code: 'sname', width: 125},
                    {label: '等级1', code: 'lv1', width: 125},
                    {label: '等级2', code: 'lv2', width: 125},
                    {label: '等级3', code: 'lv3', width: 125},
                    {label: '等级4', code: 'lv4', width: 125},
                    {label: '等级5', code: 'lv5', width: 125},
                    {label: '等级6', code: 'lv6', width: 125},
                    {label: '等级7', code: 'lv7', width: 125},
                ],
                editColumns:editColumns,
                editData: {
                    areaId:'',
                    isUsrLv:'0',
                    lv:'',
                    deptName:'',
                    isTouser:'',
                    apprRoute:'',
                    gmtBegin:'',
                    gmtEnd:''
                },
                editRules: {
                    areaId:[{required:true,message:'请选择区域',trigger:'change'}],
                    lv:[{required:true,message:'请选择服务级别',trigger:'change'}],
                    deptName:[{required:true,message:'请选择主管部门',trigger:'change'}]
                },
                innerVisible:false,
                innerSLAVisible:false,
                selectedNode:{},
                checkedTreeKeys:[],
                regionList:[],
                list:[],            //存放勾选的树形节点，
                dialogVisibleBatchProScBizCatalog:false,    //批量新增弹窗开关属性
                bathButtons: [//批量新增弹窗的保存--取消
                    {name: '保存', iscannel: false, click: this.saveServeBatch},
                    {name: '取消', iscannel: true,click:this.closeDialog},
                ],
            }
        },
        methods:{
            closeDialog(){
                this.$refs.editFormDialog.resetFields();
                this.dialogVisibleBatchProScBizCatalog = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(){
                this.dialogVisibleBatchProScBizCatalog = true;
                this.$nextTick(()=>{
                    this.resetForm();
                })
            },
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
            /**
             * 是否为最后一个节点
             * @param arr
             */
            isLastNode(arr) {
                arr.forEach(item => {
                    if (item.children && item.children.length > 0) {
                        this.isLastNode(item.children);
                    } else {
                        if (item.oid && this.list.indexOf(item) === -1) {
                            this.list.push(item);
                        }
                    }
                })
            },
            show(){
                this.editData = common.toInitData(this.editColumns, {
                    isUsrLv: '0',
                    isTouser:'0',
                    lv:'1'
                });
            },
            /**
             * 批量新增--保存
             */
            async saveServeBatch(){
                if(this.list.length>0){
                    try {
                        await this.$refs.editFormDialog.validate();
                    }catch (e) {
                        return false;
                    }
                    if(this.list[0].oid){
                        this.list.forEach(item => {
                            item.templateId = item.oid;
                            delete item.oid;
                            Object.assign(item, this.editData);
                        });
                    }
                    await this.$axios.post("/pro/ProScBizCatalog/allSave", {"list": JSON.stringify(this.list)});
                    this.$message.success("保存成功");
                    this.$emit('closeBatchDialog');
                    return true;
                }else{
                    this.$message.warning('请选择需要操作的服务项！');
                    return false;
                }
            },
            handleNodeClick(data, node) {
                this.selectedNode = node
            },
            checkedNodesClick(currentCheckedNode, nodeStatus){
                this.list = [];
                this.isLastNode(nodeStatus.checkedNodes);
            },
            saveManageDept(){
                this.editData.deptName = this.selectedNode.data.shortname;
                this.editData.managementId = this.selectedNode.data.oid;
                this.innerVisible = false
            },
            initRegion(){
                //获取服务目录区域
                this.$axios.get('/pro/ProScBizCatalog/areaAll')
                            .then(result => {
                                this.regionList = result.data
                            }).catch(error => {
                            this.$message.error(error.msg);
                        });
            },
            selectDeptConfirm(datas){
                this.editData.managementId = datas[0].deptCode;
            },
            resetForm(){
                this.$refs.editFormDialog.resetFields();
                this.$refs.tree.refresh();
            }
        },
        mounted(){
            this.initRegion();
        },
    }
</script>

<style lang="less" scoped>


    .editableArea {
        flex-grow: 1;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        padding: 5px;
        background: white;
        margin-left: 5px;

        .operation-bar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            flex-shrink: 0;
            padding: 5px 10px;
            background: #ffffff;
        }

        .grid-bar {
            flex-grow: 1;
            flex-shrink: 1;
            position: relative;
        }
    }
</style>