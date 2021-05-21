<template>
    <div style="position: relative;">
        <ice-dialog title="参试记录详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="formModel.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1(formModel)">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="交付基本信息" name="first">
                    <div class="item">
                        <el-form :model="formModel" ref="form" v-loading="loading">
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="试验参试任务名称" label-width="140px" prop="sycsName">
                                        <el-input placeholder="请输入" :disabled="flowScope.formReadonly" v-model="formModel.sycsName">

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="所属项目" label-width="140px" prop="xmName">
                                        <el-input placeholder="请选择项目" v-model="formModel.xmName" readonly :disabled="flowScope.formReadonly">
                                            <el-button  :disabled="flowScope.formReadonly" slot="append"
                                                        icon="el-icon-search"
                                                        ></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="参试任务编号" label-width="140px" prop="sycsCode">
                                        <el-input maxlength="330" v-model="formModel.sycsCode" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="责任人" label-width="140px" prop="zrdwName">
                                        <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                              chooseItem="single"
                                                              @select-confirm="persion=>{formModel.zrrCode = persion[0].code}"
                                                              v-model="formModel.zrr">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="项目主管" label-width="140px" prop="xmzgName">
                                        <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                              chooseItem="single"
                                                              @select-confirm="persion=>{selectConfirm(persion)}"
                                                              v-model="formModel.xmzgName">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="xmzgTell">
                                        <el-input :disabled="flowScope.formReadonly" placeholder="请输入" v-model="formModel.xmzgTell">
                                            <template slot="prepend"><i class="el-icon-phone" style="font-size: 18px;"></i></template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="试验单位联系人" label-width="140px" prop="sydwryName">
                                        <el-input :disabled="flowScope.formReadonly" placeholder="请输入内容" v-model="formModel.sydwryName">
                                            <template slot="prepend"><i class="el-icon-user-solid" style="font-size: 18px;"></i></template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="sydwryTell">
                                        <el-input :disabled="flowScope.formReadonly" placeholder="请输入内容" v-model="formModel.sydwryTell">
                                            <template slot="prepend"><i class="el-icon-phone" style="font-size: 18px;"></i></template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第二行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交付时间" label-width="140px" prop="jfDate">
                                        <el-date-picker v-model="formModel.jfDate" type="date" placeholder="请选择"
                                                        :disabled="flowScope.formReadonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="交付地点" label-width="140px" prop="jfPlace">
                                        <el-input maxlength="33" v-model="formModel.jfPlace" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <!--第二行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="参试时间" label-width="140px" prop="syDate">
                                        <el-date-picker v-model="formModel.syDate" type="date" placeholder="请选择"
                                                        :disabled="flowScope.formReadonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="参试地点" label-width="140px" prop="syPlace">
                                        <el-input maxlength="33" v-model="formModel.syPlace" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <!--第三行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交付类型" label-width="140px" prop="cslx">
                                        <el-input maxlength=650 v-model="formModel.cslx" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="车辆安排" label-width="140px" prop="dataSecretLevcode">
                                        <el-input maxlength=650 v-model="formModel.vehicleArrangement" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第四行-->
                            <el-row :gutter="20">

                            </el-row>
                            <!--第四行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="备注" label-width="140px" prop="dateRemark">
                                        <el-input v-model="formModel.dateRemark" placeholder="不超过650个字" maxlength="650"
                                                  show-word-limit type="textarea" :rows="2"
                                                  :disabled="flowScope.formReadonly">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="交付产品" name="second">
                    <div class="item">
                        <ice-query-grid
                                :gridData="formModel.pmsSycsCpVoList"
                                exportTitle="选择产品"
                                :operations-width="120"
                                parHeight="400"
                                min-height="400"
                                :columns="product.columns"
                                :pagination=false
                                ref="grid2">
                        </ice-query-grid>
                    </div>

                </el-tab-pane>
                <!--点击编辑打开项目输入-->
                <el-tab-pane label="附件" name="xmsr">
                    <div class="item">
                        <ATTACHMENT Height="400px" :controlMj="formModel.dataSecretLevcode?[formModel.dataSecretLevcode]:[]"
                                    :isHandleer="!flowScope.formReadonly" :data="formModel.xtFjs?formModel.xtFjs:[]" ref="FJ"></ATTACHMENT>
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
    import ATTACHMENT from "../common/ATTACHMENT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import { SPZT} from "../../../utils/constant"


    export default {
        name: "CpjhModel",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            IcePersionSelector,

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
                xtFj: [],
                activeName: "first",
                loading: false,
                formModel: {},
                flowScope: {
                    formReadonly: true
                },
                visible: false,
                product: {
                    columns: [
                        {label: "oid", code: "oid", width: 100, hidden: true},
                        // {label: "工单ID", code: "workOrderId", width: 100, hidden: true},
                        {label: "在制品编号", code: "productCode", width: 220},
                        {label: "在制品名称", code: "productName", width: 100},
                        // {label: "质量卡编码", code: "qualityCardCode", width: 100},
                        // {label: "交接位置", code: "connectLocation", width: 100},
                        // {label: "最新位置", code: "newestLocation", width: 100},
                        // {label: "交接时间", code: "connectTime", width: 100},
                        // {label: "发生部门", code: "happenDept", width: 100},
                        // {label: "上一级产品ID", code: "parentId", width: 100},
                        {label: "完成时间", code: "completionTime", width: 100},
                        // {label: "操作人", code: "operator", width: 100},
                        // {label: "交付计划ID", code: "jfjhId", width: 100},
                        {label: "产品编号", code: "cpCode", width: 100},
                        {label: "产品单位", code: "cpUnit", width: 100},
                    ],
                    buttons: [
                        //{name: '添加合同', icon: 'el-icon-plus', type: 'primary', callback: this.handleAddContract, hidden: this.isCheck},
                        {name: '选择产品', icon: 'el-icon-thumb', type: 'success', callback: this.addproduct},
                    ],
                    //定义行的编辑,项目结转
                    querys: [
                        {type: 'static', code: 'cpCode', value: '0'},
                    ],
                    operations: [
                        {
                            name: '删除', callback: this.deleteNode, ctrlCode: "BSC"
                        },
                    ],

                },
                jhid: ""
            }
        },
        methods: {
            toFlow1 () {
                this.visible = false;
                this.toFlow(this.formModel);
            },
            // 获取详情
            getDetail(oid) {
                if (oid && this.jhid != oid) {
                    this.loading = false;
                    this.$axios.get("/pms/PmsSycs/sycsInfoByOid", {params: {id: oid}})
                        .then(result => {
                            this.$nextTick(_ => {
                                // this.$refs.form.resetFields();
                                this.formModel = {...result.data};
                                this.visible = true;
                            })
                        })
                        .catch(error => {
                            this.$message.error("获取详细信息失败！")
                        }).finally(() => {
                        this.loading = false;
                    })
                } else {
                    this.visible = true;
                }


            },
            // tab 标签页点击
            handleClick() {

            }
        }
    }
</script>

<style scoped>
    .item {
        height: 450px;
    }
    .toFlow {
        position: absolute;
        top: 5px;
        right: 10px;
        z-index: 10000;
    }
</style>
