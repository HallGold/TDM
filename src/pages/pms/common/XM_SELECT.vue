<template>
    <div class="ice-container">
        <ice-query-grid
                :chooseItem="chooseItem"
                data-url="/pms/Xminfo/list"
                :operations-width="200"
                :columns="columns"
                :query="query"
                @selection-change="select"
                ref="grid1">
        </ice-query-grid>
        <el-footer>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="back">关闭</el-button>
            </div>
        </el-footer>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment'

    export default {
        components: {IceSelect, IceDialog, IceQueryGrid},
        data() {
            return {
                loading: false,
                query: [
                    {type: 'input', code: 'xmname', label: '项目名称'},
                    {type: 'input', code: 'xmcode', label: '项目编号'},
                    {type: 'static', code: 'xmzt', value: 'XMZT30,XMZT31,XMZT32,XMZT33', exp: 'in'},
                    {
                        type: 'static', code: 'dataSecretLevcode', value: () => {
                            let str = [];
                            let se = this.dataSecretLevcode ? this.dataSecretLevcode : 4;
                            for (let i = 1; i <= se; i++) {
                                str.push(i);
                            }
                            return str.join(",");
                        }, exp: 'in'
                    },
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: "项目名称", code: "xmname"},
                    {label: "所内项目编号", code: "xmcode", width: 120},
                    {label: "所外项目编号", code: "xmcodeSw", width: 120},
                    {label: '项目密级', code: 'dataSecretLevcode', width: 80, mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "项目状态", code: "xmzt", width: 80, mapTypeCode: 'XMZT'},
                    {label: "项目类别", code: "xmlb", width: 80, mapTypeCode: 'XMLB'},
                    {label: "学科方向", code: "xmxkfx", width: 80, mapTypeCode: 'XMXKFX'},
                    {label: "业务主管部门", code: "xmzgbm", width: 110},
                    {label: "责任单位", code: "orgname", width: 80},
                    {label: "上报状态", code: "sbzt", width: 80, mapTypeCode: 'SBZT'},
                    // {label: "审批结果", code: "dateRemark", width: 80, mapTypeCode: 'SPJG'},
                    {label: "项目目标", code: "xmmb", width: 80},
                    {label: "经费合计(元)", code: "ysjfhj", width: 80},
                    {label: "全时人力投入", code: "rltr", width: 120},
                    {
                        label: "立项日期", code: "gmtLx", width: 80, formatter(row) {
                            return moment(row.dateCreate).format('YYYY-MM-DD');
                        }
                    },
                    // {label: "预算号", code: "yscode", width: 80}
                ],
                items: []
            }
        },
        props: {
            chooseItem: {
                default: 'multiple'
            },
            xmlx: {
                default: ''
            },
            dataSecretLevcode: {
                default: 5
            }
        },
        methods: {
            select(item) {
                this.items = item;
            },
            confirm() {
                this.$emit("select", this.items);
                this.back();
            },
            back() {
                this.$emit('closeVisible');
            },
            // 清空选中
            handleCleanColumnSelect() {
                this.$refs.grid1.cleanColumnSelect();
            },
            refresh () {
                this.$refs.grid1.refresh();
            }
        }
        ,
        computed: {}
        ,
        watch: {
            xmlx() {
                if (this.xmlx) {
                    this.query.push({type: 'static', code: 'xmlx', exp: '=', value: this.xmlx})
                }
            }
        }
        ,
        created() {
            if (this.xmlx) {
                this.query.push({type: 'static', code: 'xmlx', exp: '=', value: this.xmlx})
            }
        },
        mounted() {

        }
        ,
    }

</script>

<style scoped>

</style>