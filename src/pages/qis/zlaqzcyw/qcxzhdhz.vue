<template>
    <div class="ice-container">
        <!--《质量信得过班组汇总》列表展示页面-->
        <ice-query-grid
                data-url="pms/QisQcxzhd/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                :operations-width="200"
                ref="grid"
                exportTitle="质量信得过班组汇总"
        >
        </ice-query-grid>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible" width="1200px">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first" style="height: 300px;">
                    <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                        <div class="formItem">
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="小组编号" label-width="140px" prop="qcCode">
                                        <el-input disabled v-model="formModel.qcCode" placeholder="自动生成"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="小组名称" label-width="140px" prop="qcName">
                                        <el-input v-model="formModel.qcName" placeholder="请输入"
                                                  :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="课题名称" label-width="140px" prop="ktName">
                                        <el-input v-model="formModel.ktName" placeholder="请输入"
                                                  :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第二行-->
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="申报单位" label-width="140px" prop="sbdwName">
                                        <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                           v-model="formModel.sbdwName"
                                                           @select-confirm="depts=>formModel.zgbmCode=depts[0].deptCode">
                                        </ice-dept-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="小组组长" label-width="140px" prop="zzName">
                                        <el-input disabled v-model="formModel.zzName" placeholder="请输入"
                                                  :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="密级" label-width="140px" prop="bzCode">
                                        <ice-select v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第三行-->

                            <!--第四行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="申请理由" label-width="140px" prop="sqly">
                                        <el-input v-model="formModel.sqly" placeholder="填写不超过500个字" type="textarea"
                                                  :rows="2">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第五行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="内容及目标" label-width="140px" prop="content">
                                        <el-input v-model="formModel.content" placeholder="填写不超过500个字" type="textarea"
                                                  :rows="2">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第五行-->
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="进度安排" label-width="140px" prop="jdap">
                                        <el-input v-model="formModel.jdap" placeholder="填写不超过500个字" type="textarea"
                                                  :rows="2">
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
                        <div class="addXzcy">
                            <el-button type="success" @click="addCy"><i class="el-icon-circle-plus"
                                                                        style="margin-right: 5px;"></i>添加
                            </el-button>
                        </div>
                        <vxe-table
                                ref="xzcy"
                                border="inner"
                                :align="allAlign"
                                :edit-config=true
                                :data="tableData">
                            <vxe-table-column type="seq" width="60"></vxe-table-column>
                            <vxe-table-column field="name" title="姓名" :edit-render="{name: 'input', autoselect: true}">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input v-model="row.cyName"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="sex" title="性别">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <ice-select v-model="row.cySex"
                                                map-type-code="SEX"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="age" title="年龄">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input v-model="row.cyAge"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="zy" title="职务">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input v-model="row.cyPositon"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column title="操作">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-button type="text" @click="delRow(row)">删除</el-button>
                                </template>
                            </vxe-table-column>
                        </vxe-table>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="附件" name="fj" style="height: 300px;">
                    <div class="formItem">
                        <ATTACHMENT Height="250px" :data="xtFjList" ref="qisAqJj"></ATTACHMENT>
                    </div>

                </el-tab-pane>
            </el-tabs>
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="conserve" :disabled="disabled">保存</el-button>
                    <el-button type="info" @click="visible=false">返回</el-button>
                </div>
            </el-row>
        </ice-dialog>
        <!--<el-form :model="testForm" ref="form" :rules="testRule" v-loading="loading">-->
        <!--<div class="formItem">-->
        <!--&lt;!&ndash;第一行&ndash;&gt;-->
        <!--<el-row :gutter="20">-->
        <!--<el-col :span="8">-->
        <!--<el-form-item :label="item.label" label-width="140px" :prop="item.key" v-for="(item, index) in testConfit" :key="index">-->
        <!--<el-input v-model="testForm[item.key]" placeholder="自动生成"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--&lt;!&ndash;底部按钮&ndash;&gt;-->
        <!--</div>-->


        <!--</el-form>-->
        <qc-detail ref="detail" :to-flow="view"></qc-detail>


    </div>
</template>

