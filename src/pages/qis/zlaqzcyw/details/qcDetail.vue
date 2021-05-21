<template>
    <div>
        <ice-dialog title="安全论证申报详情" :visible.sync="visible" width="1200px">
            <div style="position: relative;">
                <div class="toFlow" v-if="formModel.spzt !== SPZT.WSP">
                    <el-button type="primary" @click="toFlow1">流程记录</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first" style="height: 300px;">
                    <el-form :model="formModel" ref="form">
                        <div class="formItem">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                                        <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                            <el-button v-if="flowScope.formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                                       @click="showSectJh"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="编辑部门" label-width="140px" prop="oidDepRel">
                                        <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                                  placeholder="请选择"
                                        >
                                            <el-button v-if="flowScope.formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                                       @click="showSectBm"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="密级" label-width="140px" prop="bzCode">
                                        <ice-select  :disabled="flowScope.formReadonly"
                                                    v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="小组编号" label-width="140px" prop="qcCode">
                                        <el-input disabled v-model="formModel.qcCode" placeholder="自动生成"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="小组名称" label-width="140px" prop="qcName">
                                        <el-input maxlength="16" v-model="formModel.qcName" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="课题名称" label-width="140px" prop="ktName">
                                        <el-input maxlength="16" v-model="formModel.ktName" placeholder="请输入"
                                                  :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第二行-->
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="申报单位" label-width="140px" prop="sbdwName">
                                        <ice-dept-selector  chooseItem="single"
                                                           :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                           v-model="formModel.sbdwName"
                                                           @select-confirm="depts=>{formModel.sbdwCode=depts[0].deptCode;formModel.sbdwId=depts[0].oid}">
                                        </ice-dept-selector>
                                    </el-form-item>
                                </el-col>
                                <!--                                    <el-col :span="8">-->
                                <!--                                        <el-form-item label="小组组长" label-width="140px" prop="zzName">-->
                                <!--                                            <el-input disabled v-model="formModel.zzName"  placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>-->
                                <!--                                        </el-form-item>-->
                                <!--                                    </el-col>-->

                            </el-row>
                            <!--第三行-->

                            <!--第四行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="申请理由" label-width="140px" prop="sqly">
                                        <el-input :disabled="flowScope.formReadonly" v-model="formModel.sqly"
                                                  placeholder="填写不超过500个字" maxlength="500" show-word-limit
                                                  type="textarea" :rows="2">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第五行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="内容及目标" label-width="140px" prop="content">
                                        <el-input :disabled="flowScope.formReadonly" v-model="formModel.content"
                                                  placeholder="填写不超过500个字" maxlength="500" show-word-limit
                                                  type="textarea" :rows="2">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第五行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="进度安排" label-width="140px" prop="jdap">
                                        <el-input :disabled="flowScope.formReadonly" v-model="formModel.jdap"
                                                  placeholder="填写不超过500个字" maxlength="500" show-word-limit
                                                  type="textarea" :rows="2">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--底部按钮-->
                        </div>


                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="小组成员" name="xzcy" style="height: 300px;">
                    <div class="formItem">
                        <div class="addXzcy" v-if="!flowScope.formReadonly">
                            <el-button type="success" @click="addCy"><i class="el-icon-circle-plus"
                                                                        style="margin-right: 5px;"></i>添加
                            </el-button>
                        </div>
                        <vxe-table
                                auto-resize
                                ref="xzcy"
                                border="inner"
                                :align="allAlign"
                                :data="tableData">
                            <vxe-table-column type="seq" width="60"></vxe-table-column>
                            <vxe-table-column field="cyName" title="姓名">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <!--{{flowScope.formReadonly}}-->
                                    <el-input maxlength="16" v-model="row.cyName"
                                              :disabled="editDisabled"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="cySex" title="性别"
                                              :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SEX'}">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <ice-select :disabled="editDisabled" v-model="row.cySex"
                                                map-type-code="SEX"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="cyAge" title="年龄">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input maxlength="16" :disabled="editDisabled"
                                              v-model="row.cyAge"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="cyPositon" title="职务">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input maxlength="16" :disabled="editDisabled"
                                              v-model="row.cyPositon"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="isHead" title="是否组长"
                                              :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SFZZ'}">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <ice-select :disabled="editDisabled" v-model="row.isHead"
                                                map-type-code="SFZZ"
                                                @change="(val)=>{zzChange(row, val)}"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column title="操作" v-if="!editDisabled">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-button type="text" @click="delRow(row)">删除</el-button>
                                </template>
                            </vxe-table-column>
                        </vxe-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="附件" name="fj" style="height: 300px;">
                    <div class="formItem">
                        <ATTACHMENT :isHandleer="!flowScope.formReadonly" :data="fjdata" ref="attachment"></ATTACHMENT>
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
    import checkItem from "../../components/checkItem";




    export default {
        name: "qcDetail",
        components: {
            IceDialog,
            IceQueryGrid,
            ATTACHMENT,
            PmsInput,
            IceDeptSelector,
            IcePersionSelector,
            IceGridLayout,
            checkItem
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
                allAlign: null,
                tableData: [],

                mapTypeCode: 'QIS_JYMSBQ',
                SPZT,
                xtFj: [],
                activeName: "first",
                loading: false,
                formModel: {},
                flowScope: {
                    formReadonly: true,

                },
                visible: false,
                previd: "",
                options: [],
                fjdata: [],
                jymsTags: [],
                editDisabled: true

            }
        },
        created () {

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
                    this.$axios.get("/pms/QisQcxzhd/get", {params: {id: oid}})
                        .then(result => {
                            this.formModel = {...result.data}
                            this.formModel.id = this.oid;
                            this.getHtFjData(oid);
                            this.searchXzcy(oid);
                            this.visible = true;
                        })
                        .catch(error => {
                            this.$message.error("查询失败")
                        })
                } else {
                    this.visible = true;
                }


            },
            // 查询小组成员
            searchXzcy(oid) {
                this.$axios.get("pms/QisQcxzhd/querylistByOidQcCy", {params: {oid: oid}})
                    .then(result => {
                        this.tableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
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
