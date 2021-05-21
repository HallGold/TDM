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
                                                       @click="showProjectDialog"></el-button>
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
                                                    :controlMjPar="maxChildMj"
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
                                    <el-form-item label="车辆安排" label-width="140px" prop="cars">
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
                    </el-tab-pane>
                    <el-tab-pane label="交付产品" name="second">
                        <ice-query-grid
                                :gridData="formModel.pmsSycsCpVoList?formModel.pmsSycsCpVoList:[]"
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
                                    {{item.productName}}
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
        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @select="selectProject" @closeVisible="closeProject"
                       choose-item="single"></XM_SELECT>
        </ice-dialog>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceTree from "@/components/common/base/IceTree";
    import ATTACHMENT from "../common/ATTACHMENT";
    import XM_SELECT from "../common/XM_SELECT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import {validatePassTel} from '../../../utils/validator'
    export default {
        name: "CPJF_FLOW",
        components: {
            IceFlowForm,
            IceQueryGrid,
            IceTree,
            ATTACHMENT,
            XM_SELECT,
            IcePersionSelector
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
                    sycsName: "",
                    oid: '',
                    pmsSycsCpVoList: [],

                    oidsJfcp: '',//选择的交付产品oids
                    xtFjs: [],//协同附件
                    xmCode: "", // 项目编号
                    xmName: "", // 项目名称
                    sycsCode: "", // 试验编号
                    xmDeptCode: "", // 项目主管部门编号
                    xmDeptName: "", // 项目主管部门名称
                    xmzgCode: "", // 项目主管编号
                    xmzgName: "", // 项目主管名称
                    xmzgTell: "", // 项目主管电话
                    sydwryName: "", // 试验现场单位人员姓名
                    sydwryTell: "", // 现场单位人员电话
                    jfDate: "", // 交付日期
                    jfPlace: "", // 交付地点
                    syDate: "", // 试验日期
                    syPlace: "", // 试验地点
                    cslx: "", // 产品试验类型
                    dateRemark: "", // 备注
                    dataSecretLevcode: "",
                    zrr: "", // zrr
                    zrrCode: "", // 责任人编码
                    vehicleArrangement: ""// 车辆
                },
                rules: {
                    sydwryTell: [{ validator: validatePassTel, trigger: 'blur' }],
                    xmzgTell: [{ validator: validatePassTel, trigger: 'blur' }],
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
                        {label: "技术要求", code: "technicalRequirement", width: 100},
                        {label: "产品数量", code: "cpsl", width: 100},
                        {label: "产品单位", code: "cpUnit", width: 100},
                        {label: "产品密级", code: "dataSecretLevcode", width: 100, mapTypeCode: "DATA_SECRET_LEVEL"},
                        {label: "合格证", code: "certificate", width: 100},
                        {label: "目前位置", code: "location", width: 100},
                        {label: "备注", code: "dateRemark", width: 100},
                        // {label: "质量卡编码", code: "qualityCardCode", width: 100},
                        // {label: "交接位置", code: "connectLocation", width: 100},
                        // {label: "最新位置", code: "newestLocation", width: 100},
                        // {label: "交接时间", code: "connectTime", width: 100},
                        // {label: "发生部门", code: "happenDept", width: 100},
                        // {label: "上一级产品ID", code: "parentId", width: 100},
                        {label: "完成时间", code: "completionTime", width: 100, hidden: true},
                        // {label: "操作人", code: "operator", width: 100},
                        // {label: "交付计划ID", code: "jfjhId", width: 100},
                        {label: "产品编号", code: "cpCode", width: 100, hidden: true},

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
                dataUrl: '/pms/PmsJfjhCp/listByCpCodeForSycs',
                xtFj: [],
                changeFjSrdata:[],
                visibleProject: false
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
            selectConfirm (person) {
                console.log(person, 'per')
                this.formModel.xmDeptCode = person[0].deptCode;
                this.formModel.xmDeptName = person[0].deptShortName;
                this.formModel.xmzgCode = person[0].code;
            },
            showProjectDialog() {
                this.visibleProject = true;
            },
            closeProject() {
                this.visibleProject = false;
            },
            selectProject(item) {
                this.formModel.xmCode = item[0].xmcode;
                this.formModel.xmName = item[0].xmname;
                // this.controlMj = [item[0].dataSecretLevcode];
                // this.formModel.dataSecretLevcode = '';
                // this.formModel.oidXm = item[0].oid;
                // this.formModel.xmcode = item[0].xmcode;
                // this.formModel.xmname = item[0].xmname;
                // this.visibleProject = false;
            },
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
                this.sectProduct = this.formModel.pmsSycsCpVoList;
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
                this.formModel.pmsSycsCpVoList = this.sectProduct;
                this.formModel.xtFjs = fj;
                console.log(this.formModel, 'formmodel')
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
                console.log(this.sectProduct)
                this.formModel.pmsSycsCpVoList = this.sectProduct;
                let tid = setTimeout(()=>{
                    console.log(this.formModel.pmsSycsCpVoList)
                }, 1000)
                this.productVisible = false;
            },
            addproduct() {
                this.productVisible = true;
                this.sectProduct = this.formModel.pmsSycsCpVoList?this.formModel.pmsSycsCpVoList:[];
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
                    this.formModel.pmsSycsCpVoList = this.sectProduct.filter(c => {
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
