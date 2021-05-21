<template>
    <div class="ice-container">
        <el-container>
            <el-aside style="position: relative;width: 350px" ref="aside">
                <j-h-g-l :parHeight="parHeight" @select="handleCallback" ref="jhGrid" :jhStatus="jhStatus"></j-h-g-l>
                <pms-project-msg Height="320px" :msgdata="msgData" :bottomButtons="bottomButtons" :label-name="labelName" :api="api" :title="title"></pms-project-msg>
            </el-aside>
            <el-main style="padding: 0px;">
                <r-w_-s-e-l-e-c-t :sectRow="sectRow" @jhjd="handleCallback1"></r-w_-s-e-l-e-c-t>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTree from "../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import EditableTable from "../../../components/common/form/panels/tablePanel/EditableTable";
    import IcePersionByDeptSelector from "../../../components/common/biz/IcePersionByDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import {isLetterAndNumber} from"@/pages/biz/js/Validator";
    import RW_SELECT from "../common/RW_SELECT";
    import JHGL from "./JHGL";
    import PmsProjectMsg from "../../../components/common/pms/PmsProjectMsg";

    import {JHZT, SPZT} from "../../../utils/constant";

    export default {
        name: "TCJHGL",
        data() {
            return {
                jhStatus:'',
                jhRow:[],
                RouterState:true,
                msgData: {},
                jhObj: {},
                jhid: null,
                show:false,
                title:'计划详情',
                // 请求详情信息接口
                api: '/pms/Jhgl/get',
                // 配置详情需要展示的数据 及展示的字段
                labelName: [
                    {name: '计划类型',label: 'jhlxName'},
                    {name: '计划部门',label: 'deptName'},
                    {name: '计划负责人',label: 'jhfzr'},
                    {name: '计划进度',label: 'jhjd', isPress: true},
                    {name: '紧急程度',label: 'jjcdName'},
                    {name: '编制人',label: 'createName'},
                    {name: '编制时间',label: 'createDate'},
                    {name: '密级',label: 'dataSecretLevcodeName'}
                ],
                sectRow: {},
                bottomButtons: [
                    {text: '历史记录',callback: this.lsjl,color: '#fff',isShow: false}
                ],

                DATA_DICT_JHLX: [],
                DATA_DICT_JJCD: [],
                DATA_DICT_DATASECRET: [],
                parHeight: 0
            }
        },
        methods: {
            handleCallback (data) {

                this.bottomButtons[0].isShow = data[0].jhzt != 'JHZT10'?true:false;
                this.sectRow = data[0];
                this.getData(data[0].oid);
                this.jhRow = data
            },
            handleCallback1 (data) {
                this.$nextTick(_=>{
                    this.msgData.jhjd = Math.round(data.down/data.sun*100);
                    if (this.msgData.jhjd === 100){
                        this.jhStatus = JHZT.WC
                    }
                })
            },
            lsjl(){
                this.$axios.get("/pms/XtBpmRec/listByBoid", {params: {boid: this.msgData.oid}})
                    .then(result => {
                        console.log(result.data);
                        let dataId = result.data[0].bpmDataId;
                        let arr = result.data.map((c)=>{
                            return {
                                bpmName: c.bpmName,
                                bpmDataId: c.bpmDataId
                            }
                        })
                        this.$router.push({ path: '/pms/Jhgl/lsjl', query: { dataId: dataId, data: JSON.stringify(arr) }});
                        //this.$router.push('/pms/Jhgl/lsjl?dataId='+dataId);
                    })
                    .catch(error => {
                        this.$message.error("查询统筹计划流程列表失败")
                    })
                    .finally(_ => {

                    })


                //this.$router.push('/pms/Jhgl/lsjl?dataId='+this.jhRow[0].businessDataId+'&oid='+this.jhRow[0].oid);
            },
            // 获取数据
            getData(oid){
                this.loading = true;
                this.$axios.get(this.api, {params: {id: oid}})
                    .then(result => {
                        this.msgData = result.data;



                        this.loading = false;
                        this.DATA_DICT_JHLX.map(o => {
                            if (o.code == this.msgData.jhlx) {
                                this.msgData.jhlxName = o.name;
                            }
                        })
                        this.DATA_DICT_JJCD.map(o => {
                            if (o.code == this.msgData.jjcd) {
                                this.msgData.jjcdName = o.name;
                            }
                        })
                        this.DATA_DICT_DATASECRET.map(o => {
                            if (o.code == this.msgData.dataSecretLevcode) {
                                this.msgData.dataSecretLevcodeName = o.name;
                            }
                        })
                    })
                    .catch(error => {
                        // this.$message.error("获取失败")
                    })
            }
        },
        watch: {
            $route(old,newVal){
                if(old.path === "/pms/jhgl/tcjhgl" && newVal.path === "/pms/jhgl/jhgl_add_flow"){
                    this.$nextTick(_=>{
                        this.$refs.jhGrid.refresh();
                    })
                }
                if(old.path === "/pms/jhgl/tcjhgl" && newVal.path ==="/pms/jhgl/JhglChangeFlow"){
                    this.$nextTick(_=>{
                        this.$refs.jhGrid.refresh();
                    })
                }
            }
        },
        created () {
            this.$axios.get("permission/dataDictionary/listByActType?typeCodes=JHLX10,JJCD,DATA_SECRET_LEVEL")
                .then(result => {
                    result.data.map(o => {
                        if (o.code == 'JHLX10') {
                            this.DATA_DICT_JHLX = o.appDataList;
                        }else if (o.code == 'JJCD') {
                            this.DATA_DICT_JJCD = o.appDataList;
                        }else if (o.code == 'DATA_SECRET_LEVEL') {
                            this.DATA_DICT_DATASECRET = o.appDataList;
                        }
                    })
                })
                .catch(error => {
                    this.$message.error("查询字典数据失败")
                })

        //
          this.$nextTick(_=>{
            console.log(this.$refs.aside)
            console.log(this.$refs.aside.$el.offsetHeight - 360)
            this.parHeight = this.$refs.aside.$el.offsetHeight - 360
          })

        },
        components: {
            PmsProjectMsg,
            RW_SELECT,
            JHGL,
            IcePopSelector,
            IcePersionSelector,
            IcePersionByDeptSelector,
            EditableTable,
            IceDeptSelector,
            IceTree,
            IceSelect,
            IceDialog, IceQueryGrid
        }
    }

</script>


<style scoped>
    /*.layout{*/
        /*width: 50%;*/
        /*height: 100%;*/
        /*position: relative;*/
        /*float: left;*/
        /*vert-align: top;*/
    /*}*/
</style>
