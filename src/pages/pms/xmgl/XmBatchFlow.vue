<template>
    <div class="ice-container" v-loading="loading">
        <div class="el-container">
            <el-aside width="250px" class="asideLeft">
                <div class="con_tainer">
                    <div class="years">
                        <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in xmdata"
                             :key="item.oid" @click="handleClickLeft(item, index)">
                            {{item.xmname}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-main style="padding: 0;">
                <div class="form-content" @valited="">
                    <ice-flow-form leftProp="255"  name  valiate ref="flow" :flowReady="flowReady"
                                   :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData"
                                   @callBackSuccess="handleCallbackFlow">
                        <div style="width: 90%;margin: 0 auto;padding: 10px 20px;border: 1px solid #ddd;"
                             slot-scope="flowScope">
                            <xm-form ref="xmform" :flowScope="flowScope"></xm-form>
                        </div>
                    </ice-flow-form>
                    这是内容
                </div>
            </el-main>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import XmForm from './components/XmForm'
    import xmClose from './components/xmClose'


    import {mapGetters, mapMutations} from 'vuex'

    import moment from 'moment';

    export default {
        name: "XmLookFlow",
        data() {
            return {
                active: 0,
                years: [
                    '立项记录',
                    '变更记录'
                ],
                /**
                 * 传递给流程组件的数据id
                 * */
                SJID: '',
                name: '',
                flowData: {},
                xmdata: [],
                // 判定是否加载完成呢
                loadIndex: 0,
                loading:false,
                // 需要验证不为空的字段
                rules: [
                    'xmname',
                    'xmcode',
                    'dataSecretLevcode',
                    'xmzt',
                    'xmlb',
                    'xmxkfx',
                    'sbzt',
                    'gmtLx',
                    'orgname',
                    'xmmb',
                    'xmly',
                ],
            }
        },
        computed: {
            // 行数据id
            xmdatasp() {
                if (this.$route.query.xmdata) {
                    return JSON.parse(this.$route.query.xmdata)
                } else {
                    return '';
                }
            },
            flowDataQuery() {
                return this.$route.query.data ? JSON.parse(this.$route.query.data) : []
            },
            // 请求次数
            resquestNum () {
                return this.xmdatasp.length*5
            },
        },
        watch:{
            xmdatasp () {
                this.xmdata = this.xmdatasp;
            },
            loadIndex () {
                // 加载完成赋值，和关闭加载
                if (this.resquestNum == this.loadIndex) {
                    this.loading = false;
                    this.$nextTick(_=>{
                            this.$refs.xmform.handleCallbackFlow(this.xmdata[0]);
                    })
                }
            }
        },
        created () {
            this.xmdata = this.xmdatasp;

        },
        methods: {
            getXmdataJh () {
                this.loading = true;
                this.xmdata.forEach((c, index)=>{
                    this.getRowData(c.oid, index)
                })
            },
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'bizdata')
                //流程初始化
                if (bizdata.oid) {
                    this.xmdata = bizdata.xminfos;
                    this.$nextTick(_=>{
                        this.$refs.xmform.handleCallbackFlow(this.xmdata[0]);
                    })
                } else {
                    this.getXmdataJh();
                }

            },
            flowOperateBtn(flowContext, bizdata) {
                // 数据整理
                let datashow = this.$refs.xmform.getBatchData();
                this.xmdata[this.active] = datashow;
                let f = this.yzEmpty();
                let b = this.yzCon();
                if (!f) {
                    return false;
                }
                if (!b) {
                    this.$message.error('有数据没有项目风险或者项目输入！')
                    return false;
                }
                //按钮操作事件
                return true;
            },
            flowBizData() {
                // 赋值展示数据
                let data = JSON.parse(JSON.stringify(this.xmdata));
                console.log(data, '执行到这里了')
                // 传递数据整合
                data.map(c=>{
                    let fx = c.pmsXmFxList;
                    let newfxsj = [];
                    fx.forEach((c) => {
                        let obj = {
                            xmfxzzr: c.xmfxzzr,
                            xmfxgbcs: c.xmfxgbcs,
                            pmsFxqd: c,
                            deleteStatus: c.deleteStatus,
                            oid: c.oidxmfx ? c.oidxmfx : ''
                        }
                        newfxsj.push(obj);
                    })
                    c.pmsXmFxList = newfxsj;

                })
                console.log(data, '执行到这里了data')
                let obj = {
                    xminfos: data
                }
                // return
                return obj;
            },
            // 验证不为空
            yzEmpty () {
                let b = true;
                this.xmdata.forEach(c=>{
                    this.rules.forEach(r=>{
                        if (!c[r]||c[r]==undefined||c[r]==null) {
                            b = false
                        }
                    })
                })
                return b;
            },
            // 验证风险或者输入有内容
            yzCon () {
                let b = true;
                this.xmdata.forEach(c=>{
                    let visiblesr = c.xtFjListXmsr.filter(c=>{
                        return c.version != -1;
                    })
                    if (c.isConSr&&visiblesr.length<=0) {
                        b = false;
                    }
                    let visiblefx = c.pmsXmFxList.filter(c=>{
                        return c.deleteStatus != 1;
                    })
                    if (c.isConFx&&visiblefx.length<=0) {
                        b = false;
                    }

                })
                return b;
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                if (this.name!='项目收尾') {
                    this.$refs.xmform.handleCallbackFlow(data);
                }
            },
            // handleClickYear
            handleClickLeft(row, index) {
                console.log(row)
                let data = this.$refs.xmform.getBatchData();
                console.log(data, 'data1565615611');
                this.xmdata[this.active] = data;
                this.active = index;
                this.$refs.xmform.handleCallbackFlow(row);
                console.log(this.xmdata, 'xmdata')
            },
            // 获取信息
            async getRowData (oid, index) {
                await this.getBasicMsg(oid, index)
                this.getListXmsrData(oid, index);  //获取当前行的项目信息主键OID --查询项目输入
                this.getListXmcyData(oid, index)   //获取当前行的项目信息主键OID --查询项目成员
                this.getEditContractList(oid, index);//获取当前行的项目信息主键OID --查询合同
                this.getListFzqd(oid, index);//获取风险清单
            },
            // 项目基本信息查询
            getBasicMsg(xmOid, index) {
                this.$axios.get("/pms/Xminfo/queryListXminfoaData", {params: {oid: xmOid}})
                    .then(result => {

                        this.xmdata[index] = {...result.data[0]};
                        this.xmdata[index].isConFx = true;
                        this.xmdata[index].isConSr = true;
                        this.loadIndex++;
                    })
                    .catch(error => {
                        this.$message.error("获取项目基本数据失败！")
                    })
            },
            /**
             * ---------------------------------------项目输入输出附件上传下载----------
             */
            //获取项目输入,添加附件数据
            getListXmsrData(xmOid, index) {
                this.$axios.get("pms/XtFj/querylistByOidXmsrFj", {params: {bOid: xmOid}})
                    .then(result => {
                        this.xmdata[index].xtFjListXmsr = result.data;
                        this.loadIndex++;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            /**
             * ----------------------------------项目成员------------------------------
             */

            //获取项目列表数据
            getListXmcyData(oidXm, index) {
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.xmdata[index].pmsXminfoCyList = result.data;
                        this.loadIndex++;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            // 获取编辑时的合同
            getEditContractList(xmOid, index) {
                this.$axios.get("/pms/Xminfo/querylistByOidXmht", {params: {oid: xmOid}})
                    .then(result => {
                        this.xmdata[index].pmsHtinfoList = result.data;
                        this.loadIndex++;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            //获取项目风险数据
            getListFzqd(oidXm, index) {
                this.$axios.get("pms/Xminfo/querylistByOidXmfx", {params: {oid: oidXm}})
                    .then(result => {
                        this.xmdata[index].pmsXmFxList = result.data;
                        this.loadIndex++;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
        },
        components: {
            IceFlowForm,
            XmForm,
            xmClose
        }
    }
</script>

<style lang="less" scoped>
    .form-content {
        position: relative;
        height: 100%;
    }

    .asideLeft {
        border: 1px solid #ddd;
        box-shadow: 0px 1px 1px 1px #ddd;
    }

    .con_tainer {
        padding: 15px;
        overflow: auto;
        button {
            font-size: 20px;
            line-height: 25px;
            span {
                color: #666;
                font-size: 16px;
                vertical-align: top;
            }
            i {
                color: #59fb22;
                display: inline;
            }
        }
        .years {
            margin-left: 10px;
            margin-top: 20px;
            .year {
                padding-left: 20px;
                font-size: 14px;
                margin-bottom: 10px;
                color: #555;
                line-height: 30px;
                position: relative;
                cursor: pointer;
                &:hover {
                    background: rgba(0, 209, 108, 0.5);
                }
                .sanjiao {
                    position: absolute;
                    right: -15px;
                    width: 0;
                    height: 0;
                    border-top: 15px solid transparent;
                    border-right: 0;
                    border-bottom: 15px solid transparent;
                    border-left: 15px solid #00D1B2;
                    top: 0;
                    display: none;

                }
            }
            .yearSected {
                background: #00D1B2;
                color: #eeeeee;
                .sanjiao {
                    display: block;
                }
            }
        }
    }

    .form-content /deep/ .operation-area {
        left: 455px;
    }
</style>