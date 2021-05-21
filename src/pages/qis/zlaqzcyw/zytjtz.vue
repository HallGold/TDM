<template>
    <div class="ice-container">
        <!--《职业体检台账》列表展示页面-->
        <!--<ice-query-grid-->
        <!--data-url="pms/QisZytj/list"-->
        <!--:query="query"-->
        <!--:columns="columns"-->
        <!--:buttons="buttons"-->
        <!--:operations="operations"-->
        <!--:operations-width="200"-->
        <!--ref="grid"-->
        <!--exportTitle="职业体检台账"-->
        <!--&gt;-->
        <!--</ice-query-grid>-->
        <div class="btns">
            <div class="right" style="width: 400px;">
                <search-input :query="query" @search="search"></search-input>
            </div>
            <div class="left">
                <el-button type="success" @click="refresh"><i class="el-icon-refresh"></i>刷新</el-button>
                <el-button type="primary" @click="addItem"><i class="el-icon-plus"></i>新增</el-button>
            </div>
        </div>
        <div class="tab" style="padding: 0 10px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in filterSelectList" :label="item.label"
                             :name="item.value"></el-tab-pane>
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
                            <el-button type="text" @click="delete0(row)">删除</el-button>
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
                @page-change="handlePageChange">
        </vxe-pager>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="人员姓名" label-width="140px" prop="ryName">
                            <el-input maxlength="16" v-model="formModel.ryName" placeholder="请输入"
                                      :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="台账分类" label-width="140px" prop="tzlx">
                            <!--<el-input v-model="formModel.tzlx" placeholder="请输入" :disabled = "disabled"></el-input>-->
                            <ice-select v-model="formModel.tzlx"
                                        :map-type-code="mapTypeCode"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第二行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属单位" label-width="140px" prop="rydwName">
                            <ice-dept-selector chooseItem="single" mode="onlySelect"
                                               v-model="formModel.rydwName"
                                               @select-confirm="depts=>formModel.rydwCode=depts[0].deptCode">
                            </ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="体检项目" label-width="140px" prop="tjxm">
                            <el-input maxlength="30" v-model="formModel.tjxm" placeholder="请输入"
                                      :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第三行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="体检费用" label-width="140px" prop="tjfy">
                            <el-input type="number" v-model="formModel.tjfy" placeholder="请输入" :disabled="disabled">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="体检时间" label-width="140px" prop="tjDate">
                            <el-date-picker v-model="formModel.tjDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第四行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
                            <el-input v-model="formModel.dateRemark" placeholder="申报人填写不超过500个字"
                                      maxlength="500" show-word-limit type="textarea" :rows="4">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="conserve" :disabled="disabled">保存</el-button>
                        <el-button type="info" @click="visible=false">返回</el-button>
                    </div>
                </el-row>

            </el-form>

        </ice-dialog>
    </div>
</template>