<script>
    //@author lihengg
    //@date  2020-03-12
    //@Version 1.0.0.1
    //QC小组活动申报
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IceSelect from "@/components/common/base/IceSelect";
    import {SBZT, SPZT} from "../../../utils/constant";
    import mixins from '../components/mixins'
    import  qcDetail from './details/qcDetail'



    export default {
        name: "qcxzhdhz",
        components: {IceQueryGrid, ATTACHMENT, IceDeptSelector, IceSelect, qcDetail},
        mixins: [mixins],
        data() {
            return {
                xtFjList: [],
                tableData: [
                    {
                        cyName: '',
                        cySex: '1',
                        cyAge: '',
                        cyPositon: ''
                    }
                ],
                allAlign: null,
                activeName: 'first',
                //默认模态框标题为空
                title: '',
                //默认模态框状态为“关闭”
                visible: false,
                //加载动态转圈
                loading: false,

                disabled: true,

                //查询
                query: [
                    {type: 'input', code: 'qcCode', label: '小组编号', value: ""},
                    {type: 'input', code: 'qcName', label: '小组名称', value: ""},
                    {type: 'input', code: 'ktName', label: '课题名称', value: ""},
                    {type: 'input', code: 'sbdwName', label: '申报单位', value: ""},
                    {type: 'input', code: 'zzName', label: '小组组长', value: ""},
                    // {type: 'input', code: 'qcNumber', label: '小组人数', value: ""},
                    {type: 'input', code: 'sqly', label: '申请理由', value: ""},
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
                //调用网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {label: "小组编号", code: "qcCode", sortable: true},
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: "小组名称", code: "qcName",},
                    {label: "课题名称", code: "ktName"},
                    {label: "申报单位", code: "sbdwName"},
                    {label: "小组组长", code: "zzName"},
                    //小组人数填写
                    {label: "小组人数", code: "qcNumber"},
                    {label: "申请理由", code: "sqly"},
                    {label: "内容及目标", code: "content", hidden: true},
                    {label: "进度安排", code: "jdap", hidden: true},
                    {label: "备注", code: "dateRemark", hidden: true},
                    {label: "密级", code: "dataSecretLevcode", width: 100, mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "上报状态", code: "sbzt", mapTypeCode: 'SBZT'},
                    {label: "审批状态", code: "spzt", mapTypeCode: 'SPZT'},
                    {label: '质量计划', code: 'oidZljh', width: 100, hidden: true},
                    {label: '部门', code: 'oidDepRel', width: 100, hidden: true},
                    {label: '部门名字', code: 'depRelName', width: 100},
                ],
                //按钮操作
                buttons: [
                    {
                        name: '新增',
                        icon: 'el-icon-plus',
                        type: 'primary',
                        ctrlCode: "BXZ",
                        callback: this.addItem,
                        disabled: () => {
                            return this.jhdata.isDetail ? true : false
                        }
                    },
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
                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    oid: '',
                    qcCode: '',//小组编号
                    qcName: '',//小组名称
                    ktName: '',//课题名称
                    sbdwCode: '',//申报单位编号
                    sbdwName: '',//申报单位名称
                    cybZzId: '',//组长在成员表中的ID
                    zzName: '',//组长名称
                    sqly: '',//申请理由
                    content: '',//内容和目标
                    jdap: '',//进度安排
                    docIds: '',//附件ID集合
                    sbdwDate: '',//申报日期
                    qcNumber: '',//小组人数
                    dataSecretLevcode: '',//密级
                    dateRemark: '',//备注
                },
                testForm: {
                    abb: ''
                },
                testRule: {
                    abb: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                },
                testConfit: [
                    {
                        key: 'abb',
                        label: '16516'
                    }
                ]
            }
        },


        //专门写方法的区域
        methods: {
            // 新增成员
            addCy() {
                let record = {
                    cyName: '1',
                    cySex: '1',
                    cyAge: '',
                    cyPositon: ''
                };
                console.log(123)
                this.$refs.xzcy.insertAt(record, -1)
                    .then(({row}) => this.$refs.xzcy.setActiveCell(row))
            },
            handleClick(e) {
                console.log(e)
                if (e.name == 'fj') {
                    this.$refs.qisAqJj.resize();
                }
                if (e.name == 'xzcy') {
                    this.$nextTick(() => {
                        this.$refs.xzcy.recalculate();
                    })
                }
            },
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            refresh() {
                this.$refs.grid.refresh();
            },

            //新增安全论证申报模态框
            addItem() {
                // this.title = '新增质量信得过班组汇总';
                // this.visible = true;
                // this.disabled = false;
                // this.formModel.oid = '';
                // this.formModel.deleteStatus = 0;
                // this.$nextTick(_ => {
                //   if (this.$refs.form !== undefined) {
                //     this.$refs.form.resetFields();
                //   }
                // })
                this.$router.push('/qis/zlaqzcyw/qcxzhdhz_flow')
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
                this.formModel.dataSecretLevcode = 2;
                let fj = this.$refs.qisAqJj.getData();
                this.formModel.xtFjList = fj.length != 0 ? fj : [];

                let cy = this.$refs.xzcy.getTableData().tableData;
                let deldata = this.$refs.xzcy.getRemoveRecords();
                deldata.map((c) => {
                    c.version = -1;
                })
                cy = cy.concat(deldata);
                this.formModel.qisXdgBzcyList = cy.length != 0 ? cy : [];
                this.formModel.qisXdgBzcyList.map((c) => {
                    c.dataSecretLevcode = 2;
                })
                this.$axios.post("pms/QisQcxzhd/saveOrUpdateByMultiTableQcXzhdhz", this.formModel)
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
            // 查询小组成员
            searchXzcy(oid) {
                this.$axios.get("pms/QisQcxzhd/querylistByOidQcCy ", {params: {oid: oid}})
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
            view(row) {
                this.$router.push({path: '/qis/zlaqzcyw/qcxzhdhz_flow', query: {dataId: row.oid}});
            },
// 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            //选中一行进行编辑
            edit(row) {
                // this.title = '编辑质量信得过班组汇总';
                // this.visible = true;
                // this.disabled = false;
                // this.$nextTick(_ => {
                //   this.$refs.form.resetFields();
                //   this.formModel = {...row}
                //   this.searchXzcy(row.oid)
                //   this.getFj(row.oid)
                //   this.$refs.qisAqJj.resize();
                // })
                this.$router.push({
                    path: '/qis/zlaqzcyw/qcxzhdhz_flow', query: {
                        dataId: row.oid
                    }
                })
                //this.getFjData(row);
            },
            //选中一行进行删除
            delete(row) {
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.formModel.deleteStatus = 1;
                    this.$axios.delete("/pms/QisQcxzhd/del", {params: {id: this.formModel.oid}})
                        .then(result => {
                            this.$message.success('删除成功！')
                            this.refresh();
                        })
                        .catch(error => {
                            this.$message.error(fail)
                        })
                        .finally(_ => {
                            this.loading = false
                        })
                })
            },
            // 删除行
            delRow(row) {
                this.$refs.xzcy.remove([row]);
            },
        },
        watch: {
            $route(New, old) {
                if (New.path === '/qis/zlaqzcyw/qcxzhdhz' && old.path === '/qis/zlaqzcyw/qcxzhdhz_flow') {
                    this.refresh();
                }
            }
        },
    }
</script>
<style lang="less">
    .formItem {
        height: 300px;
    }
</style>
