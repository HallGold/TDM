<template>
    <div>
        <ice-dialog title="质量计划详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card">

                <el-tab-pane label="计划信息" name="first">
                    <div class="item">
                        <el-form :model="bizdata" status-icon ref="form">
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
                                    v-if="bizdata.jhType==ZLJHZT.GLPS||bizdata.jhType==ZLJHZT.WJBZXD">
                                <el-col :span="8">
                                    <el-form-item label="评审组织人" label-width="140px" prop="zzr" >
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                              v-model="bizdata.zzr"
                                                              @select-confirm="depts=>zzrList=depts">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="评审组长" label-width="140px" prop="pszz">
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                              v-model="bizdata.pszz"
                                                              @select-confirm="depts=>pszzList=depts">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="评审小组成员" label-width="140px" prop="xzcy">
                                        <ice-persion-selector chooseItem="multiple"
                                                              :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                              v-model="bizdata.xzcy"
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
                                        :buttons="flowScope.formReadonly?[]:buttons"
                                        ref="grid"
                                        :pagination="false"
                                        :operations="flowScope.formReadonly?[]:operations"
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
                                        :buttons="flowScope.formReadonly?[]:buttons1"
                                        ref="grid"
                                        :pagination="false"
                                        :operations="flowScope.formReadonly?[]:operations1"
                                        exportTitle="科研项目信息"
                                >
                                </ice-query-grid>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    </div>

                </el-tab-pane>

                <el-tab-pane label="附件上传" name="first2">
                    <div class="item">
                        <ATTACHMENT :is-handleer="!flowScope.formReadonly" :data="attaTableData"
                                    ref="attachment"></ATTACHMENT>
                    </div>

                </el-tab-pane>
            </el-tabs>

            <div class="ice-button-bar">
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>

    </div>
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT, ZLJHZT} from "../../../utils/constant";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";



    export default {
        name: "jhDetail",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsInput,
            IceDeptSelector,
            IcePersionSelector
        },
        props: {
            jhjhId: {
                default: ""
            },
            toFlow: {
                type: Function,
            }
        },
        data() {
            return {
                SPZT,
                ZLJHZT,
                activeName: "first",
                loading: false,
                bizdata: {},
                flowScope: {
                    formReadonly: true
                },
                visible: false,
                previd: "",
                sectPersons: [],
                sectPersons1: [],
                // 表格配置项
                columns: [
                    {label: "部门编码", code: "depCode", width: 100, sortable: true},
                    {label: "部门名称", code: "depName", width: 100, sortable: true},
                    {label: "负责人编码", code: "zrrCode", width: 100, sortable: true},
                    {label: "负责人姓名", code: "zrr", width: 100, sortable: true},
                ],
                attaTableData: []
            }
        },
        methods: {
            toFlow1 () {
                this.visible = false;
                this.toFlow(this.bizdata);
            },
            // 获取详情
            getDetail(oid) {
                if (oid && this.previd != oid) {
                    this.previd = oid;
                    this.$axios.get("/pms/QisJhgl/infoByOid", {params: {oid: oid}})
                        .then(result => {
                            this.handleCallbackFlow(result.data);
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


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
                this.bizdata.zzr = this.zzrList.map(c => {
                    return c.name;
                }).join(",");
                this.bizdata.pszz = this.pszzList.map(c => {
                    return c.name;
                }).join(",");
                this.bizdata.xzcy = this.xzcyList.map(c => {
                    return c.name;
                }).join(",")
            },
            // tab 标签页点击
            handleClick() {

            }
        }
    }
</script>

<style scoped>
    .item {
        height: 500px;
    }
    .toFlow {
        position: absolute;
        top: 5px;
        right: 10px;
        z-index: 10000;
    }
    .item {
        height: 500px;
        overflow: auto;
    }
</style>