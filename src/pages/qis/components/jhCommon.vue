<template>
    <div>
        <ice-dialog title="选择计划" :visible.sync="jhVisible" width="1000px">
            <div>
                <ice-query-grid
                        data-url="/pms/QisJhgl/list2"
                        :columns="jhColumns"
                        chooseItem="single"
                        ref="grid"
                        :query="jhQuerys"
                        @selection-change="selectChange"
                        exportTitle="选择计划"
                ></ice-query-grid>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleAddJh">确认</el-button>
                    <el-button type="info" @click="jhVisible=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog title="获取部门执行信息" :visible.sync="bmVisible" width="1000px">
            <div>
                <ice-query-grid
                        :grid-data="tableData"
                        :columns="bmColumns"
                        chooseItem="single"
                        ref="grid"
                        :pagination="false"
                        @selection-change="selectChangeBm"
                        exportTitle="选择部门执行"
                ></ice-query-grid>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleAddBm">确认</el-button>
                    <el-button type="info" @click="bmVisible=false">关闭</el-button>
                </div>
            </div>
        </ice-dialog>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import PmsSelectTree from '../../../components/common/pms/PmsSelectTree'
    export default {
        name: "jhCommon",
        components: {
            IceQueryGrid,
            IceSelect,
            PmsSelectTree,
            IceDialog,
        },
        props: {
            jhOid: {
                default:''
            },
            jhType: {
                default: ''
            }
        },
        data() {
            return {
                // bm 执行信息
                bmVisible: false,
                tableData: [],
                bmQuerys: [
                    {type: 'input', code: 'depName', label: '执行部门', value: ''},
                    {type: 'input', code: 'zrr', label: '部门负责人', value: ''},
                    {
                        type: 'static', code: 'jhOid', exp: '=', value: () => {
                            console.log(this.formModel, 'formModel')
                            return this.formModel.jhOid;
                        }
                    },
                ],
                bmColumns: [
                    {label: "部门编码", code: "depCode", width: 100, sortable: true},
                    {label: "部门名称", code: "depName", width: 100, sortable: true},
                    {label: "负责人编码", code: "zrrCode", width: 100, sortable: true},
                    {label: "负责人名称", code: "zrr", width: 100, sortable: true},
                    {label: "执行阶段", code: "stage", width: 100, sortable: true, mapTypeCode: 'QIS_ZLJHBM_STATUS'},
                    {label: "oid", code: "oid", width: 100, sortable: true, hidden: true},
                ],
                rules: {
                    fileVersion: [{required: true, message: '请选择文件版本', trigger: 'blur'}],
                    filetype: [{required: true, message: '请选择文件类型', trigger: 'change'}],
                },
                loading: false,
                queryListFiles: [],
                // 选择计划配置项
                jhVisible: false,
                jhQuerys: [
                    {type: 'input', code: 'jhCode', label: '计划编码', value: ''},
                    {type: 'input', code: 'jhName', label: '计划名称', value: ''},
                    {
                        type: 'static', code: 'jhType', label: '计划名称', value: () => {
                            return this.jhType;
                        }
                    },


                ],
                jhColumns: [
                    {label: "计划编号", code: "jhCode", width: 100, sortable: true},
                    {label: "oid", code: "oid", width: 100, sortable: true, hidden: true},
                    {label: "计划名称", code: "jhName", width: 100, sortable: true},
                    {label: "计划类型", code: "jhType", width: 100, sortable: true, mapTypeCode: 'QIS_ZLJH_TYPE'},
                    {label: "计划状态", code: "jhStatus", width: 100, sortable: true, mapTypeCode: 'QIS_JHGL_JHZT'},
                    {label: "开始日期", code: "startDate", width: 100, sortable: true},
                    {label: "完成日期", code: "endDate", width: 100, sortable: true},
                    {label: "编辑要求", code: "jhRemark", width: 100, sortable: true},
                    {
                        label: "密级",
                        code: "dataSecretLevcode",
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                jhData: [],
                bmjhData: []
            }
        },
        methods: {
            // 选择计划展示
            showSectJh() {
                this.jhVisible = true;
            },
            selectChange(data) {
                this.jhData = data;
            },

            handleAddJh() {
                if (this.jhData.length <= 0) {
                    this.$message.error("请选择");
                    return
                }
                console.log(this.jhData, 'fdsf');
                this.$emit('jhConfirm', this.jhData);
                this.jhVisible = false;
            },
            // 编辑部门
            showSectBm() {
                this.bmVisible = true;
                this.getDeptList();
            },
            selectChangeBm(data) {
                this.bmjhData = data;
            },
            handleAddBm() {
                console.log(this.bmjhData)
                if (this.bmjhData.length <= 0) {
                    this.$message.error("请选择");
                    return
                }
                this.$emit('bmConfirm', this.bmjhData);
                this.bmVisible = false;
            },
            // 获取部门执行数据
            getDeptList() {
                let comumns = this.bmColumns.map(c => {
                    return c.code;
                })
                let staticConditions = [
                    {'column': 'jhOid', exp: '=', value: this.jhOid},
                    {'column': 'type', exp: '=', value: 0},
                    {'column': 'stage', exp: '=', value: 'ZXZT03'},
                ]
                this.$axios.get("/pms/QisJhDepRel/list", {
                    params: {
                        columns: comumns,
                        staticConditions,
                        current: 1,
                        size: 100
                    }
                }).then(result => {
                    this.tableData = result.data.records;
                }).catch(e => {
                    this.loading = false
                })
            },
        }

    }
</script>

<style scoped>

</style>