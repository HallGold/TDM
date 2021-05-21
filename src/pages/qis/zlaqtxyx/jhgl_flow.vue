<template>
    <div class="ice-container">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign" @callBackSuccess="handleCallbackFlow">

            <div style="height: 500px;" slot-scope="flowScope">
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="计划信息" name="first">
                        <el-form :model="bizdata" status-icon ref="form" :rules="rules">
                            <!--<el-col :span="7">-->
                            <!--<el-row :gutter="20">-->
                            <!--<el-col :span="24">-->
                            <!--<el-form-item label="责任单位" label-width="140px" prop="deptNames">-->
                            <!--<ice-dept-selector  chooseItem="multiple"-->
                            <!--:mode="flowScope.formReadonly?'readonly':'onlySelect'"-->
                            <!--v-model="bizdata.deptNames"-->
                            <!--value-prop="oid"-->
                            <!--:selectedDept="bizdata.deptOids?bizdata.deptOids.split(','):[]"-->
                            <!--:isTextarea = true-->
                            <!--:textareaRows = 8-->
                            <!--:disabled="flowScope.formReadonly"-->
                            <!--@select-confirm="deptHandler">-->
                            <!--</ice-dept-selector>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--</el-row>-->
                            <!--</el-col>-->
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="计划编号" label-width="140px" prop="jhCode">
                                        <el-input v-model="bizdata.jhCode" placeholder="自动生成" autocomplete="off"
                                                  readonly></el-input>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="计划名称" label-width="140px" prop="jhName">
                                        <el-input v-model="bizdata.jhName" placeholder="请输入" autocomplete="off"
                                                  :disabled="flowScope.formReadonly" maxlength="65"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="计划类型" label-width="140px" prop="jhType">
                                        <ice-select v-model="bizdata.jhType" map-type-code="QIS_ZLJH_TYPE"
                                                    autocomplete="off" :disabled="flowScope.formReadonly"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="计划开始日期" label-width="140px" prop="startDate">
                                        <el-date-picker
                                                :disabled="flowScope.formReadonly"
                                                v-model="bizdata.startDate"
                                                :picker-options="pickerOptions(1)"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="计划完成日期" label-width="140px" prop="endDate">
                                        <el-date-picker
                                                :disabled="flowScope.formReadonly"
                                                v-model="bizdata.endDate"
                                                :picker-options="pickerOptions(2)"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select v-model="bizdata.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL" autocomplete="off"
                                                    :disabled="flowScope.formReadonly"></ice-select>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="计划要求" label-width="140px" prop="jhRemark">
                                        <el-input v-model="bizdata.jhRemark" type="textarea" autocomplete="off"
                                                  placeholder="不超过650字" maxlength="650" show-word-limit=""
                                                  :disabled="flowScope.formReadonly" :rows="3"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20"
                                    v-if="isFlowIn&&(bizdata.jhType==ZLJHZT.GLPS||bizdata.jhType==ZLJHZT.WJBZXD)">
                                <el-col :span="8">
                                    <el-form-item label="评审组织人" label-width="140px" prop="zzr">
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="isEnd?'readonly':'onlySelect'"
                                                              v-model="bizdata.zzr"
                                                              :selectedPersion="zzrList"
                                                              @select-confirm="depts=>zzrList=depts">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="评审组长" label-width="140px" prop="pszz">
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="isEnd?'readonly':'onlySelect'"
                                                              v-model="bizdata.pszz"
                                                              :selectedPersion="pszzList"
                                                              @select-confirm="depts=>pszzList=depts">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="评审小组成员" label-width="140px" prop="xzcy">
                                        <ice-persion-selector chooseItem="multiple"
                                                              :mode="isEnd?'readonly':'onlySelect'"
                                                              v-model="bizdata.xzcy"
                                                              :selectedPersion="xzcyList"
                                                              @select-confirm="depts=>xzcyList=depts">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                        </el-form>
                        <!--计划执行部门-->
                        <el-tabs>
                            <el-tab-pane label="部门负责人">
                                <span slot="label"><i class="hint">*</i> 部门负责人</span>

                                <div class="executeDep">
                                    <ice-query-grid
                                            :gridData="sectPersons"
                                            :columns="columns"
                                            chooseItem="single"
                                            :buttons="flowDataDisabled?[]:buttons"
                                            ref="grid"
                                            :pagination="false"
                                            :operations="flowDataDisabled?[]:operations"
                                            exportTitle="科研项目信息"
                                    >
                                    </ice-query-grid>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                        <!--意见征求范围-->
                        <el-tabs>
                            <el-tab-pane label="选择征求建议人员">
                                <span slot="label"> 选择征求建议人员</span>

                                <div class="opinion">
                                    <ice-query-grid
                                            :gridData="sectPersons1"
                                            :columns="columns"
                                            chooseItem="single"
                                            :buttons="flowDataDisabled?[]:buttons1"
                                            ref="grid"
                                            :pagination="false"
                                            :operations="flowDataDisabled?[]:operations1"
                                            exportTitle="科研项目信息"
                                    >
                                    </ice-query-grid>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                    <el-tab-pane label="附件上传" name="first2">
                        <ATTACHMENT :is-handleer="!flowScope.formReadonly" :data="attaTableData"
                                    ref="attachment"></ATTACHMENT>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </ice-flow-form>
        <!--选择人员  意见征求范围-->
        <PmsSelectPerson
                :checkedCodes="checkedCodes1"
                chooseItem="multiple"
                ref="pmsSelectPerson1"
                @select-emit="selectEmit1"></PmsSelectPerson>

        <!--选择人员  计划执行部门-->
        <PmsSelectPerson
                :checkedCodes="checkedCodes"
                chooseItem="multiple"
                disCode="deptCode"
                ref="pmsSelectPerson"
                @select-emit="selectEmit"></PmsSelectPerson>
    </div>
