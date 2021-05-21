<template>
    <div class="ice-container">
        <div class="el-container">
            <el-aside width="250px" class="asideLeft">
                <div class="con_tainer">
                    <div class="years" v-if="jhData">
                        <div class="year" :class="{yearSected: index==active}" v-for="(item, index) in flowDataQuery" :key="item.bpmDataId" @click="handleClick(item.bpmDataId, index)">
                            {{item.bpmName}}
                            <div class="sanjiao"></div>
                        </div>
                    </div>
                </div>
            </el-aside>
            <el-main style="position: relative;">
                <flowModel :SJID="SJID" left-prop="255" ></flowModel>
            </el-main>
        </div>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import flowModel from "./flowModel";

    export default {
        name: "lsjl",
        components: {flowModel, IceQueryGrid},
        data () {
            return {
                SJID: '',
                active:0,
                jhData: [],
                dataId: '',
            }

        },
        methods:{
            handleClick(dataId, index){
                console.log(dataId)
                this.SJID = dataId;
                this.active = index;
            },
        },
        computed: {
            flowDataQuery () {
                return this.$route.query.data?JSON.parse(this.$route.query.data):[]
            },
        },
        created(){
            /*this.$axios.get("/pms/Jhgl/listById" ,{params: {oid: this.$route.query.oid}})
                .then(result => {
                    this.jhData = result.data
                })
                .catch(error => {
                    this.$message.error("初始化失败")
                })*/
        },
    }
</script>

<style lang="less" scoped>
    .con_tainer {
        padding: 15px;
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
                font-size: 16px;
                margin-bottom: 10px;
                color: #555;
                line-height: 30px;
                position: relative;
                &:hover{
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
    .asideLeft {
        border: 1px solid #ddd;
        box-shadow: 0px 1px 1px 1px #ddd;
    }
</style>