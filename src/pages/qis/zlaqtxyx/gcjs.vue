<template>
    <div class="ice-container">
        <el-container>
            <el-aside width="250px" class="asidelayout">
                <el-tabs type="border-card">
                    <el-tab-pane label="部门">
                        <ice-tree load-url="/permission/frame_org/load_table_tree?loadDisabled=false"
                                  label-prop="deptName"
                                  value-prop="oid"
                                  class="tree"
                                  @node-click="orgNodeClick"
                                  :lazy="false"
                                  ref="iceGrid">
                        </ice-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-aside>

            <el-main>
                <ice-query-grid
                        data-url="/pms/QisGcjs/list"
                        :operations-width="160"
                        :columns="columns"
                        :buttons="buttons"
                        :query="query"
                        :operations="operations"
                        :beforeBindData="beforeBindData"
                        ref="grid">
                </ice-query-grid>
                <!--<el-tabs v-model="activeName" type="border-card">-->
                <!--<el-tab-pane label="全部" name="first">-->
                <!--<-->
                <!--</el-tab-pane>-->
                <!--<el-tab-pane :label="x.value" :name="x.jcpl" v-for="x in data" @tab-click="clickTab">-->
                <!--<ice-query-grid-->
                <!--data-url="/pms/QisGcjs/list"-->
                <!--:operations-width="120"-->
                <!--:columns="columns"-->
                <!--:buttons="buttons"-->
                <!--:query="query"-->
                <!--:operations="operations"-->
                <!--ref="grid">-->
                <!--</ice-query-grid>-->
                <!--</el-tab-pane>-->
                <!--</el-tabs>-->
            </el-main>
        </el-container>

        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="质量计划" label-width="100px" prop="zljhCode">
                            <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                <el-button v-if="formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                           @click="showSectJh"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编辑部门" label-width="100px" prop="oidDepRel">
                            <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                      placeholder="请选择"
                            >
                                <el-button v-if="formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                           @click="showSectBm"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="过程名称" label-width="100px" prop="gcName">
                            <el-input maxlength="65" v-model="formModel.gcName" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="监视频次" label-width="100px" prop="jspc">
                            <ice-select v-model="formModel.jspc" map-type-code="JSPC"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="测量方法" label-width="100px" prop="clff">
                            <el-input maxlength="65" v-model="formModel.clff" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评价准则" label-width="100px" prop="pjzz">
                            <el-input maxlength="65" v-model="formModel.pjzz" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select :controlMjPar="controlMjPar" v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="测量内容" label-width="100px" prop="clnr">
                            <el-input type="textarea" v-model="formModel.clnr" :disabled="formReadonly" maxlength="650"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="检查情况" label-width="100px" prop="jcqk">
                            <el-input type="textarea" v-model="formModel.jcqk" :disabled="formReadonly" maxlength="650"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="附件" name="first">
                                <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" :data="attaTableData"
                                            ref="attachment"
                                            :is-handleer="!formReadonly"></ATTACHMENT>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <jh-common :jhType="jhType" ref="jhcommon" :jhOid="formModel.oidZljh?formModel.oidZljh:''"
                   @jhConfirm="jhConfirm" @bmConfirm="bmConfirm"></jh-common>
    </div>
</template>

