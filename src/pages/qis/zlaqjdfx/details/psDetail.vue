<template>
    <div>
        <ice-dialog title="质量评审详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="bizdata.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="基础信息" name="first">
                    <div style="height: 500px;overflow: auto;">
                        <el-form :model="bizdata" status-icon  ref="definition" label-width="140px">

                            <ice-grid-layout :columns="2" name="业务表单">
                                <el-form-item label="生产组次" prop="jhzcArr">
                                    <!--<el-input v-model="bizdata.jhzc" autocomplete="off" :disabled="formReadonly"></el-input>-->
                                    <el-cascader v-model="bizdata.jhzcArr" placeholder="关键字搜索" :options="options" filterable clearable ref="cascader" :disabled="formReadonly"></el-cascader>
                                </el-form-item>
                                <el-form-item label="承制单位" prop="scdw">
                                    <ice-dept-selector chooseItem="single"  :mode="formReadonly?'readonly':'onlySelect'" v-model="bizdata.scdw" ></ice-dept-selector>
                                </el-form-item>
                                <el-form-item label="评审地点" prop="psdd">
                                    <el-input maxlength="65" v-model="bizdata.psdd" autocomplete="off" :disabled="formReadonly"></el-input>
                                </el-form-item>
                                <el-form-item label="评审时间" prop="pssj">
                                    <el-date-picker v-model="bizdata.pssj" autocomplete="off" :disabled="formReadonly"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="评审类型" prop="pslx">
                                    <ice-select v-model="bizdata.pslx" map-type-code="PSLX" autocomplete="off" :disabled="formReadonly"></ice-select>
                                </el-form-item>
                                <el-form-item label="密级" prop="dataSecretLevcode">
                                    <ice-select v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" autocomplete="off" :disabled="formReadonly"></ice-select>
                                </el-form-item>
                                <el-form-item label="申请理由" prop="sqly">
                                    <el-input type="textarea" v-model="bizdata.sqly" autocomplete="off" :disabled="formReadonly" maxlength="650"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </ice-grid-layout>
                            <ice-grid-layout :columns="1" name="关联数据">
                                <el-tabs v-model="activeName">
                                    <el-tab-pane label="附件" name="first">
                                        <ATTACHMENT :isHandleer="!formReadonly" :data="fjdata" ref="attachment"></ATTACHMENT>

                                    </el-tab-pane>
                                </el-tabs>
                            </ice-grid-layout>
                        </el-form>
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
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "../../../pms/common/ATTACHMENT";
    import PmsInput from '@/components/common/pms/PmsInput'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import { SPZT} from "../../../../utils/constant";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";



    export default {
        name: "psDetail",
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
        created () {
            this.$axios.get("/pms/JhPsc/selectPscTree")
                .then(result => {
                    this.options = result.data;
                })
                .catch(error => {
                    console.log(error)
                    this.$message.error("获取系统附件数据失败！")
                })
        },
        data() {
            return {
                SPZT,
                xtFj: [],
                activeName: "first",
                loading: false,
                bizdata: {},
                formReadonly: true,
                visible: false,
                previd: "",
                options: [],
                fjdata: []
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
                    this.$axios.get("/pms/QisCpzlps/get", {params: {id: oid}})
                        .then(result => {
                            this.bizdata = {...result.data}
                            this.bizdata.id = this.oid;
                            this.bizdata.jhzcArr = [this.bizdata.scxmId,this.bizdata.scjhId,this.bizdata.jhzcId];

                            this.getHtFjData(oid);
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


            },
            // 获取合同附件数据
            getHtFjData(oidHt) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oidHt}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                        this.fjdata = this.attaTableData;
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取合同附件数据失败！")
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
