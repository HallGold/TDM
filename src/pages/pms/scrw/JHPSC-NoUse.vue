<template>
    <div class="ice-container">
        <el-tabs class="height" type="border-card" v-model="tabName" @tab-click="handleClick">
            <el-tab-pane class="height" label="基本信息" name="baseInfo">
                <JHPSCBaseInfo
                               :oid-jh="oidJh"
                               :current-jh="currentJh"
                               :jh-data="jhData">
                    <template slot="grid-bar-button-group">
                        <el-button-group style="margin-right: 10px">
                            <el-button type="warning">当前综合计划<i class="el-icon-d-arrow-right"></i></el-button>
                            <el-select v-model="oidJh" @change="jhChange">
                                <el-option
                                        v-for="item in jhData"
                                        :key="item.oid"
                                        :label="item.jhname"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-button-group>
                    </template>
                </JHPSCBaseInfo>
            </el-tab-pane>
            <el-tab-pane label="时间节点">

            </el-tab-pane>
            <el-tab-pane label="生产数量">

            </el-tab-pane>
            <el-tab-pane label="进度安排">

            </el-tab-pane>
            <el-tab-pane label="产品要求（图样）" name="productInfo">
                <JHPSCProductInfo
                                  :oid-jh="oidJh"
                                  :current-jh="currentJh"
                                  :jhpc-data="jhpcData"
                                  :oid-pjh-list="oidPjhList">
                    <template slot="grid-bar-button-group">
                        <el-button-group style="margin-right: 10px">
                            <el-button type="warning">当前综合计划<i class="el-icon-d-arrow-right"></i></el-button>
                            <el-select v-model="oidJh" @change="jhChange">
                                <el-option
                                        v-for="item in jhData"
                                        :key="item.oid"
                                        :label="item.jhname"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-button-group>
                    </template>
                </JHPSCProductInfo>
            </el-tab-pane>
            <el-tab-pane label="质量目标">

            </el-tab-pane>
            <el-tab-pane label="原材料/元器件名录" name="meterialInfo">
                <JHPSCMeterialInfo v-if="tabName=='meterialInfo'?true:false"
                                   :oid-jh="oidJh"
                                   :jhpc-data="jhpcData"
                                   :oid-pjh-list="oidPjhList"></JHPSCMeterialInfo>
            </el-tab-pane>
            <el-tab-pane label="质量评审项目">

            </el-tab-pane>
            <el-tab-pane label="附件">

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import JHPSCBaseInfo from "./JHPSCBaseInfo";
    import JHPSCProductInfo from "./JHPSCProductInfo";
    import JHPSCMeterialInfo from "./JHPSCMeterialInfo";

    export default {
        name:'jhpsc',
        components: {JHPSCBaseInfo,JHPSCProductInfo,JHPSCMeterialInfo},
        data() {
            return {
                tabName:'baseInfo',
                oidJh:this.$route.query.oid,
                currentJh:{},
                jhData:[],
                jhpcData:[],
                oidPjhList:''
            }
        },
        methods:{
            //切换tab标签事件
            handleClick(tab) {
                this.tabName=tab.paneName;
            },
            //获取综合计划信息
            getJhglListAll(){
                this.$axios.get(`/pms/Jhgl/list?size=100&current=1`,
                    {
                        params:{columns:['oid','jhname','jhcode','jhyear'],
                            staticConditions:[{column:'jhlx',exp:'=',value:'JHLX02'}],
                            conditionLink:'AND'}
                    }
                )
                    .then(result => {
                        this.jhData = result.data.records
                        if (!this.oidJh){//未选择综合计划时，默认选择第一个
                            this.jhData.some((data,index) => {//some遍历，条件为true时跳出
                                this.oidJh=data.oid
                                this.currentJh={...data}

                                /*console.log(this.currentJh);
                                console.log(this.currentJh.jhname);*/
                                return index==0
                            })
                        }
                        this.getPscByJh(this.oidJh);
                    })
                    .catch(error => {
                        this.$message.error('计划列表获取失败')
                    })
                    .finally(_=>{})
            },
            //根据综合计划id获取计划批次信息
            getPscByJh(oidJh){
                this.$axios.get("/pms/JhPsc/list/query",
                    {
                        params:{columns:['oid','jhpc'],
                            staticConditions:[{column:'oidJh',exp:'=',value:oidJh}],
                            conditionLink:'AND'}
                    }).then(result => {
                        this.jhpcData=result.data;
                        let oidPjhArr=[];
                        this.jhpcData.forEach(data => {
                            oidPjhArr.push(data.oid)
                        })
                        this.oidPjhList=oidPjhArr.join(',');
                    })
                    .catch(error => {
                        this.$message.error("批次获取失败",error)
                    })
                    .finally(_ => {

                    })
            },
            //选择综合计划时的点击事件
            jhChange(val){
                this.oidJh = val
                this.getPscByJh(val)
            },
        },
        watch:{

        },
        created() {
            this.getJhglListAll()
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .height{height: 100%;}
</style>
