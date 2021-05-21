<template>
    <div class="ice-container">
        <!--《应急预案台账》列表展示页面-->
        <!--<ice-query-grid-->
        <!--data-url="pms/QisYjya/list"-->
        <!--:query="query"-->
        <!--:columns="columns"-->
        <!--:buttons="buttons"-->
        <!--:operations="operations"-->
        <!--:operations-width="200"-->
        <!--ref="grid"-->
        <!--exportTitle="应急预案台账"-->
        <!--&gt;-->
        <!--</ice-query-grid>-->
        <div class="btns">
            <div class="right">
                <search-input :query="query" @search="search" ref="search"></search-input>
            </div>
            <div class="left">
                <el-button type="primary" @click="addItem"><i class="el-icon-plus"></i>新增</el-button>
                <el-button type="primary" @click="refresh"><i class="el-icon-refresh-right"></i>刷新</el-button>
            </div>
        </div>
        <div class="tab" style="padding: 0 10px;">
            <el-tabs v-model="activeName1" @tab-click="handleClickLx">
                <el-tab-pane label="专项应急演练" name="ZXYJ"></el-tab-pane>
                <el-tab-pane label="现场处置演练" name="XCCZ"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="vxe-full-main">
            <div class="vxe-full-container">
                <vxe-table
                        v-loading="vxeloading"
                        resizable
                        :align="allAlign"
                        border
                        height="100%"
                        align='center'
                        class="vxe"
                        :data="tableData">
                    <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                    <vxe-table-column v-for="(item, index) in columns" :key="index" :col="item"
                                      is="qis-vxe-columns"></vxe-table-column>
                    <vxe-table-column fixed="right" title="操作" width="100">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <el-button type="text" @click="edit(row)">编辑</el-button>
                            <el-button type="text" @click="handledelete(row)">删除</el-button>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
        </div>

        <vxe-pager
                perfect
                :loading="loading"
                size="mini"
                :current-page="tablePage.current"
                :page-size="tablePage.size"
                :total="tablePage.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="data=>{handlePageChange(data[0])}">
        </vxe-pager>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible" width="1200px">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first" style="height: 300px;">
                    <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                        <!--第一行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="台账编号" label-width="140px" prop="code">
                                    <el-input v-model="formModel.code" placeholder="自动生成" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="演练地点" label-width="140px" prop="yldd">
                                    <el-input maxlength="30" v-model="formModel.yldd" placeholder="请输入"
                                              :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第二行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="演练时间" label-width="140px" prop="ylsj">
                                    <el-date-picker v-model="formModel.ylsj"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="演练类型" label-width="140px" prop="yllx">
                                    <ice-select v-model="formModel.yllx" map-type-code="YLLX" placeholder="请选择"
                                                :disabled="disabled"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第三行-->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="应急预案" label-width="140px" prop="yjyaCode">
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.yjyaCode" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">编号</template>
                                    </el-input>
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.yjyaName" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">名称</template>
                                    </el-input>
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.yjyaVersion" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">版本</template>
                                    </el-input>
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.yjyaRemark" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">备注</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="演练方案" label-width="140px" prop="ylfaCode">
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.ylfaCode" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">编号</template>
                                    </el-input>
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.ylfaName" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">名称</template>
                                    </el-input>
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.ylfaVersion" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">版本</template>
                                    </el-input>
                                    <el-input maxlength="16" style="width: 25%;" v-model="formModel.ylfaRemark" placeholder="请输入"
                                              :disabled="disabled">
                                        <template slot="prepend">备注</template>
                                    </el-input>
                                </el-form-item>

                            </el-col>
                        </el-row>
                        <!--第二行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="参演人员" label-width="140px" prop="cyry">
                                    <ice-persion-selector chooseItem="multiple" mode="onlySelect"
                                                          v-model="formModel.cyry"
                                                          :selectedPersion="sectPers"
                                                          @select-confirm="depts=>sectPers=depts">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="记录人" label-width="140px" prop="jlr">
                                    <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                          v-model="formModel.jlr"
                                                          @select-confirm="depts=>formModel.jlrCode=depts[0].code">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第二行-->
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="评估人" label-width="140px" prop="pgr">
                                    <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                          v-model="formModel.pgr"
                                                          @select-confirm="depts=>formModel.pgrCode=depts[0].code">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                    <ice-select :controlMjPar="controlMjPar" v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>


                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="附件" name="fj" style="height: 300px;">
                    <div class="formItem">
                        <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" Height="250px" :data="xtFjList"
                                    ref="qisAqJj"></ATTACHMENT>
                    </div>

                </el-tab-pane>
            </el-tabs>
            <!--底部按钮-->
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="conserve" :disabled="disabled">保存</el-button>
                    <el-button type="info" @click="visible=false">返回</el-button>
                </div>
            </el-row>


        </ice-dialog>
    </div>