</template>

<script>
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import PmsSelectTree from '../../../components/common/pms/PmsSelectTree'
    import codeConfigRequest from '../../../utils/codeConfigRequest';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import PmsSelectPerson from "../../../components/common/pms/PmsSelectPerson";
    import moment from 'moment'
    import {ZLJHZT} from '../../../utils/constant'

    export default {
        name: "jhgl_flow",
        mixins: [codeConfigRequest],
        components: {
            ATTACHMENT,
            IceFlowForm,
            IceDialog,
            isLetterAndNumber,
            IceSelect,
            IceGridLayout,
            IceDeptSelector,
            PmsSelectTree,
            IceQueryGrid,
            PmsSelectPerson,
            IcePersionSelector
        },
        created() {
            this.initOidJhlx();
        },
        computed: {
            oid() {
                return this.$route.query.oid;
            },
            treeUrl() {
                return '/pms/FrameAppDataDictionaryType/tree?oidType=' + this.oidJhlx + '&level=2';
            },
            checkedCodes() {
                return this.sectPersons.map(c => {
                    return c.zrrCode;
                })
            },
            checkedCodes1() {
                return this.sectPersons1.map(c => {
                    return c.zrrCode;
                })
            },
        },

        data() {
            return {
                ZLJHZT,
                persionShow: false,
                activeName: 'first',
                persion: "",
                visibleBm: false,
                isHandleer: true,
                attaTableData: [],
                oidJhlx: '',
                bizdata: {
                    jhCode: '',//计划编码
                    jhName: '',//计划名称
                    deptNames: '',//责任单位
                    jhType: '',//计划类型
                    scJhdateStart: '',//计划开始日期
                    endDate: '',//计划完成日期
                    jhTypeName: '',//计划类型名称
                    dataSecretLevcode: '',//密级
                    jhRemark: "",//编制要求
                    xtFjs: [],//附件
                    deptInfoList: [],//关联部门信息
                    deptOids: "",
                    zzr: '',
                    pszz: '',
                    xzcy: '',
                },
                rules: {
                    jhName: [
                        {required: true, message: '计划名称不能为空'}
                    ],
                    jhType: [
                        {required: true, message: '请选择计划类型'}
                    ],
                    startDate: [
                        {required: true, message: '请选择计划开始日期'}
                    ],
                    endDate: [
                        {required: true, message: '请选择计划完成日期'}
                    ],

                    dataSecretLevcode: [
                        {required: true, message: '请选择密级'}
                    ],
                    pszz: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    zzr: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    xzcy: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    abb: [
                        {required: true, message: '计划名称不能为空', trigger: 'change'}
                    ],
                },
                transferTree: {
                    treeData: {
                        // 请求树接口地址
                        api: this.treeUrl,
                        lazy: false,
                        nodeKey: 'code',
                        // 配置字段
                        props: {
                            label: 'name',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {},
                        code: 'code',
                        // 返回解析字段
                        callback: this.getTreeData
                    },

                },
                treeData: {
                    value: '',
                    placeholder: '请选择'
                },
                // 表格配置项
                columns: [
                    {label: "部门编码", code: "depCode", width: 100, sortable: true},
                    {label: "部门名称", code: "depName", width: 100, sortable: true},
                    {label: "负责人编码", code: "zrrCode", width: 100, sortable: true},
                    {label: "负责人姓名", code: "zrr", width: 100, sortable: true},
                ],
                columnsIdea: [
                    {label: "部门编码", code: "depCode", width: 100, sortable: true},
                    {label: "部门名称", code: "depName", width: 100, sortable: true},
                    {label: "人员编码", code: "zrrCode", width: 100, sortable: true},
                    {label: "人员姓名", code: "zrr", width: 100, sortable: true},
                ],
                buttons: [
                    {
                        name: '选择部门',
                        ctrlCode: "BNDRWJH",
                        icon: 'el-icon-circle-plus-outline',
                        type: 'primary',
                        size: 'mini',
                        callback: this.sectDept
                    },
                ],
                buttons1: [
                    {
                        name: '选择部门',
                        ctrlCode: "BNDRWJH",
                        icon: 'el-icon-circle-plus-outline',
                        type: 'primary',
                        size: 'mini',
                        callback: this.sectDept1
                    },
                ],
                operations: [
                    {
                        name: '删除', callback: this.handleDel, ctrlCode: "BCK"
                    },
                ],
                operations1: [
                    {
                        name: '删除', callback: this.handleDel2, ctrlCode: "BCK"
                    },
                ],
                gridData: [],
                sectPersons: [],
                sectPersons1: [],
                flowDataDisabled: false,
                // 组织人
                zzrList: [],
                // 评审组长
                pszzList: [],
                // 小组成员
                xzcyList: [],
                // 是否进入流程
                isFlowIn: false,
                // 是否是最后一个节点
                isEnd: false
            }
        },
        methods: {
            // 日期控制
            pickerOptions(type) {
                if (type == 1) {
                    let end = this.bizdata.endDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else {
                    let start = this.bizdata.startDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                }
            },
            sectDept() {
                this.$refs.pmsSelectPerson.visible = true;
            },
            sectDept1() {
                this.$refs.pmsSelectPerson1.visible = true;
            },
            // 计划执行部门
            selectEmit(data) {
                console.log(data);
                let arr = data.map(c => {
                    return {
                        depCode: c.deptCode,
                        depName: c.deptShortName,
                        zrrCode: c.code,
                        zrr: c.name,
                    }
                })
                // // 找出已经有的数据
                // let sectItem = arr.filter(item => !this.sectPersons.find(o => o.zrrCode == item.zrrCode))

                this.sectPersons = arr;
            },
            // 意见征求范围
            selectEmit1(data) {
                let arr = data.map(c => {
                    return {
                        depCode: c.deptCode,
                        depName: c.deptShortName,
                        zrrCode: c.code,
                        zrr: c.name,
                    }
                })

                this.sectPersons1 = arr;
            },
            // 删除
            handleDel(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let index = this.sectPersons.findIndex(c => {
                        return c.zrrCode == row.zrrCode;
                    })
                    this.sectPersons.splice(index, 1);

                }).catch(err => {
                    console.log("取消删除");
                });
            },
            // 删除
            handleDel2(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    console.log(this.sectPersons1, 'sectPersons1')
                    let index = this.sectPersons1.findIndex(c => {
                        return c.zrrCode == row.zrrCode;
                    })
                    this.sectPersons1.splice(index, 1);
                }).catch(err => {
                    console.log("取消删除");
                });
            },
            getCode() {
                this.loadProjectCode({name: 'jhgl'}).then(res => {
                    this.bizdata.jhCode = res.number;
                })
            },
            async initOidJhlx(appcode) {
                await this.$axios.get("/permission/app_constant/byCode", {
                    params: {
                        appCode: 'PMS',
                        code: 'QIS_JHLX',
                    }
                }).then(resault => {
                    if (resault.data != null) {
                        this.oidJhlx = resault.data.value;
                        console.log('计划类型oid：', this.oidJhlx)
                        //获取计划类型数据字典树结构
                        // this.getTree();
                    } else {
                        this.$message.error("初始化质量计划类型数据字典oid失败！请确保是否配置了QIS_JHLX常量！")
                    }
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            getTreeData(data) {
                this.bizdata.docTypeName = data.name
                // console.log(data)
                // console.log(this.bizdata.jhType)
                // console.log(this.bizdata.jhTypeName)
            },
            getTree() {
                this.$axios.get('/pms/FrameAppDataDictionaryType/tree', {params: {oidType: this.oidJhlx}})
                    .then(res => {
                        console.log(res.data)
                    }).catch(error => {
                    this.$message.error("获取计划类型数据字典树结构信息失败！")
                }).finally(_ => {

                });
            },
            alterationAssign(flowContext, bizdata) {

            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                // console.log(this.$refs.flowForm.flowInstData)
                console.log(bizdata, flowContext, 'biz')
                this.isEnd = flowContext.nodeId == "EndEvent" ? true : false;
                this.flowDataDisabled = flowContext.getFormReadonly();
                let flowData = this.$refs.flowForm.flowInstData;
                this.isFlowIn = flowContext.nodeId == "FirstNode" ? false : true;
                let bizData;
                if (!bizdata.oid) {
                    this.getCode();
                }
                // if (flowData.proOperates != null) {
                //     bizData = JSON.parse(flowData.currentBizData.bizData);
                //     this.bizdata = bizdata
                //     this.attaTableData = bizdata.xtFjs;
                //     console.log("流程中获取数据")
                // } else {
                //     this.get(this.oid)
                // }
                if (bizdata.oid) {
                    this.handleCallbackFlow(bizdata);
                    return;
                }

                Object.assign(this.bizdata, bizdata);
                //驳回才能编辑
                // this.editable(flowData.proOperates);
            },
            async flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件

                if (this.sectPersons.length <= 0) {
                    this.$message.error("计划执行部门必选，请选择计划执行部门！");
                    return false;
                }
                return await this.$refs.form.validate();
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                this.bizdata.xtFjs = this.$refs.attachment.getVisibleDataAndDelData();
                // 合并评审人员
                this.zzrList.map(c => {
                    c.reviewGroup = 1;
                })
                this.pszzList.map(c => {
                    c.reviewGroup = 0;
                })
                this.xzcyList.map(c => {
                    c.reviewGroup = 2;
                })
                let arr = [...this.zzrList, ...this.pszzList, ...this.xzcyList];
                console.log(arr, 'arr')
                this.bizdata.reviewDeptInfoList = arr.map(c => {
                    return {
                        depCode: c.deptCode,
                        depName: c.deptShortName,
                        zrrCode: c.code,
                        zrr: c.name,
                        reviewGroup: c.reviewGroup,
                    }
                })
                this.sectPersons.map(c => {
                    c.dataSecretLevcode = this.bizdata.dataSecretLevcode;
                })
                this.sectPersons1.map(c => {
                    c.dataSecretLevcode = this.bizdata.dataSecretLevcode;
                })
                this.bizdata.executorDeptInfoList = this.sectPersons;
                this.bizdata.optionDeptInfoList = this.sectPersons1;
                console.log(this.bizdata, 'bizdata')
                return this.bizdata;
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                this.bizdata = data;
                this.attaTableData = this.bizdata.xtFjs;
                this.sectPersons = this.bizdata.executorDeptInfoList;
                this.sectPersons1 = this.bizdata.optionDeptInfoList;
                if (this.bizdata.reviewDeptInfoList) {
                    this.reviewerEval(this.bizdata.reviewDeptInfoList);
                }
            },
            // 评审人员获取赋值
            reviewerEval(data) {
                let arr = data.map(c => {
                    return {
                        deptCode: c.depCode,
                        deptShortName: c.depName,
                        code: c.zrrCode,
                        name: c.zrr,
                        reviewGroup: c.reviewGroup,
                        oid: c.oid
                    }
                })
                this.zzrList = arr.filter(c => {
                    return c.reviewGroup == 1;
                })
                this.pszzList = arr.filter(c => {
                    return c.reviewGroup == 0;
                })
                this.xzcyList = arr.filter(c => {
                    return c.reviewGroup == 2;
                })
                let a = JSON.parse(JSON.stringify(this.zzrList));
                let b = JSON.parse(JSON.stringify(this.pszzList));
                let c = JSON.parse(JSON.stringify(this.xzcyList));
                if (a&&a.length<=0) {
                    return;
                }
                // return;
                let zzr = "";
                let pszz = "";
                let xzcy = "";
                if (a && a.length > 0) {
                    zzr = a.map(p => {
                        return p.name;
                    }).join(",");
                } else {
                    return
                }
                if (b && b.length > 0) {
                    pszz = b.map(p => {
                        return p.name;
                    }).join(",");
                }
                if (c && c.length > 0) {
                    xzcy = c.map(p => {
                        return p.name;
                    }).join(",")
                }
                this.bizdata.zzr = zzr;
                this.bizdata.pszz = pszz;
                this.bizdata.xzcy = xzcy;
            },
            get(oid) {
                // console.log(oid)
                if (oid) {
                    this.$axios.get("/pms/QisJhgl/get", {params: {id: oid}})
                        .then(result => {
                            this.bizdata = result.data;
                            this.getFjData(oid)
                        })
                        .catch(error => {
                            this.$message.error("获取数据失败！")
                        })
                }
            },
            getFjData(oid) {
                this.bizdata.xtFjs = [];
                this.$axios.get('/pms/XtFj/listByBoid', {params: {boid: oid}})
                    .then(result => {
                        if (result.data.length != 0) {
                            this.attaTableData = result.data;
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取附件失败！");
                    })
            },
            deptHandler(datas) {
                console.log(datas);
                this.bizdata.deptInfoList = datas;
                let codes = datas.map(c => {
                    return c.deptCode
                });
                this.bizdata.deptOids = codes.join(',');
            }
        },
        watch: {
            attaTableData() {
                console.log("监听附件数据源变化")
                this.bizdata.xtFjs = this.attaTableData;
                // console.log(this.bizdata)
            },

            oidJhlx() {
                this.transferTree.treeData.api = '/pms/FrameAppDataDictionaryType/tree?oidType=' + this.oidJhlx + '&level=2';
            },
            'bizdata'() {

                console.log(this.bizdata.zrr, 'fdsafa');
            }

        },
    }
</script>

<style scoped>
    .hint {
        color: #f30213;
        font-size: 14px;
    }
</style>
