<template>
    <div>
        <ice-dialog title="交付计划详情" :visible.sync="visible" width="1200px">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="交付基本信息" name="first">
                    <div class="item">
                        <el-form :model="formModel" ref="form" v-loading="loading">
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交付计划号" label-width="140px" prop="yhCode">
                                        <el-input maxlength="16" v-model="formModel.jfjhCode" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="质量文件" label-width="140px" prop="jcxs">
                                        <el-input maxlength="330" v-model="formModel.zlwj" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第二行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交付时间" label-width="140px" prop="zrdwName">
                                        <el-date-picker
                                                v-model="formModel.cpjfDate"
                                                type="datetime"
                                                :disabled="flowScope.formReadonly"
                                                placeholder="选择日期时间"
                                                default-time="9:00:00">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="交付地点" label-width="140px" prop="yhwz">
                                        <el-input maxlength="33" v-model="formModel.cpjfPlace" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第三行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="联系人" label-width="140px" prop="jcsj">
                                        <el-input maxlength=650 v-model="formModel.contacts" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="车辆" label-width="140px" prop="dataSecretLevcode">
                                        <el-input maxlength=650 v-model="formModel.cars" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第四行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第四行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="补充说明" label-width="140px" prop="yhms">
                                        <el-input v-model="formModel.explain" placeholder="不超过650个字" maxlength="650"
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
                                :gridData="formModel.pmsJfjhCpVoList"
                                exportTitle="选择产品"
                                :operations-width="120"
                                parHeight="260"
                                min-height="160"
                                :columns="product.columns"
                                :pagination=false
                                ref="grid2">
                        </ice-query-grid>
                    </div>

                </el-tab-pane>
                <!--点击编辑打开项目输入-->
                <el-tab-pane label="附件" name="xmsr">
                    <div class="item">
                        <ATTACHMENT Height="260px" :controlMj="formModel.dataSecretLevcode?[formModel.dataSecretLevcode]:[]"
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
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../common/ATTACHMENT";

    export default {
        name: "CpjhModel",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT
        },
        props: {
            jhjhId: {
                default: ""
            },
        },
        data() {
            return {
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
            // 获取详情
            getDetail(oid) {
                if (oid && this.jhid != oid) {
                    this.loading = false;
                    this.$axios.get("/pms/PmsJfjh/jfjhInfoByOid", {params: {id: oid}})
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
        height: 300px;
    }
</style>