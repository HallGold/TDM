<template>
    <div class="ice-container">
        <div>
            <el-input placeholder="请选择生产项目" v-model="xmname" readonly style="width: 500px">
                <template slot="prepend">选择生产项目<i class="el-icon-d-arrow-right"></i></template>
                <el-button slot="append" icon="el-icon-search" @click="showProjectDialog"></el-button>
            </el-input>
        </div>

        <el-container>
            <el-header height="260px" style="padding: 0px; margin: 5px 0px;">
                <el-container style="height: 100%;">
                    <el-aside width="50%" style="height: 100%; margin-right: 5px; border: 1px solid #ccc;">
                        <SCJH :oid-xm="oidXm" @select="scjhCallback"></SCJH>
                    </el-aside>
                    <el-main style="padding: 0px; margin-left: 5px; border: 1px solid #ccc;">
                        <SCPC :oid-scjh="oidScjh" @select="scpcCallback"></SCPC>
                    </el-main>
                </el-container>
            </el-header>
            <el-main style="padding: 0px;">
                <SCPC_CP :oid-pjh="oidPjh" @select="scpccpCallback"></SCPC_CP>
            </el-main>
        </el-container>

        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @select="selectProject"></XM_SELECT>
        </ice-dialog>

        <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="30%">
            <SCPC_CP_GX :oid-cpk="oidCpk"></SCPC_CP_GX>
        </el-drawer>
    </div>
</template>

<script>
    import PmsProjectTree from "../../../components/common/pms/PmsProjectTree";
    import SCJH from "./SCJH";
    import SCPC from "./SCPC";
    import SCPC_CP from "./SCPC_CP";
    import SCPC_CP_GX from "./SCPC_CP_GX";
    import CPK from "../common/CPK";
    import IceDialog from "../../../components/common/base/IceDialog";
    import XM_SELECT from "../common/XM_SELECT";
    export default {
        name: "SCJH_MANAGER",
        components: {XM_SELECT, IceDialog, CPK, SCPC_CP_GX, SCPC_CP, SCPC, SCJH, PmsProjectTree},
        data () {
            return {
                conceal: [],
                oidXm: null,
                oidScjh: null,
                oidPjh: null,
                oidCpk: null,
                visibleProject: false,
                xmname: '',

                drawer: false,
            }
        },
        methods: {
            // 自定义树控件返回数据方法
            handleCallback(data) {

                console.log("生产计划管理页面", data)

                this.oidXm = data.oid;
                //this.projectDataVo = data;
            },
            scjhSelect(item) {
                console.log("生产计划返回数据", item)
                //this.formModel.jhyear = item[0].year;
                //this.formModel.jhname = item[0].jhname;
                //this.formModel.jhcode = item[0].jhcode;
                //this.oidScjhQuery = item[0].oid;
                //this.$refs.grid.refresh();
            },
            scjhCallback (data) {
                this.oidScjh = data.oid;
            },
            scpcCallback (data) {
                this.oidPjh = data.oid;
            },
            scpccpCallback (data) {

                console.log(12312312)

                this.oidCpk = data.oid;
                this.drawer = true;
            },
            showProjectDialog () {
                this.visibleProject = true;
            },
            selectProject(item) {
                this.xmname = item[0].xmname;
                this.oidXm = item[0].oid;
                this.visibleProject = false;
            },
        }
    }
</script>

<style scoped>

</style>