<script>
    //@author lihengg
    //@date  2020-03-12
    //@Version 1.0.0.1
    //职业体检台账
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "@/components/common/base/IceSelect";
    import qisVxeColumns from '../../basePage/VxeColumns';
    import searchInput from "../zlycbh/searchInput"
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import {mapGetters, mapMutations} from 'vuex';
    import {validatePassNumber} from '@/utils/validator'

    export default {
        name: "aqlzsb",
        components: {IceQueryGrid, IceSelect, qisVxeColumns, searchInput, IceDeptSelector},

        data() {
            return {
                vxeloading: false,
                activeName: 'first',
                //默认模态框标题为空
                title: '',
                //默认模态框状态为“关闭”
                visible: false,
                //加载动态转圈
                loading: false,

                disabled: true,
                tabRow: {},
                //查询
                query: [
                    {type: 'input', code: 'ryName', label: '姓名', exp: 'like', value: ''},
                    {type: 'input', code: 'rydwName', label: '单位名称', exp: 'like', value: ''},
                    {
                        type: 'static', code: 'tzlx', label: '台账类型', exp: '=', value: () => {
                            return this.tabRow.value
                        }
                    },
                ],
                tableData: [],
                allAlign: '',
                //调用网格数据
                columns: [
                    //{code: "oid", hidden: true},
                    {label: "姓名", code: "ryName",},
                    {label: "所属单位名称", code: "rydwName",},
                    {label: "所属单位编码", code: "rydwCode",},

                    {label: "2020(元)", code: "year2020",},
                    {label: "2019(元)", code: "year2019",},
                    {label: "2018(元)", code: "year2018",},

                    // {label: "体检年份", code: "tjYear", },
                    // {label: "体检时间", code: "tjDate"},
                    // {label: "体检费用", code: "tjfy"},
                    // {label: "体检项目", code: "tjxm"},
                    // {label: "体检项目ID集合", code: "tjxmIds", hidden: true},
                    {label: "台账类型", code: "tzlx", width: 100, mapTypeCode: 'QIS_TZFL', hidden: true},
                    // {label: "所属单位编号", code: "rydwCode", hidden: true},
                    // {label: "简要描述", code: "jyms", hidden: true},
                    // {label: "备注", code: "dateRemark", hidden: true},
                    {label: "密级", code: "dataSecretLevcode", width: 100, mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditionLink: 'OR'
                },
                //按钮操作
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    //{name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "add",callback: this.refresh},
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC", type: 'danger'},
                ],

                //验证不能为空
                rules: {
                    ryName: [
                        {required: true, message: '请填写人员姓名'}
                    ],
                    tjfy: [
                        {required: true, validator: validatePassNumber, trigger: 'blur'}
                    ],
                    tzlx: [
                        {required: true, message: '请选择台账类型'}
                    ],
                    rydwName: [
                        {required: true, message: '请选择单位'}
                    ],
                    tjxm: [
                        {required: true, message: '请填写体检项目'}
                    ],
                    tjDate: [
                        {required: true, message: '请选择体检时间'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空'}
                    ],

                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    oid: '',
                    ryName: '',//体检人员名称
                    ryNameCode: '',//体检人员编码
                    rydwCode: '',//所属单位编号
                    rydwName: '',//所属单位名称
                    tzlx: '',//台账类型
                    tjxmIds: '',//体检项目ID集合
                    tjxm: '',
                    tjfy: '',//体检费用
                    tjDate: new Date(),//体检时间
                    tjYear: '',//体检年份
                    dataSecretLevcode: '',//密级
                    dateRemark: '',//备注
                },
                mapTypeCode: 'QIS_TZFL'

            }
        },
        watch: {
            filterSelectList () {
                if (this.filterSelectList.length > 0) {
                    this.tabRow = this.filterSelectList[0];
                    this.getList();
                }
            }
        },
        computed: {
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode);
                } else {
                    return [];
                }
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
        created() {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
            if (this.filterSelectList) {
                this.activeName = this.filterSelectList[0] && this.filterSelectList[0].value
            }
            if (this.filterSelectList.length > 0) {
                this.tabRow = this.filterSelectList[0];
                this.getList();
            }
        },
        //专门写方法的区域
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMapList']),
            search(data) {
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
            handleClick(e) {
                this.tabRow = this.filterSelectList[e.index];
                this.query[this.query.length - 1].value = e.name;
                this.refresh();
            },
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            refresh() {
                this.getList();
            },
            // 请求数据字段整理
            getCol(data) {
                data.forEach((c) => {
                    if (c.columns && c.columns.length > 0) {
                        this.getCol(c.columns);
                    } else {
                        this.requestData.push(c.code);
                    }
                })
            },
            // 分页
            handlePageChange(e) {
                this.tablePage.current = e.currentPage;
                this.tablePage.size = e.pageSize;
                this.refresh();
            },
            // 请求列表数据
            getList() {
                this.vxeloading = true;
                this.requestData = [];
                this.getCol(this.columns);
                this.tablePage.columns = this.requestData;
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("pms/QisZytj/queryListQisZytjSumTjfy", {params: this.tablePage})
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
            //新增安全论证申报模态框
            addItem() {
                this.title = '新增职业体检台账';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        console.log(123456, this.formModel)
                        this.$refs.form.resetFields();
                    }
                })
            },

            //调用保存方法
            conserve() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.save('保存成功！', '保存失败！');
                    }
                })
            },

            //保存方法  success：成功提示信息，fail：失败信息
            save(success, fail) {
                this.loading = true;
                console.log(this.formModel)
                this.$axios.post("/pms/QisZytj/saveOrUpdate", this.formModel)
                    .then(result => {
                        this.visible = false
                        this.$message.success(success)
                        this.refresh();
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            //选中一行进行编辑
            edit(row) {
                this.title = '编辑职业体检台账';
                this.visible = true;
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                })
                console.log(row)
                //this.getFjData(row);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisZytj/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取单个失败！")
                    })
            },
            //选中一行进行删除
            delete0(row) {
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.$axios.post("/pms/QisZytj/remove", this.formModel)
                        .then(result => {
                            this.$message.success('删除成功！')
                            this.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败！")
                        })
                        .finally(_ => {
                            this.loading = false
                        })
                })

            },


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
