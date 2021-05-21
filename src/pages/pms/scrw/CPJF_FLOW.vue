<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="width: 90%;margin: 0 auto;padding: 10px 20px;border: 1px solid #ddd;" slot-scope="flowScope">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="交付基本信息" name="first">
                        <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交付计划号" label-width="140px" prop="jfjhCode">
                                        <el-input maxlength="16" v-model="formModel.jfjhCode" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="质量文件" label-width="140px" prop="zlwj">
                                        <el-input maxlength="330" v-model="formModel.zlwj" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第二行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="交付时间" label-width="140px" prop="cpjfDate">
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
                                    <el-form-item label="交付地点" label-width="140px" prop="cpjfPlace">
                                        <el-input maxlength="33" v-model="formModel.cpjfPlace" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第三行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="联系人" label-width="140px" prop="contacts">
                                        <el-input maxlength=650 v-model="formModel.contacts" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="车辆" label-width="140px" prop="cars">
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
                                                    :controlMjPar="maxChildMj"
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
                    </el-tab-pane>
                    <el-tab-pane label="交付产品" name="second">
                        <ice-query-grid
                                :gridData="formModel.pmsJfjhCpVoList"
                                exportTitle="选择产品"
                                :operations-width="120"
                                :columns="product.columns"
                                :operations="flowScope.formReadonly?[]:product.operations"
                                :buttons="flowScope.formReadonly?[]:product.buttons"
                                :pagination=false
                                ref="grid2">
                        </ice-query-grid>
                    </el-tab-pane>
                    <!--点击编辑打开项目输入-->
                    <el-tab-pane label="附件" name="xmsr">
                        <ATTACHMENT :controlMj="formModel.dataSecretLevcode?[formModel.dataSecretLevcode]:[]" @change="changeFjSr" :isHandleer="!flowScope.formReadonly" :data="xtFj" ref="FJ"></ATTACHMENT>
                    </el-tab-pane>
                </el-tabs>

            </div>
        </ice-flow-form>
        <!--选择产品-->
        <ice-dialog title="选择产品" :visible.sync="productVisible" width="1200px">
            <el-row>
                <el-col :span="5">
                    <div style="height: 400px;position: relative;">
                        <ice-tree load-url="/pms/Xminfo/listYearForJfjh"
                                  label-prop="cpname"
                                  value-prop="cpname"
                                  class="tree"
                                  treeWidth="auto"
                                  @node-click="orgNodeClick"
                                  :lazy="true"
                                  :cus-tree="true"
                                  ref="iceTree"
                        >
                        </ice-tree>
                    </div>

                </el-col>
                <el-col :span="13">
                    <ice-query-grid
                            :data-url="dataUrl"
                            exportTitle="选择产品"
                            :operations-width="120"
                            :columns="product.columns"
                            codeProp="oid"
                            :query="product.querys"
                            :selectedCodes="selectedCodes"
                            chooseItem="multiple"

                            @selection-change="handleSectedProduct"
                            ref="grid2">
                    </ice-query-grid>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card" style="height: 400px;">
                        <div slot="header" class="clearfix">
                            <span>选中的产品</span>
                        </div>
                        <div style="height: 300px; overflow: auto;">
                            <div class="taglist" v-for="(item, index) in sectProduct">
                                <el-tag
                                        closable
                                        @close="handleCloseTag(item, index)"
                                        effect="dark">
                                    {{item.productCode}}
                                </el-tag>
                            </div>

                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleSectContract">确认</el-button>
                <el-button type="info" @click="productVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceTree from "@/components/common/base/IceTree";
    import ATTACHMENT from "../common/ATTACHMENT";

    export default {
        name: "CPJF_FLOW",
        components: {
            IceFlowForm,
            IceQueryGrid,
            IceTree,
            ATTACHMENT
        },
        data() {
            return {
                // 产品选择
                productVisible: false,
                sectProduct: [],
                selectedCodes: [],
                activeName: 'first',
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    cpjfDate: '',//交付时间
                    zlwj: '',//质量文件
                    jfjhCode: '',//交付计划好号
                    cpjfPlace: '',//产品交付地点
                    contacts: '',//联系人
                    cars: '',//车辆
                    explain: '',//补充说明
                    deleteStatus: 0,//删除状态
                    dataSecretLevcode: '',//密级
                    jfjhCpNum: '',//交付产品数量
                    jfcpCodeAndName: '',//交付产品编码名称
                    oidsJfcp: '',//选择的交付产品oids
                    xtFjs: [],//协同附件
                    oid: '',
                    pmsJfjhCpVoList: []
                },
                rules: {
                    dataSecretLevcode: [{required: true, message: '密级', trigger: 'blur'}],
                },
                loading: false,
                disabled: false,
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
                        {label: "完成时间", code: "createDate", width: 100},
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
                        {type: 'static', code: 'oidCpk', value: '0'},
                        {type: 'input', code: 'productCode',label: "在制品编号", value: ''},
                        {type: 'input', code: 'productName',label: "在制品名称", value: ''},
                    ],
                    operations: [
                        {
                            name: '删除', callback: this.deleteNode, ctrlCode: "BSC"
                        },
                    ],

                },
                dataUrl: '/pms/PmsJfjhCp/listByCpCode',
                xtFj: [],
                changeFjSrdata:[]
            }
        },
        computed: {
            // 控制项目密级
            maxChildMj() {
                // 获取密级集合
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })
                return [...arr2];
            },
        },
        methods: {
            // 项目输入变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'bizdata', flowContext)
                if (bizdata.oid) {
                    this.assignment(bizdata);
                }
            },
            async flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log(123)
                return await this.$refs.form.validate();
            },
            assignment(data) {
                this.formModel = data;
                this.sectProduct = this.formModel.pmsJfjhCpVoList;
                this.xtFj = this.formModel.xtFjs;
                this.changeFjSrdata = this.xtFj;
            },
            flowBizData() {
                if (this.sectProduct.length <= 0) {
                    this.$message.error('还未选择交付产品！');
                    return;
                }
                this.formModel.oidsJfcp = this.sectProduct.map(c => {
                    return c.oid
                })
                let fj = this.$refs.FJ.getVisibleDataAndDelData();
                this.formModel.oidsJfcp = this.formModel.oidsJfcp.join(',');
                this.formModel.pmsJfjhCpVoList = this.sectProduct;
                this.formModel.xtFjs = fj;

                return this.formModel;
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                this.assignment(data);
            },
            handleClick() {

            },
            // 选择产品回调
            handleSectedProduct(data, removerows) {
                if (removerows && removerows.length > 0) {
                    this.sectProduct = this.sectProduct.filter(item => !removerows.find(rm => rm.oid == item.oid))
                } else {
                    let sectItem = data.filter(item => !this.sectProduct.find(o => o.oid == item.oid))
                    this.sectProduct = [...this.sectProduct, ...sectItem]
                }
            },
            // 选择产品确定
            handleSectContract() {
                this.formModel.pmsJfjhCpVoList = this.sectProduct;
                this.productVisible = false;
            },
            addproduct() {
                this.productVisible = true;
                this.sectProduct = this.formModel.pmsJfjhCpVoList;
                this.selectedCodes = this.sectProduct.map((c) => {
                    return c.oid
                })
                this.$nextTick(_ => {
                    this.$refs.grid2.reDoSelection();
                })
            },
            // 移除选中的产品
            handleCloseTag(data, index) {
                this.$refs.grid2.closeSelection(data.oid);
                this.sectProduct.splice(index, 1)
            },
            //   点击树
            orgNodeClick(data, node) {
                console.log(node, 'data');
                if (node.level==3) {
                    this.product.querys[0].value = node.data.cpid;
                    if (!this.sectProduct) {
                        return
                    }
                    this.selectedCodes = this.sectProduct.map((c) => {
                        return c.oid
                    })
                    this.$nextTick(_ => {
                        this.$refs.grid2.reDoSelection();
                        this.$refs.grid2.refresh();
                    })
                }

            },
            // 删除
            deleteNode(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(123, this.sectProduct, row)
                    this.formModel.pmsJfjhCpVoList = this.sectProduct.filter(c => {
                        c.oid != row.oid
                    })
                    console.log(this.sectProduct)
                }).catch(() => {
                    console.log('取消成功')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .tree {
        height: 400px;
    }

    .taglist {
        margin-bottom: 5px;
    }
</style>