<script>

    import moment from 'moment';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import XM_SELECT from "../../pms/common/XM_SELECT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceTree from "../../../components/common/base/IceTree";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import mixins from '../components/mixins'
    import jhCommon from '../components/jhCommon'
    import {ZLJHZT} from '../../../utils/constant'


    export default {
        components: {ATTACHMENT, IceTree, IcePersionSelector, XM_SELECT, IceQueryGrid, jhCommon},
        mixins: [mixins],
        data() {
            return {
                // 获取计划状态常量
                jhType: ZLJHZT.GCJS,
                title: '',
                data: [],
                activeName: 'first',
                loading: false,
                visible: false,
                formReadonly: false,
                attaTableData: [],

                formModel: {
                    oid: '',
                    gcName: '',
                    jspc: '',
                    clff: '',
                    pjzz: '',
                    clnr: '',
                    jcqk: '',
                    dataSecretLevcode: '',
                    dwId: '',
                    xtFjs: [],
                },

                query: [
                    {type: 'input', code: 'gcName', label: '过程名称', value: ''},
                    {type: 'input', code: 'clff', label: '测量方法', value: ''},
                    {type: 'input', code: 'pjzz', label: '评测准则', value: ''},
                    {type: 'input', code: 'createUser', label: '填报人', value: ''},
                    {type: 'date', code: 'createDate', label: '填报时间', value: ''},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'select', code: 'jspc', label: '监视频次', mapTypeCode: 'JSPC'},
                    {
                        type: 'static', code: 'dwId', exp: '=', value: () => {
                            return this.jhdata.oid ? "" : this.formModel.dwId
                        }
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'clnr', hidden: true},
                    {code: 'jcqk', hidden: true},
                    {code: 'dwId', hidden: true},
                    {label: '过程名称', code: 'gcName', width: 140},
                    {label: '测量方法', code: 'clff', width: 140},
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '评价准则', code: 'pjzz', width: 140},
                    {label: '监视频次', code: 'jspc', width: 140, mapTypeCode: 'JSPC', sortable: true},
                    {label: '填报人', code: 'createName', width: 100},
                    {
                        label: '填报时间', code: 'createDate', width: 140, sortable: true, formatter(row) {
                            return moment(row.createDate).format('YYYY-MM-DD');
                        }
                    },
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
                    // {label: '质量计划', code: 'zljhCode', width: 100, hidden: true},
                    //     oidZljh: '',
                    // zljhCode: '',
                    // oidDepRel: '',
                    // depRelCode: '',
                    // depRelName: '',
                    {label: '质量计划', code: 'oidZljh', width: 100, hidden: true},
                    {label: '部门', code: 'oidDepRel', width: 100, hidden: true},
                    // {label: '部门编码', code: 'depRelCode', width: 100},
                    // {label: '部门名字', code: 'depRelName', width: 100},
                ],
                buttons: [
                    {
                        name: '新增',
                        icon: 'el-icon-plus',
                        type: 'primary',
                        ctrlCode: "BXZ",
                        callback: this.addItem,
                        disabled: () => {
                            return this.isExist || (this.jhdata.isDetail ? true : false)
                        }
                    },
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-left',
                        ctrlCode: "BSX",
                        type: 'primary',
                        callback: this.refresh,
                    },
                ],
                rules: {
                    gcName: [
                        {required: true, whitespace: true, message: '请输入过程名称', trigger: 'blur'}
                    ],
                    jspc: [
                        {required: true, whitespace: true, message: '请选择监视频次', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [{required: true, message: '密级', trigger: 'blur'}],
                },
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            return row.zljhCode ? false : true
                        }
                    },
                    {name: '查看', callback: this.view, ctrlCode: "BCK"},
                ],
                changeFjSrdata: []
            }
        },
        methods: {
            // refresh
            refresh() {
                this.$refs.grid.refresh();
            },
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            addItem() {
                this.title = "过程监视记录新增"
                this.visible = true;
                this.formReadonly = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.fuzhiData();
                });
                this.formModel.oid = '';
                this.attaTableData = [];
            },

            confirm() {
                this.formModel.xtFjs = this.$refs.attachment.getData();
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/QisGcjs/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                            })
                    }
                })

            },
            clickTab(e) {
                console.log(e)
            },
            edit(row) {
                this.title = "过程监视记录编辑"
                this.visible = true;
                this.formReadonly = false;

                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                });
                this.getXtFjData(row.oid)
            }
            ,
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisGcjs/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划信息失败！")
                    })
            },
            view(row) {
                this.visible = true;
                this.formReadonly = true;

                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                });
                this.getXtFjData(row.oid)
            },

            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisGcjs/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },

            orgNodeClick(id, row) {
                this.formModel.dwId = id;
                this.$refs.grid.refresh();
            },

            // 获取系统附件数据
            getXtFjData(boid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: boid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                        this.changeFjSrdata = this.attaTableData;
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取系统附件数据失败！")
                    })
            },

        },
        // created() {
        //     this.$axios.get("/pms/QisGcjs/list", {
        //         params: {
        //             current: 1,
        //             size: 100,
        //             conditionLink: 'AND',
        //             columns: ['oid', 'jspc']
        //         }
        //     }).then(result => {
        //
        //         let data = result.data.records
        //         console.log(data)
        //         data.map(o => {
        //             if (o.jspc = 1) {
        //                 return o.value = '周'
        //             } else if (o.jspc = 2) {
        //                 return o.value = '月'
        //             } else if (o.jspc = 3) {
        //                 return o.value = '季度'
        //             } else if (o.jspc = 4) {
        //                 return o.value = '半年'
        //             }
        //         });
        //         this.data = data
        //         console.log(this.data)
        //     })
        // },
        computed: {
            controlFjMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
            controlMjPar() {
                // 附件
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })
                return [...arr2];
            }
        }
        ,
        watch: {},
        mounted() {

        }
        ,
    }
</script>

<style>
    .ice-scroll-bar-extend.el-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .ice-scroll-bar-extend.el-scrollbar .el-scrollbar__bar.is-horizontal > div {
        top: 2px;
    }

    .ice-scroll-bar-extend .el-tree > .el-tree-node {
        display: inline-block;
    }
</style>
<style lang="less">
    .asidelayout {
        position: relative;
    }

    .asidelayout /deep/ .el-tabs {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .asidelayout /deep/ .el-tabs .el-tabs__content {
        position: absolute;
        top: 39px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .asidelayout /deep/ .el-tabs .el-tabs__content .tree {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 15px;
        width: auto !important;
        overflow-y: auto;
    }

    .box-card {
        height: 580px;
        overflow: auto;
    }

    .hint {
        font-size: 12px;
        line-height: 30px;
        color: #f30213;
    }

    .inner_tree {
        height: 100%;
        width: 160px;
        /* margin-right: 5px;
         min-width: 150px;*/
    }
</style>
