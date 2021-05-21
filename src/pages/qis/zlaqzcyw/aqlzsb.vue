<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="ice-container">
        <!--《安全论证申报》列表展示页面-->
        <ice-query-grid
                data-url="pms/QisAqlzsb/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                :operations-width="200"
                ref="grid"
                exportTitle="安全论证申报"
        >
        </ice-query-grid>
        <!--<div class="btns">-->
        <!--<div class="right" style="width: 400px;">-->
        <!--<search-input :query="query" @search="search"></search-input>-->
        <!--</div>-->
        <!--<div class="left">-->
        <!--<el-button type="primary" @click="addItem"><i class="el-icon-plus"></i>新增</el-button>-->
        <!--</div>-->
        <!--</div>-->
        <!--<vxe-table-->
        <!--v-loading="loading"-->
        <!--ref="xTable"-->
        <!--resizable-->
        <!--:align="allAlign"-->
        <!--border-->
        <!--height="90%"-->
        <!--align='center'-->
        <!--class="vxe"-->
        <!--@toggle-row-expand="toggleExpandChangeEvent"-->
        <!--:data="tableData">-->
        <!--<vxe-table-column type="expand" width="60" title="序号">-->
        <!--<template v-slot:content="{ row, rowIndex }">-->
        <!--<template>-->
        <!--<el-tabs tab-position="left" v-model="activeName">-->
        <!--<el-tab-pane label="简要描述" name="first">{{row.jyms}}</el-tab-pane>-->
        <!--<el-tab-pane label="备注" name="second">-->
        <!--{{row.dateRemark}}-->
        <!--</el-tab-pane>-->
        <!--</el-tabs>-->
        <!--</template>-->
        <!--</template>-->
        <!--</vxe-table-column>-->
        <!--<vxe-table-column v-for="(item, index) in columns" :key="index" :col="item"-->
        <!--is="qis-vxe-columns"></vxe-table-column>-->
        <!--<vxe-table-column fixed="right" title="操作" width="100">-->
        <!--<template v-slot="{ row, rowIndex, columnIndex }">-->
        <!--<el-button type="text" @click="edit(row)">编辑</el-button>-->
        <!--<el-button type="text" @click="handledelete(row)">删除</el-button>-->
        <!--</template>-->
        <!--</vxe-table-column>-->
        <!--</vxe-table>-->
        <!--<vxe-pager-->

        <!--perfect-->
        <!--:loading="loading"-->
        <!--size="mini"-->
        <!--:current-page="tablePage.current"-->
        <!--:page-size="tablePage.size"-->
        <!--:total="tablePage.total"-->
        <!--:layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"-->
        <!--@page-change="handlePageChange">-->
        <!--</vxe-pager>-->
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="论证编号" label-width="140px" prop="lzCode">
                            <el-input disabled v-model="formModel.lzCode" placeholder="自动生成"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动名称" label-width="140px" prop="hdName">
                            <el-input v-model="formModel.hdName" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第二行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="承担单位" label-width="140px" prop="cddw">
                            <ice-dept-selector chooseItem="single" mode="onlySelect"
                                               v-model="formModel.cddw"
                                               @select-confirm="depts=>formModel.cddwCode=depts[0].deptCode">
                            </ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务来源" label-width="140px" prop="rwly">
                            <el-input v-model="formModel.rwly" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第三行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目负责人" label-width="140px" prop="xmbzr">
                            <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                  v-model="formModel.xmbzr"
                                                  @select-confirm="depts=>formModel.xmbzrCode=depts[0].code">
                            </ice-persion-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" label-width="140px" prop="lxdd">
                            <el-input v-model="formModel.lxdd" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第四行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="作业场所" label-width="140px" prop="zycs">
                            <el-input v-model="formModel.zycs" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="作业要求" label-width="140px" prop="zyrs">
                            <el-input v-model="formModel.zyrs" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第五行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="操作资质" label-width="140px" prop="czyq">
                            <el-input v-model="formModel.czyq" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第六行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="简要描述" label-width="110px" prop="jyms">
                            <el-input v-model="formModel.jyms" placeholder="简要描述填写不超过500个字" type="textarea" :rows="2">
                            </el-input>
                            <check-item :mapTypeCode="mapTypeCode" v-model="jymsTags"></check-item>
                            <!--<el-checkbox-group v-model="jymsTags">-->
                            <!--<el-checkbox v-for="(item, index) in filterSelectList" :label="item.value">{{item.label}}</el-checkbox>-->
                            <!--</el-checkbox-group>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第七行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
                            <el-input v-model="formModel.dateRemark" placeholder="备注填写不超过500个字" type="textarea"
                                      :rows="2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <ATTACHMENT Height="200px" :data="xtFjList" ref="qisAqJj"></ATTACHMENT>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="conserve" :disabled="disabled">保存
                        </el-button>
                        <el-button type="info" @click="visible=false">返回</el-button>
                    </div>
                </el-row>
            </el-form>
        </ice-dialog>
        <lzsb-detail ref="detail" :to-flow="view"></lzsb-detail>

    </div>
