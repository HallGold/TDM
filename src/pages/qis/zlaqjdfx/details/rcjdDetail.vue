<template>
    <div>
        <ice-dialog title="日常监督详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="formModel.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="基础信息" name="first">
                    <el-form :model="formModel" status-icon ref="definition" label-width="140px">
                        <ice-grid-layout :columns="2" name="业务表单">
                            <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                                <el-input disabled v-model="formModel.zljhCode" placeholder="请选择">

                                </el-input>
                            </el-form-item>
                            <el-form-item label="编辑部门" label-width="140px" prop="oidDepRel">
                                <el-input disabled v-model="formModel.depRelName" maxlength="16"
                                          placeholder="请选择"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="编号" prop="code">
                                <el-input v-model="formModel.code" placeholder="自动生成" readonly="readonly"></el-input>
                            </el-form-item>
                            <el-form-item label="被检单位" prop="bjdw">
                                <ice-dept-selector chooseItem="single" :mode="formReadonly?'readonly':'onlySelect'" v-model="formModel.bjdw"
                                                   :disabled="formReadonly"></ice-dept-selector>
                            </el-form-item>
                            <el-form-item label="被检项目" prop="xmname">
                                <el-input v-model="formModel.xmname" readonly="readonly"  :disabled="formReadonly"></el-input>
                            </el-form-item>
                            <el-form-item label="密级" prop="dataSecretLevcode">
                                <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                            autocomplete="off" :disabled="formReadonly"></ice-select>
                            </el-form-item>
                            <el-form-item label="检查时间" prop="jcsj">
                                <el-date-picker v-model="formModel.jcsj" :disabled="formReadonly"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="监督检查人" prop="jcr">
                                <ice-persion-selector :mode="formReadonly?'readonly':'onlySelect'" chooseItem="single"
                                                      v-model="formModel.jcr"
                                                      :disabled="formReadonly"></ice-persion-selector>
                            </el-form-item>
                        </ice-grid-layout>
                        <ice-grid-layout :columns="1">
                            <el-form-item label="检查依据" prop="jcyj">
                                <el-input type="textarea" v-model="formModel.jcyj" placeholder="不超过650个字" maxlength="650"
                                          show-word-limit autocomplete="off" :disabled="formReadonly"></el-input>
                            </el-form-item>
                        </ice-grid-layout>
                        <ice-grid-layout :columns="1" name="关联数据">
                            <el-tabs v-model="activeName">
                                <el-tab-pane label="检查信息" name="first">
                                    <vxe-table border show-overflow
                                               ref="infoTable"
                                               max-height="200"
                                               :edit-config="{trigger: 'click', mode: 'row'}"
                                               :data="infoTableData">
                                        <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                        <vxe-table-column field="jcnr" title="检查内容" width="200"
                                                          :edit-render="{name: 'input'}"></vxe-table-column>
                                        <vxe-table-column field="jcjg" title="检查结果" width="200"
                                                          :edit-render="{name: 'input'}"></vxe-table-column>
                                        <vxe-table-column field="czwt" title="存在问题" width="200"
                                                          :edit-render="{name: 'input'}"></vxe-table-column>
                                        <vxe-table-column field="dateRemark" title="备注" width="200"
                                                          :edit-render="{name: 'input'}"></vxe-table-column>
                                        <vxe-table-column title="操作" width="120">
                                            <template v-slot="{ row }">
                                                <el-button type="text" @click="deleteRow(row)" v-show="!formReadonly">删除
                                                </el-button>
                                                <el-button type="text" @click="viewChange(row)" v-show="row.oid != null">
                                                    查看整改
                                                </el-button>
                                            </template>
                                        </vxe-table-column>
                                    </vxe-table>
                                </el-tab-pane>
                            </el-tabs>
                        </ice-grid-layout>
                    </el-form>

                </el-tab-pane>
            </el-tabs>
            <div class="ice-button-bar">
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="整改监督" :visible.sync="visibleReform" width="800px">
            <el-form :model="formModelReform" ref="reform" v-loading="loading">
                <el-row>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="基本信息" name="first">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="编号" label-width="100px">
                                        <el-input v-model="formModel.code" placeholder="自动生成"
                                                  readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="项目名称" label-width="100px">
                                        <el-input v-model="formModel.xmname" readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="监督检查人" label-width="100px">
                                        <el-input v-model="formModel.jcr" readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="检查时间" label-width="100px">
                                        <el-date-picker v-model="formModel.jcsj" readonly="readonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="检查依据" label-width="100px">
                                        <el-input type="textarea" v-model="formModel.jcyj"
                                                  readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="问题整改" name="first">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="主送" label-width="100px" prop="zsr">
                                        <ice-persion-selector :mode="isLook?'readonly':'onlySelect'" chooseItem="single"
                                                              v-model="formModelReform.zsr"></ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="抄送" label-width="100px" prop="csr">
                                        <ice-persion-selector :mode="isLook?'readonly':'onlySelect'" chooseItem="single"
                                                              v-model="formModelReform.csr"></ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                        <ice-select  :disabled="isLook"
                                                    v-model="formModelReform.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="整改期限" label-width="100px" prop="zgqx">
                                        <el-date-picker :disabled="isLook"
                                                        v-model="formModelReform.zgqx"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="存在问题" label-width="100px" prop="czwt">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.czwt"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="整改要求" label-width="100px" prop="zgyq">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zgyq"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="责任人处理情况" label-width="100px" prop="zrrclqk">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zrrclqk"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="整改情况小结" label-width="100px" prop="zgqkxj">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zgqkxj"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="监督检查负责人确认意见" label-width="100px" prop="jcryj">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.jcryj"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否完成整改" label-width="100px" prop="isWc">
                                        <!--<ice-select v-model="formModelReform.isWc" :options="options"></ice-select>-->
                                        <el-select :disabled="isLook" v-model="formModelReform.isWc" placeholder="请选择">
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirmData()">确认</el-button>
                <el-button type="info" @click="visibleReform=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";

    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../../pms/common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT} from "../../../../utils/constant";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";



    export default {
        name: "rcjdDetail",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsInput,
            IceDeptSelector,
            IcePersionSelector,
            IceGridLayout
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
                activeName: "first",
                loading: false,
                formModel: {},
                formReadonly: true,
                visible: false,
                previd: "",
                infoTableData: [],
                formModelReform: {},
                visibleReform: false,
                isLook: false,
                options: [
                    {value: '1', label: '是'},
                    {value: '0', label: '否'}
                ],
            }
        },
        methods: {
            toFlow1 () {
                this.visible = false;
                this.toFlow(this.formModel);
            },
            // 获取详情
            getDetail(oid) {
                if (oid && this.previd != oid) {
                    this.previd = oid;
                    this.$axios.get("/pms/QisRczxjd/get", {params: {id: oid}})
                        .then(result => {
                            this.formModel = {...result.data}
                            this.getInfoData(this.formModel.oid)
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


            },
            getInfoData(oidRczxjc) {
                this.$axios.get("/pms/QisRczxjdInfo/listByOidRczxjd", {params: {oidRczxjc: oidRczxjc}})
                    .then(result => {
                        this.infoTableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取检查信息数据失败！")
                    })
            },
            // 查看整改
            viewChange(row) {
                this.getByOidJcinfo(row.oid);
                this.visibleReform = true;
                this.isLook = true;
            },
            getByOidJcinfo(oidJcinfo) {
                this.$axios.get("/pms/QisRczxjdWtzg/getByOidJcinfo", {params: {oidJcinfo: oidJcinfo}})
                    .then(result => {
                        this.formModelReform = {...result.data};
                    })
                    .catch(error => {
                        this.$message.error("获取问题整改数据失败！")
                    })
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
</style>