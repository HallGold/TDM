<template>
    <div class="ice-container">
        <el-container>
            <el-main>
                <div>
                    <span>任务总数：{{sun}}</span>
                    <span style="padding-left: 45px">已完成：{{down}}</span>
                    <span style="padding-left: 45px">执行中：{{running}}</span>
                    <span style="padding-left: 45px">未完成：{{nonexecution}}</span>
                    <!--<el-select @change="change" v-model="value" style="padding-left: 45px">-->
                        <!--<el-option value="" label="全部"></el-option>-->
                        <!--<el-option :value="zt" :label="jiexi(zt)" v-for="zt in rwztList"></el-option>-->
                    <!--</el-select>-->
                    <span style="padding-left: 45px">任务状态：</span>
                    <ice-select @changevalue="change"
                                v-model="value"
                                clearable
                                map-type-code="RWZT">
                    </ice-select>
                </div>
                <ice-query-grid
                        :data-url="dataUrl"
                        :columns="columns"
                        :gridAutoRefresh="false"
                        :query="query"
                        :operations="operations"
                        @table-change="getDataList"
                        ref="grid">
                </ice-query-grid>
                <WbsEdit ref="wbsGrid"></WbsEdit>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import WbsEdit from "../xmgl/wbsEdit";
    import {mapGetters, mapMutations} from 'vuex'
    import moment from 'moment';
    import {defineRwStatusColor, SPZT, RWZT} from "../../../utils/constant";

    // 定义任务状态颜色
    let defineXmStatusColor = defineRwStatusColor;

    export default {
        data() {
            return {
                mapTypeCode: 'RWZT',
                wbsData:{},
                dataUrl:'/pms/PmsJhXmRw/list',
                rwztList:[],
                value:'',
                sun:'',
                down:'',
                running:'',
                nonexecution:'',
                ztSelect:'',
                visible: false,
                query: [
                    {type: 'static', code: 'jhid', exp: '=', value: () => {return this.sectRow.oid}},
                    {type: 'static', code: 'rwzt', exp: '=', value: () => {return this.ztSelect}},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'rwid', hidden: true},
                    {label: '任务状态', code: 'rwzt', width: 160,mapTypeCode: 'RWZT', sortable: true, renderCell:(h, data)=>{
                            let obj = {
                                color: '#fff',
                                background: defineXmStatusColor[data.row.rwzt],
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '2px'
                            }
                            return <span style={obj}>{this.datamap?this.datamap[data.row.rwzt]:''}</span>
                        }},
                    {label: '项目名称', code: 'xmname', width: 200, sortable: true},
                    {label: '项目编码', code: 'xmcode', width: 180, sortable: true},
                    {label: '任务名称', code: 'rwname', width: 200, sortable: true},
                    {label: '责任人', code: 'rwfzr', width: 140, sortable: true},
                    {label: '计划开始日期', code: 'dateJhStar', width: 190, formatter(row) {
                            return row.dateJhStar?moment(row.dateJhStar).format('YYYY-MM-DD'):'';
                        }
                    },
                    {label: '计划结束日期', code: 'dateJhEnd', width: 190, formatter(row) {
                            return row.dateJhEnd?moment(row.dateJhEnd).format('YYYY-MM-DD'):'';
                        }},
                    {label: '工期(天)', code: 'rwgq', width: 60},
                    {
                        label: '密级',
                        code: 'dataSecretLevcode',
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },

                ],
                operations: [
                    {name: '详情', callback: this.details, ctrlCode: "BCKRWXQ"},
                ]
            }
        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            change(data){
                this.ztSelect = data
                this.$refs.grid.refresh();
            },
            // 解析编码
            jiexi (o) {
                return this.datamap[o];
            },
            async details(row) {
                await this.$axios.get("/pms/PmsWbs/getPmsWbs", {params: {id: row.rwid}})
                    .then(result => {
                         this.wbsData = result.data;
                    })
                this.$refs.wbsGrid.getPeripheralParams("详情", this.wbsData)
            },
            getDataList (data) {
                let arr = [];
                this.down = ''
                this.running = ''
                this.nonexecution = ''
                let a = 0;
                let b = 0;
                let c = 0;
                this.sun = data.length;
                for(let i=0;i<data.length;i++){
                    //装载下拉数据
                    arr.push(data[i].rwzt)


                    if(data[i].rwzt == RWZT.WC){
                        a++;
                        this.down = a;
                    }
                    if(data[i].rwzt == RWZT.ZXZ){
                        this.running = ++b;
                    }
                    if(data[i].rwzt == RWZT.WXF){
                        c++
                        this.nonexecution = c;
                    }
                }
                this.rwztList = new Set(arr);
                this.$emit('jhjd', {sun: this.sun, down: this.down})
            }
        },
        created(){
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
        },
        props: [
            'sectRow'
        ],
        watch: {
            sectRow() {
                this.$refs.grid.refresh();
            }
        },
        computed:{
            datamap() {
                return this.getDataMap()(this.mapTypeCode);
            }
        },
        components: {WbsEdit, IceDialog, IceQueryGrid, IceSelect}
    }
</script>

<style lang="less" scoped>
    .ullist {
        list-style: none;
        margin-top: 15px;
        li {
            margin-bottom: 10px;
            label {
                display: inline-block;
                width: 40%;
                text-align: right;
                font-size: 14px;
                color: #555;
            }
            span {
                font-size: 14px;
                margin-left: 5px;
            }
        }
    }
</style>
