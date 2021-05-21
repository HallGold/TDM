<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData" @callBackSuccess="callBackSuccess">
            <div style="width: 100%;margin: 0 auto;padding: 10px;border: 1px solid #ddd;" slot-scope="flowScope">
                <el-form :model="formModel" :rules="rules" ref="form" :v-loading="loading">
                <el-tabs type="border-card" @tab-click="handleTabs">
                    <el-tab-pane label="任务详情">
                        <el-row :gutter="20">
                            <input :value="formModel.oid" type="hidden">
                            <input :value="formModel.oidXm" type="hidden">
                            <input :value="formModel.pid" type="hidden">
                            <!--模态框内容-->
                            <!--第一行内容-->
                            <el-col :span="12">
                                <el-form-item label="任务名称" label-width="110px" prop="rwname">
                                    <el-input v-model="formModel.rwname" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="WBS编号" label-width="110px" prop="wbscode">
                                    <el-input disabled :value="formModel.wbscode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="前置任务" label-width="110px" prop="qzrw">
                                    <el-input v-model="formModel.qzrw" :disabled="flowScope.formReadonly" @blur="qzrwBlurEvent"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="任务模式" label-width="110px" prop="rwms" map>
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.rwms" map-type-code="RWMS">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="任务类型" label-width="110px" prop="rwlx" map>
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.rwlx" map-type-code="RWLX"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="任务条件" label-width="110px" prop="rwtj" map>
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.rwtj" map-type-code="RWTJ"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="工期" label-width="110px" prop="rwgq">
                                    <el-input-number :disabled="flowScope.formReadonly" :min=0 v-model="formModel.rwgq" @change="rwgqChangeEvent"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="计划开始日期" label-width="110px" prop="dateJhStar">
                                    <el-date-picker :disabled="flowScope.formReadonly" :picker-options="pickerOptions" @change="dateJhStartChange" v-model="formModel.dateJhStar"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="计划完成日期" label-width="110px" prop="dateJhEnd">
                                    <el-date-picker :disabled="flowScope.formReadonly" :picker-options="pickerOptions" @change="dateJhEndChange" v-model="formModel.dateJhEnd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="部门" label-width="110px" prop="rwdept">
                                    <ice-dept-selector chooseItem="single" :mode="isEdit?'readonly':'onlySelect'" v-model="formModel.rwdept" @select-confirm="depts=>{formModel.oidRwdept=depts[0].oid; formModel.rwdeptcode=depts[0].deptCode; formModel.rwdept=depts[0].deptName; }">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="任务负责人" label-width="110px" prop="rwfzr">
                                    <ice-persion-selector :mode="isEdit?'readonly':'onlySelect'" chooseItem="single" :dept-code="formModel.rwdeptcode" v-model="formModel.rwfzr"  @select-confirm="persion=>{formModel.oidRwfzr=persion[0].oid; formModel.rwfzrcode=persion[0].code; formModel.rwfzr=persion[0].name; }" >
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                
                                <el-form-item label="资源类型" label-width="110px" prop="zylx" map>
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.zylx" map-type-code="ZYLX">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="资源名称" label-width="110px" prop="zynqme">
                                    <el-input :disabled="flowScope.formReadonly" v-model="formModel.zynqme"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="任务状态" label-width="110px" prop="rwzt" map>
                                    <ice-select disabled v-model="formModel.rwzt" map-type-code="RWZT">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="固定日期" label-width="110px" prop="gdrq">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.gdrq" map-type-code="IS_YES_NO"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="限制类型" label-width="110px" prop="xzlx" map>
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.xzlx" map-type-code="XZLX">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="限制日期" label-width="110px" prop="xzdate">
                                    <el-date-picker :disabled="flowScope.formReadonly" v-model="formModel.xzdate">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="里程碑任务" label-width="110px" prop="isLcb">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.isLcb" map-type-code="IS_YES_NO"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="关键任务" label-width="110px" prop="isGj">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.isGj" map-type-code="IS_YES_NO"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="项目经费渠道" label-width="110px" prop="xmjfqd">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.xmjfqd" map-type-code="XMLY"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="财务脱密代码" label-width="110px" prop="cwtmdm">
                                    <el-input :disabled="flowScope.formReadonly" v-model="formModel.cwtmdm"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="预算号" label-width="110px" prop="yscode">
                                    <el-input :disabled="flowScope.formReadonly" v-model="formModel.yscode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="紧急程度" label-width="110px" prop="jjcd">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="formModel.jjcd" map-type-code="JJCD"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="任务目标" label-width="110px" prop="rwmb">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.rwmb" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="变更说明" label-width="110px" prop="change">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.change" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                    </el-tab-pane>
                    <el-tab-pane v-if="isndrw" label="经费预算">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="原材料需求" label-width="110px" prop="rwysYcl">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.rwysYcl" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="材料费" label-width="110px" prop="rwysYclfy">
                                    <el-input-number :disabled="flowScope.formReadonly" :precision="2" :step="0.1" :min="0" v-model.number="formModel.rwysYclfy">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="专用费需求" label-width="110px" prop="rwysZy">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.rwysZy" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="专用费" label-width="110px" prop="rwysZyfy">
                                    <el-input-number :disabled="flowScope.formReadonly" :precision="2" :step="0.1" :min="0" v-model.number="formModel.rwysZyfy">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="外协费需求" label-width="110px" prop="rwysWx">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.rwysWx" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="外协费" label-width="110px" prop="rwysWxfy">
                                    <el-input-number :disabled="flowScope.formReadonly" :precision="2" :step="0.1" :min="0" v-model.number="formModel.rwysWxfy">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="事务费需求" label-width="110px" prop="rwysSw">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.rwysSw" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="事务费" label-width="110px" prop="rwysSwfy">
                                    <el-input-number :disabled="flowScope.formReadonly" :precision="2" :step="0.1" :min="0" v-model.number="formModel.rwysSwfy">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-form-item label="其他费需求" label-width="110px" prop="rwysQt">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="formModel.rwysQt" type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="其他费" label-width="110px" prop="rwysQtfy">
                                    <el-input-number :disabled="flowScope.formReadonly" :precision="2" :step="0.1" :min="0" v-model.number="formModel.rwysQtfy">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="任务经费合计" label-width="110px" prop="rwysJfSum">
                                    <el-input-number :precision="2" :value="rwJfSum" disabled>
                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="全时人力投入（人x年）" label-width="110px" prop="rwysRl">
                                    <el-input-number :disabled="flowScope.formReadonly" v-model="formModel.rwysRl">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane v-if="!isModel" name="upload" label="附件上传">
                        <ATTACHMENT :data="formModel.fileList" ref="attachment" :is-handleer="!isEdit"></ATTACHMENT>
                    </el-tab-pane>
                    <el-tab-pane v-if="!isModel" name="cgyd" label="成果约定">
                        <el-input placeholder="不超过650个字" maxlength="650"
                                  show-word-limit :disabled="isEdit" v-model="formModel.cgydms" type="textarea"  :rows="4">
                                    </el-input>
                        <WBSCGYD :data="formModel.cgydList" ref="cgyd" :oid_rw="formModel.oid" :is-handleer="!isEdit"></WBSCGYD>
                    </el-tab-pane>
                </el-tabs>
                
            </el-form>
            </div>
            
        </ice-flow-form>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue';
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionByDeptSelector from "../../../components/common/biz/IcePersionByDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import UploadAttachment from "../../biz/dev/comm/uploadAttachment";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import ATTACHMENT from "../common/ATTACHMENT";
    import WBSCGYD from "./wbsCgyd";

    export default {
         props: {
             // 子组件接收函数
             pcomputeDate: {
                type: Function
             }
         },
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                tableData: [],
                rules: {
                    rwname: [
                        {required: true, whitespace: true, message: '请输入任务名称', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    xmjfqd: [
                        {required: true, whitespace: true, message: '请输入项目经费渠道', trigger: 'blur'}
                    ],
                    dateJhEnd: [
                        {required: true, whitespace: true, message: '请选择计划开始时间', trigger: 'blur'}
                    ],
                    dateJhStar: [
                        {required: true, whitespace: true, message: '请输入计划结束时间', trigger: 'blur'}
                    ],
                    cwtmdm: [
                        {required: true, whitespace: true, message: '请输入财务脱密代码', trigger: 'blur'}
                    ],
                    yscode: [
                        {required: true, whitespace: true, message: '请输入预算号', trigger: 'blur'}
                    ],
                    rwmb: [
                        {required: true, whitespace: true, message: '请输入任务目标', trigger: 'blur'}
                    ],
                    change: [
                        {required: true, whitespace: true, message: '请输入变更说明', trigger: 'blur'}
                    ],  
                },
                //定义弹出框为false，隐藏状态
                visible: false,
                //true 不能编辑 false 可以编辑
                isEdit: false,
                isModel: false,
                isRwjf: false,
                title: '',
                //定义模态框里面的新增内容字段
                formModel: {
                    oid: '',
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    pid: '0',
                    wbscode: '0',
                    rwname: '',
                    rwms: 'RWMS01',
                    rwlx: 'SS',
                    qzrw: '',
                    rwjd: '',
                    rwgq: '1',
                    rwgs: '',
                    dateJhStar: '',
                    dateJhEnd: '',
                    dateSjStar: '',
                    dateSjEnd: '',
                    oidRwdept: '',
                    rwdeptcode: '',
                    rwdept: '',
                    oidRwfzr: '',
                    rwfzrcode: '',
                    rwfzr: '',
                    rwcjr: '',
                    dateCj: '',
                    zylx: '',
                    zynqme: '',
                    rwzt: 'RWZT01',
                    gdrq: '',
                    xzlx: 'XZLX01',
                    xzdate: '',
                    isLcb: '',
                    isGj: '',
                    yscode: '',
                    xmjfqd: '',
                    cwtmdm: '',
                    version: '',
                    dataSecretLevcode: '2',
                    rwysJfSum: '',
                    rwysRl: '',
                    rwysYcl: '',
                    rwysYclfy: '',
                    rwysZy: '',
                    rwysZyfy: '',
                    rwysWx: '',
                    rwysWxfy: '',
                    rwysSw: '',
                    rwysSwfy: '',
                    rwysQt: '',
                    rwysQtfy: '',
                    rwtj: 'FS',
                    dataPxh: '',
                    jjcd: 'yb',
                    rwmb: '',
                    rwwc: '',
                    rwxf: '',
                    cgydms: ''
                },
                dataPxh: 0,
                //定义模态框 转圈加载过程
                loading: false,
                //是否是阶段性年度任务
                isndrw: false,
                treeConfig: {
                    children: 'children'
                },
                visibleAttachment: false
            }
        },
        created () {
            this.pickerOptions = {
                disabledDate(time) {
                    if(new Date(time).getDay() == 0 || new Date(time).getDay() == 6){
                        return true
                    }
                    return false;
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.querySingleWbsByOid()
            })
        },
        //计算属性
        computed: {
            rwJfSum(){
                return this.formModel.rwysYclfy + this.formModel.rwysZyfy + this.formModel.rwysWxfy + this.formModel.rwysSwfy + this.formModel.rwysQtfy
            }
        },
        //触发事件方法
        methods: {
            querySingleWbsByOid() {
                this.formModel.oid = this.$route.query.oid
                this.$axios.get("/pms/PmsWbs/getPmsWbs", {params: {id: this.formModel.oid}})
                .then(result => {
                    this.$nextTick(_ => {   //事件循环
                        let {data} = result
                        console.log(data)
                        this.formModel = data;
                    })
                })
                .catch(error => {
                    this.$message.error("获取数据失败！")
                })
            },
            preItem() {
                this.saveCurrItem()
                //获取上一条
                let formModel = this.formModel
                let matchObj = this.$utils.findTree(this.tableData, item => Number(item.dataPxh) === Number(formModel.dataPxh - 1), this.treeConfig)
                if(!matchObj) {
                    this.$message.warning('已是第一条')
                    return
                }
                let {item, items} = matchObj
                this.formModel = item
                //如果任务已经下发，不能编辑
                this.isEdit = this.formModel.rwxf == 'IS_YES'
            },
            nextItem() {
                this.saveCurrItem()
                //获取下一条
                let formModel = this.formModel
                let matchObj = this.$utils.findTree(this.tableData, item => Number(item.dataPxh) === Number(formModel.dataPxh + 1), this.treeConfig)
                if(!matchObj) {
                    this.$message.warning('已是最后一条')
                    return
                }
                let {item, items} = matchObj
                this.formModel = item
                this.isEdit = this.formModel.rwxf == 'IS_YES'
            },
            save() {
                this.$refs.form.validate((valid) =>{
                    if(valid){
                        this.saveCurrItem()
                        this.$emit('getInfoDate',this.tableData)
                        this.visible= false;                //保存成功之后关闭模态框
                    }
                })
            },
            //保存当前正在修改项
            saveCurrItem() {
                this.$refs.form.validate((valid) =>{
                    if(valid){
                        this.formModel.rwysJfSum=this.rwJfSum
                        let formModel = this.formModel
                        debugger
                        //找到tableData中对应的值，替换
                        let matchObj = this.$utils.findTree(this.tableData, item => item.oid === formModel.oid, this.treeConfig)
                        if (matchObj) {
                            let {item, items, index} = matchObj
                            const children = item.children
                            if(children) {
                                formModel = {...formModel, children}
                            }
                            //文件数据
                            //let { tableData } = this.$refs.xTable.getTableData()
                            console.log(this.$refs.attachment.getData())
                            let fjData = this.$refs.attachment.getData()
                            const insertList = []
                            const deleteList = []
                            if(fjData) {
                                fjData.forEach(item=>{
                                    if(item.version == '-1') {
                                        deleteList.push(item)
                                    }else {
                                        insertList.push(item)
                                    }
                                })
                            }
                            const fileList = formModel.fileList? formModel.fileList: []
                            formModel.fileList = [...fileList, ...insertList]
                            formModel.insertList = insertList
                            formModel.deleteList = deleteList
                            //成果约定
                            const insertData = this.$refs.cgyd.getInsertData()
                            console.log(insertData)
                            const updateData = this.$refs.cgyd.getUpdateData()
                            const deleteData = this.$refs.cgyd.getDeleteData()
                            const cgydList = formModel.cgydList? formModel.cgydList: []
                            formModel.cgydList = [...cgydList, ...insertData]
                            formModel.insertCgyds = insertData
                            formModel.updateCgyds = updateData
                            formModel.deleteCgyds = deleteData
                            console.log(formModel)
                            items.splice(index, 1)
                            items.splice(index, 0, formModel)
                        }
                    }
                })
            },
            deleteItems() {
                let selectRecords = this.$refs.xTable.getSelectRecords()
                console.log(selectRecords)
                if(!selectRecords || selectRecords.length == 0) {
                    this.$message.warning("请至少选择一条数据！")
                    return
                }
                this.$refs.xTable.removeSelecteds()
            },
            //计划开始日期改变，根据工期计算计划结束日期
            dateJhStartChange() {
                let row = this.formModel
                if(row) {
                    //获取前置任务，计划开始日期必须大于前置任务的结束日期
                    let qzNode = this.$utils.findTree(this.tableData, item => item.dataPxh === Number(row.qzrw), this.treeConfig)
                    if(qzNode) {
                        let diffDayObj = this.$utils.getDateDiff(qzNode.item.dateJhEnd, row.dateJhStar)
                        if(!diffDayObj.done || diffDayObj.dd==0) {
                            row.dateJhStar = this.computeDate(qzNode.item.dateJhStar, 1)
                        }
                    }
                    //计算结束日期
                    row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq)-1)
                    //获取该任务的后置任务
                    this.changeHzrw(row)
                }
            },
            //计划结束日期改变，根据计划开始日期计算工期
            dateJhEndChange() {
                let row = this.formModel
                if(row) {
                    //计算结束日期
                    let diffDayObj = this.$utils.getDateDiff(row.dateJhStar, row.dateJhEnd)
                    if(diffDayObj.done) {
                        let day = 0
                        const diffDay=diffDayObj.dd
                        //找出结束日期与开始日期之间的周末
                        for(let i = 0; i < diffDay; i++) {
                            let nextDate = this.$utils.getWhatDay(row.dateJhStar, i + 1)
                            if(new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6){
                                day++
                            }
                        }
                        row.rwgq = diffDay - day + 1
                        //获取该任务的后置任务
                        this.changeHzrw(row)
                    }
                }
            },
            //修改前置任务，联动
            qzrwBlurEvent() {
                let qzrw = this.formModel.qzrw
                if(this.$utils.isInteger(qzrw)) {
                    //找到前置任务
                    let rowNode = this.$utils.findTree(this.tableData, item => item.dataPxh === Number(qzrw), this.treeConfig)
                    if(rowNode){
                        this.formModel.dateJhStar = this.computeDate(rowNode.item.dateJhEnd, 1)
                        this.formModel.dateJhEnd = this.computeDate(this.formModel.dateJhStar, Number(this.formModel.rwgq)-1)
                        //获取该任务的后置任务
                        this.changeHzrw(this.formModel)
                    }

                }
            },
            rwgqChangeEvent() {
                let row = this.formModel
                if(this.$utils.isInteger(row.rwgq) && Number(row.rwgq) > 0) {
                    row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq)-1)
                    this.changeHzrw(row)
                }
            },
            changeHzrw(row) {
                let rowNodes = this.$utils.filterTree(this.tableData, item => Number(item.qzrw) === row.dataPxh, this.treeConfig)
                if(rowNodes && rowNodes.length>0) {
                    rowNodes.forEach(item=>{
                        item.dateJhStar = this.computeDate(row.dateJhEnd, 1)
                        item.dateJhEnd = this.computeDate(item.dateJhStar, Number(item.rwgq)-1)
                        this.changeHzrw(item)
                    })
                }
            },
            //根据日期和工期，返回真实的工作日，排除周末
            computeDate(startDate, day) {
                console.log(this.pcomputeDate(startDate, day))
                return this.pcomputeDate(startDate, day)
            },
            //父组件调用，传入参数
            getParentParams(title, rowData, tableData) {
                this.isndrw = rowData.pid == '0'
                //如果任务已经下发，不能编辑
                this.isEdit = rowData.rwxf == 'IS_YES'
                this.isModel = false
                this.isRwjf = false
                this.title=title
                //获取选中的数据
                this.formModel = JSON.parse(JSON.stringify(rowData))
                
                this.tableData = JSON.parse(JSON.stringify(tableData))
                this.visible=true
            },
            //任务模板详情
            getWbsModelParams(title, rowData, tableData) {
                this.isndrw = rowData.pid == '0'
                this.isEdit = true
                this.isModel = true
                this.isRwjf = false
                this.title=title
                //获取选中的数据
                this.formModel = JSON.parse(JSON.stringify(rowData))
                
                this.tableData = JSON.parse(JSON.stringify(tableData))
                this.visible=true
            },
            //任务交付物详情
            getWbsRwJfwParams(title, rowData, tableData) {
                this.isndrw = rowData.pid == '0'
                this.isEdit = true
                this.isModel = false
                this.isRwjf = true
                this.title=title
                //获取选中的数据
                this.formModel = JSON.parse(JSON.stringify(rowData))
                
                this.tableData = JSON.parse(JSON.stringify(tableData))
                this.visible=true
            },
            rwClose() {
                this.visible= false;
                /*const saveData = this.$refs.cgyd.getUpdateJfwData()
                console.log(this.formModel.oid)
                this.$axios.post("/pms/PmsWbsCgydJf/saveJfw", {$json: {oid_rw: this.formModel.oid, insertCgydJfws: saveData}})
                            .then(result => {
                                this.$message.success("保存成功");  //保存完毕之后的提示
                                this.visible= false;        
                            })
                            .catch(error => {
                                this.$message.error("保存失败");
                                this.visible= false;        
                            })
                            .finally(_ => {
                                this.visible= false;        
                            })*/
            },
            handleTabs(tab) {
                if(tab.name === 'upload') {
                    this.$refs.attachment.resize()
                } else if(tab.name === 'cgyd') {
                    this.$refs.cgyd.handleTable();
                }
            },
            flowReady(flowcont, bizdata) {
                let flowData = this.$refs.flowForm.flowInstData;
                console.log(flowData)
                console.log(flowcont)
                console.log(bizdata)
                console.log(this.formModel)
                Object.assign(this.formModel,bizdata);
            },
            flowOperateBtn(flowContext, bizdata) {
                let result = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        result = true;
                    }else{
                        result = false;
                    }
                });
                return result;
            },
            flowBizData() {
                return this.formModel;
            },
            callBackSuccess(data) {
                console.log(data)
            }
        },
        watch: {
        },
        //这个是你引用插件生成的,不用管它
        components: {
            IceFlowForm,
            IceSelect, 
            IceDialog, 
            IceDeptSelector,
            IcePersionByDeptSelector,
            IcePersionSelector,
            IcePopSelector,
            IceMultipleUpload,
            UploadAttachment,
            IceSingleUpload,
            ATTACHMENT,
            WBSCGYD
        }
    }
</script>