</template>

<script>
    //@author lihengg
    //@date  2020-03-12
    //@Version 1.0.0.1
    //安全论证申报业务页面
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import qisVxeColumns from '../../basePage/VxeColumns'
    import searchInput from "../zlycbh/searchInput"
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import {mapGetters, mapMutations} from 'vuex';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import checkItem from "../components/checkItem";
    import {SBZT, SPZT} from "../../../utils/constant";
    import  lzsbDetail from './details/lzsbDetail'



    export default {
        name: "aqlzsb",
        components: {
            checkItem,
            IceQueryGrid, qisVxeColumns, searchInput, ATTACHMENT, IceSelect, IceDeptSelector, IcePersionSelector, lzsbDetail
        },

        data() {
            return {
                //默认模态框标题为空
                title: '',
                queryListXmsc: [],
                //默认模态框状态为“关闭”
                visible: false,
                //加载动态转圈
                loading: false,

                disabled: true,

                //查询
                query: [
                    {type: 'input', code: 'lzCode', label: '论证编号', value: ""},
                    {type: 'input', code: 'hdName', label: '活动名称', value: ""},
                    {type: 'input', code: 'cddw', label: '承担单位', value: ""},
                    {type: 'input', code: 'rwly', label: '任务来源', value: ""},
                    {type: 'input', code: 'xmbzr', label: '项目负责人', value: ""},
                    {type: 'input', code: 'lxdd', label: '联系电话', value: ""},
                    {type: 'input', code: 'zycs', label: '作业场所', value: ""},
                    // {type: 'input', code: 'zyrs', label: '作业人数', value: ""},
                    {type: 'input', code: 'czyq', label: '操作资质要求', value: ""},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '项目密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                activeName: 'first',
                //调用网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {label: "论证编号", code: "lzCode", sortable: true},
                    {label: "活动名称", code: "hdName",},
                    {label: "承担单位", code: "cddwCode", cusMapTypeCode: 'DEPT'},
                    {label: "承担单位", code: "cddw", hidden: true},
                    {label: "任务来源", code: "rwly",},
                    {label: "项目负责人", code: "xmbzr",},
                    {label: "联系电话", code: "lxdd", sortable: true},
                    {label: "作业场所", code: "zycs",},
                    {label: "作业人数", code: "zyrs", sortable: true},
                    {label: "操作资质要求", code: "czyq",},
                    {label: "简要描述", code: "jyms", hidden: true},
                    {label: "备注", code: "dateRemark", hidden: true},
                    {label: "密级", code: "dataSecretLevcode", mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "简要描述", code: "jymsTags", hidden: true},
                    {label: "上报状态", code: "sbzt", mapTypeCode: 'SBZT'},
                    {label: "审批状态", code: "spzt", mapTypeCode: 'SPZT'},
                ],
                //按钮操作
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZAQLZSB", callback: this.addItem},
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-right',
                        type: 'primary',
                        ctrlCode: "BSX",
                        callback: this.refresh
                    },
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {
                        name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow: (row) => {
                            return row.spzt === SPZT.WSP
                        }
                    },
                    {
                        name: '查看', callback: this.showDetail, ctrlCode: "BCK"
                    },
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", type: 'danger', isShow: (row) => {
                            return row.spzt === SPZT.WSP
                        }
                    },
                ],

                //验证不能为空
                rules: {
                    hdName: [
                        {required: true, message: '名称不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空'}
                    ],
                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    hdName: '',
                    oid: '',
                    lzCode: '',//论证编号
                    whplx: '',//活动名称
                    cddw: '',//承担单位
                    rwly: '',//任务来源
                    xmbzr: '',//项目负责人
                    lxdd: '',//联系电话
                    zycs: '',//作业场所
                    zyrs: '',//作业人数
                    czyq: '',//操作要求
                    jyms: '',//简要描述
                    dataSecretLevcode: '',//密级
                    dateRemark: '',//备注
                    jymsTags: [], // 简要描述
                    docIds: [] // 附件
                },
                jymsTags: [],
                // 配置vxe-table 表格参数
                tableData: [],
                allAlign: null,
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    // staticConditions: [{type: 'static', column: 'xhYear', exp: '=', value: 0}],
                    // conditions: [],
                    // conditionLink: 'OR',
                }
                ,
                mapTypeCode: 'QIS_JYMSBQ',
                xtFjList: []
            }
        },
        computed: {
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode);
                } else {
                    return this.selectList;
                }

            }
        },
        created() {
            this.getList()
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
        },

        watch: {
            // 监听路由变化刷新页面
            $route(oldRoute, newRoute) {
                console.log(newRoute, oldRoute)
                if (newRoute.path == '/qis/zlaqzcyw/aqlzsb_flow') {
                    this.refresh();
                }

            }
        },
        //专门写方法的区域
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMapList']),
            // 查询附件
            getFj(oid) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
                    .then(result => {
                        this.xtFjList = result.data;
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            toggleExpandChangeEvent({row, rowIndex, expanded}) {
                this.$refs.xTable.setRowExpansion([this.tableData[rowIndex]], expanded)
                let items = this.tableData.filter((c, i) => {
                    return i != rowIndex
                })
                this.$refs.xTable.setRowExpansion([...items], false)

            },
            search(selectText) {
                this.query.map(item => item.value = selectText ? selectText : '');
                this.tablePage.conditions = this.query;
                this.getList();
            },
            // 获取列表数据
            getList() {
                this.loading = true;
                let columns = this.columns.map((c) => {
                    return c.code
                })
                console.log(columns)
                this.tablePage.columns = columns
                this.$axios.get("pms/QisAqlzsb/list", {params: this.tablePage}).then(result => {
                    // console.log(result)
                    this.tableData = result.data.records
                    this.tablePage.total = result.data.total;
                }).catch(e => {
                    this.$message.error("获取列表数据失败！")
                })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            refresh() {
                this.$refs.grid.refresh();
            },

            //新增安全论证申报模态框
            addItem() {
                // this.title = '新增安全论证申报信息';
                // this.visible = true;
                // this.disabled = false;
                // this.formModel.oid = '';
                // this.formModel.deleteStatus = 0;
                // this.$nextTick(_ => {
                //   if (this.$refs.form !== undefined) {
                //     this.$refs.form.resetFields();
                //   }
                // })
                this.$router.push('/qis/zlaqzcyw/aqlzsb_flow')
            },

            //调用保存方法
            conserve() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var files = [];
                        files.push(this.fileInfo)
                        this.save('保存成功！', '保存失败！');
                    }
                })
            },

            //保存方法  success：成功提示信息，fail：失败信息
            save(success, fail) {
                this.loading = true;
                let fj = this.$refs.qisAqJj.getData();
                this.formModel.xtFjList = fj.length != 0 ? fj : [];
                // return
                const a = this.jymsTags
                this.formModel.jymsTags = a.join(',');

                // this.formModel.docIds = fj;
                this.$axios.post("/pms/QisAqlzsb/saveOrUpdateByMultiTableAqlzsb", this.formModel)
                    .then(result => {
                        this.visible = false
                        this.$message.success(success)
                        this.$refs.grid.refresh();
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            view(row) {
                this.$router.push({path: '/qis/zlaqzcyw/aqlzsb_flow', query: {dataId: row.oid}});
            },
// 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            //选中一行进行编辑
            edit(row) {
                // this.title = '编辑安全论证申报信息';
                // this.visible = true;
                // this.disabled = false;
                // this.jymsTags = [];
                // this.xtFjList = [];
                // this.$nextTick(_ => {
                //   this.$refs.form.resetFields();
                //   this.formModel = {...row}
                //   const a = this.formModel.jymsTags;
                //   if (a) {
                //     this.jymsTags = a.split(',')
                //   }
                //   this.getFj(row.oid);
                //   this.$refs.qisAqJj.resize();
                // })
                this.$router.push({
                    path: '/qis/zlaqzcyw/aqlzsb_flow', query: {
                        dataId: row.oid
                    }
                })
            },
            //选中一行进行删除
            delete(row) {
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //this.formModel.deleteStatus = 1;
                    // return
                    //this.save('删除成功！', '删除失败！');
                    this.$axios.delete("pms/QisAqlzsb/deleteStatus", {params: {"oid": row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.refresh();
                    }).catch(error => {
                            console.log(123)
                            this.$message.error("删除失败")
                        }
                    )
                }).catch(() => {
                    console.log('取消成功')
                })
            },

            // 分页
            handlePageChange() {

            }


        },
    }

</script>
<style lang="less">
    .btns {
        padding: 10px 15px;

        .right {
            float: right;
        }

        .btn {
            margin-right: 10px;
        }
    }

    .vxe {
        flex-grow: 1;
    }
</style>