</template>

<script>
    //@author lihengg
    //@date  2020-03-12
    //@Version 1.0.0.1
    //应急预案台账
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import qisVxeColumns from '../../basePage/VxeColumns';
    import searchInput from "../zlycbh/searchInput"
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import IceSelect from "@/components/common/base/IceSelect";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";

    import codeConfigRequest from '@/utils/codeConfigRequest'

    export default {
        name: "yjyatz",
        mixins: [codeConfigRequest],
        components: {IceQueryGrid, qisVxeColumns, searchInput, IcePersionSelector, IceSelect, ATTACHMENT},

        data() {
            return {
                activeName1: 'ZXYJ',
                vxeloading: false,
                tableData: [],
                allAlign: null,
                xtFjList: [],
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
                    {type: 'input', code: 'code', label: '台账编号', exp: 'like', value: ''},
                    {type: 'input', code: 'yldd', label: '演练地点', exp: 'like', value: ''},
                    {type: 'date', code: 'ylsj', label: '演练时间', exp: 'like', value: ''},
                    {type: 'input', code: 'cyry', label: '参演人员', exp: 'like', value: ''},
                    {type: 'input', code: 'yjyaCode', label: "应急预案编号", exp: 'like', value: ''},
                    {type: 'input', code: 'yjyaName', label: "应急预案名称", exp: 'like', value: ''},
                    {type: 'input', code: 'yjyaVersion', label: "应急预案版本", exp: 'like', value: ''},
                    {type: 'input', code: 'yjyaRemark', label: "应急预案备注", exp: 'like', value: ''},

                    {type: 'input', code: 'ylfaCode', label: "演练方案编号", exp: 'like', value: ''},
                    {type: 'input', code: 'ylfaName', label: "演练方案名称", exp: 'like', value: ''},
                    {type: 'input', code: 'ylfaVersion', label: "演练方案版本", exp: 'like', value: ''},
                    {type: 'input', code: 'ylfaRemark', label: "演练方案备注", exp: 'like', value: ''},
                    {type: 'input', code: 'jlr', label: "记录人", exp: 'like', value: ''},
                    {type: 'input', code: 'pgr', label: "评估人", exp: 'like', value: ''},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '项目密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'static', code: 'yllx', label: '演练类型', exp: 'like', value: 'ZXYJ'},
                ],

                //调用网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {label: "台账编号", code: "code", sortable: true, width: '100'},
                    {label: "演练地点", code: "yldd", width: '100'},
                    {label: "演练时间", code: "ylsj", width: '100'},
                    {label: "演练类型", code: "yllx", width: '100', mapTypeCode: 'YLLX'},
                    {label: "参演人员", code: "cyry", width: '100'},//很多参演人员

                    {
                        label: "应急预案", code: "", sortable: true, width: '100',
                        columns: [
                            {label: "应急预案编号", code: "yjyaCode", sortable: true, width: '100'},
                            {label: "应急预案名称", code: "yjyaName", width: '100'},
                            {label: "应急预案版本", code: "yjyaVersion", sortable: true, width: '100'},
                            {label: "应急预案备注", code: "yjyaRemark", width: '100'},
                        ]
                    },

                    {
                        label: "演练方案", code: "", sortable: true, width: '100',
                        columns: [
                            {
                                label: "演练方案编号", code: "ylfaCode", sortable: true, width: '100'
                            },
                            {label: "演练方案名称", code: "ylfaName", sortable: true, width: '100'},
                            {label: "演练方案版本", code: "ylfaVersion", width: '100'},
                            {label: "演练方案备注", code: "ylfaRemark", width: '100'},
                        ]
                    },

                    {label: "参演人员ID集合", code: "cyryIds", width: '100', hidden: true,},
                    {label: "记录人", code: "jlr", width: '100'},
                    {label: "评估人", code: "pgr", width: '100'},

                    {label: "备注", code: "dateRemark", hidden: true, width: '100'},
                    {label: "密级", code: "dataSecretLevcode", width: 100, mapTypeCode: 'DATA_SECRET_LEVEL'},

                ],
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditions: [],
                    conditionLink: 'OR'
                },
                //按钮操作
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
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
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC", type: 'danger'},
                ],

                //验证不能为空
                rules: {
                    ylsj: [
                        {required: true, message: '请选择演练时间'}
                    ],
                    yldd: [
                        {required: true, message: '演练地点不能为空'}
                    ],
                    yllx: [
                        {required: true, message: '请选择演练类型'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空'}
                    ],
                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    oid: '',
                    code: '',//台账编号
                    yldd: '',//演练地点
                    ylsj: '',//演练时间
                    yllx: '',//演练类型
                    yjyaCode: '',//应急预案编号
                    yjyaName: '',//应急预案名称
                    yjyaVersion: '',//应急预案版本
                    yjyaRemark: '',//应急预案备注
                    ylfaCode: '',//演练方案编号
                    ylfaName: '',//演练方案名称
                    ylfaVersion: '',//演练方案版本
                    ylfaRemark: '',//演练方案备注
                    cyryIds: '',//参演人员ID集合
                    jlr: '',//记录人
                    pgr: '',//评估人
                    docIds: [],//附件ID集合
                    dataSecretLevcode: '',//密级
                    dateRemark: '',//备注
                    cyry: '',//参演人员
                },
                requestData: [],
                sectPers: [],
                changeFjSrdata: []
            }
        },
        created() {
            this.getList();
        },
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
            },
            staticQuerys() {
                let arr = this.query.filter(item => item.type == "static")
                return arr.map(c => {
                    return {
                        column: c.code,
                        exp: c.exp,
                        value: typeof c.value == "function" ? c.value() : c.value
                    }
                });
            },
        },
        //专门写方法的区域
        methods: {
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'yjyatz'}).then(res => {
                    this.formModel.code = res.number;
                })
            },
            search(data) {
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
            // 查询附件
            getFj(oid) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
                    .then(result => {
                        this.xtFjList = result.data;
                        this.changeFjSrdata = this.xtFjList;
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            //刷新方法,保存，关闭，编辑，删除等时候进行调用


            //新增安全论证申报模态框
            addItem() {
                this.title = '新增应急预案台账';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.sectPers = [];
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                        this.formModel = {
                            oid: '',
                            code: '',//台账编号
                            yldd: '',//演练地点
                            ylsj: '',//演练时间
                            yllx: '',//演练类型
                            yjyaCode: '',//应急预案编号
                            yjyaName: '',//应急预案名称
                            yjyaVersion: '',//应急预案版本
                            yjyaRemark: '',//应急预案备注
                            ylfaCode: '',//演练方案编号
                            ylfaName: '',//演练方案名称
                            ylfaVersion: '',//演练方案版本
                            ylfaRemark: '',//演练方案备注
                            cyryIds: '',//参演人员ID集合
                            jlr: '',//记录人
                            pgr: '',//评估人
                            docIds: [],//附件ID集合
                            dataSecretLevcode: '',//密级
                            dateRemark: '',//备注
                            cyry: '',//参演人员
                        };
                        this.$refs.qisAqJj.resize();
                        this.getCode();
                    }
                    this.xtFjList = [];
                })
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
            // 请求数据
            getCol(data) {
                data.forEach((c) => {
                    if (c.columns && c.columns.length > 0) {
                        this.getCol(c.columns);
                    } else {
                        this.requestData.push(c.code);
                    }
                })
            },
            getList() {
                this.vxeloading = true;
                this.requestData = [];
                this.getCol(this.columns);
                this.tablePage.columns = this.requestData;
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("pms/QisYjya/list", {params: this.tablePage})
                    .then(result => {
                        this.tableData = result.data.records;
                        this.tablePage.total = result.data.total;
                        this.vxeloading = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },

            //保存方法  success：成功提示信息，fail：失败信息
            //参演人员保存多个  id存在这个cyryIds   参演人员姓名保存这个 cyry
            save(success, fail) {
                this.loading = true;
                let fj = this.$refs.qisAqJj.getData();
                this.formModel.xtFjList = fj.length != 0 ? fj : [];


                if (this.formModel.cyry) {
                    this.formModel.cyryIds = (this.sectPers.map((c) => {
                        return c.oid;
                    })).join(',');
                }

                this.$axios.post("pms/QisYjya/saveOrUpdateByMultiTableYjya", this.formModel)
                    .then(result => {
                        this.visible = false
                        this.$message.success(success)
                        // this.$refs.grid.refresh();
                        this.refresh();
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            refresh() {
                this.getList();
            },
            //选中一行进行编辑
            edit(row) {
                this.title = '编辑应急预案台账';
                this.visible = true;
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                    this.getFj(row.oid);
                })
                //this.getFjData(row);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisYjya/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取单个失败！")
                    })
            },
            //选中一行进行删除
            handledelete(row) {
                console.log(23123)
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    console.log(123)
                    this.formModel.deleteStatus = 1;
                    this.$axios.delete("/pms/QisYjya/del", {params: {id: this.formModel.oid}})
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
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.current = currentPage;
                this.tablePage.size = pageSize;
                this.refresh();
            },
            handleClick(e) {
                if (e.name == 'fj') {
                    this.$refs.qisAqJj.resize();
                }
            },
            handleClickLx(e) {
                console.log(e)
                this.query[this.query.length - 1].value = e.name;
                // this.refresh();
                this.$refs.search.search();
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

    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;
        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>
