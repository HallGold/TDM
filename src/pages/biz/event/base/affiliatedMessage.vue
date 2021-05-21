<template>
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                <ice-grid-layout :columns="1" name="附属信息">
                        <el-tabs v-model="activeName">
                                <el-tab-pane label="关联服务单" name="first">
                                        <ice-query-grid
                                                data-url="biz/ProEvtServiceTicketRelevan/list"
                                                :columns=columns1
                                                :buttons="buttons"
                                                :query="query1"
                                                ref="grid">
                                        </ice-query-grid>

                                </el-tab-pane>
                                <el-tab-pane label="操作记录" name="second">
                                        <ice-query-grid
                                                data-url=""
                                                :columns="columns2"
                                                ref="grid">
                                        </ice-query-grid>
                                </el-tab-pane>
                        </el-tabs>
                        <!--关联弹窗-->
                        <el-dialog v-dialogDrag title="关联" custom-class="ice-dialog" center :visible.sync="Visible"
                                   width="1200px" append-to-body :close-on-click-modal="false">
                                <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                                        <ice-query-grid
                                                :data-url="url"
                                                :columns="columns3"
                                                :query="query"
                                                :gridData="information"
                                                chooseItem="multiple"
                                                @selection-change="select"
                                                ref="grid">
                                        </ice-query-grid>
                                </div>
                               <el-form-item label-width="105px" class="footer">
                                       <el-button type="primary" @click="confirm">确定</el-button>
                                       <el-button type="info" @click="close">取消</el-button>
                               </el-form-item>
                        </el-dialog>
                </ice-grid-layout>
        </div>
</template>

<script>

    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";

    export default {
        name: 'affiliatedMessage',
        data() {
            return {
                activeIndex: '1',
                devEnterNetData: {
                    detailList: []
                },
                activetime: 'all',
                activeName: 'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: true,
                transaction: false,
                Visible: false,
                information:[],
                tableData:[],
                arr:[],
                ID:"",
                service:"",
                url:"/biz/ProEvtServiceTicket/searchPageUserServTicket",
                query1:[
                    {type:'static',code:'serviceTicket',exp:'=',value:()=>{
                                        return this.service
                                    }
                                },
                ],
                layoutColumns: [],
                columns1: [

                    {label: '服务单号', code: 'serviceTicket',},
                    {label: '状态', code: 'serviceStatusName',},
                    {label: '用户描述', code: 'description',},
                ],
                columns2: [
                    {code: 'formcodeRuleid', hidden: true},

                    {label: '操作类型', code: 'serviceTicket',},
                    {label: '原因', code: 'serviceStatus',},
                    {label: '说明', code: 'userName',},
                    {label: '确认人', code: 'userLevel',},
                    {label: '确认时间', code: 'disposePerson',},
                ],
                columns3: [
                    {code: 'formcodeRuleid', hidden: true},

                    {label: '服务单号', code: 'serviceTicket',},
                    {label: '状态', code: 'serviceStatus',},
                    {label: '用户', code: 'userName',},
                    {label: '用户星级', code: 'userLevel',},
                    {label: '处理人', code: 'disposePerson',},

                    {label: '申请人', code: 'creatorName',},
                    {label: '描述', code: 'description',},
                    {label: '来源', code: 'sourceName',},
                    {label: '区域', code: 'areaShortname',},
                    {label: '业务服务名称', code: 'categoryName',},
                    {label: '服务项', code: 'catalogName',},
                    {label: '性质', code: 'servicePropertyName',},
                    {label: '申请时间', code: 'gmtCreate',},
                    {label: '关注', code: 'isFocus',},
                ],
                queryMap: {
                    '0': [
                        {type: 'input', label: '服务单号', code: 'IS_BREAKDOWN', value: '0', hidden:true}
                    ],
                },
                activeTab:"0",
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'IS_BREAKDOWN',
                        value: '0',
                        click: value => {
                            if (value == '0') {
                                this.url="/biz/ProEvtServiceTicket/searchPageUserServTicket";
                                this.columns3 = [
                                    {code: 'formcodeRuleid', hidden: true},

                                    {label: '服务单号', code: 'serviceTicket',},
                                    {label: '状态', code: 'serviceStatus',},
                                    {label: '用户', code: 'userName',},
                                    {label: '用户星级', code: 'userLevel',},
                                    {label: '处理人', code: 'disposePerson',},

                                    {label: '申请人', code: 'creatorName',},
                                    {label: '描述', code: 'description',},
                                    {label: '来源', code: 'sourceName',},
                                    {label: '区域', code: 'areaShortname',},
                                    {label: '业务服务名称', code: 'categoryName',},
                                    {label: '服务项', code: 'catalogName',},
                                    {label: '性质', code: 'servicePropertyName',},
                                    {label: '申请时间', code: 'gmtCreate',},
                                    {label: '关注', code: 'isFocus',},
                                    {type: 'input', label: '服务单号', code: 'IS_BREAKDOWN', value: '0', hidden:true}
                                ];
                            } else if (value == '1') {
                                this.url="/biz/ProEvtServiceTicket/searchPageUserServTicket";
                                this.columns3 = [
                                    {code: 'formcodeRuleid', hidden: true},

                                    {label: '服务单号', code: 'serviceTicket',},
                                    {label: '状态', code: 'serviceStatus',},
                                    {label: '用户', code: 'userName',},
                                    {label: '用户星级', code: 'userLevel',},
                                    {label: '处理人', code: 'disposePerson',},

                                    {label: '申请人', code: 'creatorName',},
                                    {label: '描述', code: 'description',},
                                    {label: '来源', code: 'sourceName',},
                                    {label: '区域', code: 'areaShortname',},
                                    {label: '业务服务名称', code: 'categoryName',},
                                    {label: '服务项', code: 'catalogName',},
                                    {label: '性质', code: 'servicePropertyName',},
                                    {label: '故障开始时间', code: 'gmtBegin',},
                                    {label: '申请时间', code: 'gmtCreate',},
                                    {label: '关注', code: 'isFocus',},
                                    {type: 'input', label: '服务单号', code: 'IS_BREAKDOWN', value: '1',hidden:true}
                                ];
                            }
                            this.$refs.grid.refresh();
                        },
                        tablist: [
                            {label: '服务申请', value: '0', name: "all"},
                            {label: '故障', value: '1'},
                        ]
                    },
                ],
                form: {
                    resource: '',
                    region: '',
                    date1: ''
                },
                buttons: [
                    {
                        name: '关联', icon: 'el-icon-plus', type: 'primary', callback:this.relevance
                    },
                    {
                        name: '删除', icon: 'el-icon-close', type: 'primary',callback:this.del
                    },
                ],
                formRules: {
                    prompt1: [{required: true, message: '请输入座机号', trigger: 'blur'}],
                    prompt2: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
                },
                formRules2: {
                    prompt1: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                }
            }
        },
        methods: {
            relevance(){
                this.aclKeyReadonly = false;
                this.Visible = true;
            },
            select(row){

                    for (let i = 0 ; i < row.length ; i++){
                       // console.log(row[i].serviceTicket) ;
                       this.arr.push(row[i].serviceTicket);
                    }
                function unique(arr) {
                    const res = new Map();
                    return arr.filter((a) => !res.has(a) && res.set(a, 1))
                }
                this.arr=unique(this.arr);
            },
            close(){
                this.Visible = false;
            },
            confirm(){
                this.tableData = this.arr;
                let judge = this.tableData.indexOf(this.serviceId);
                console.log(this.serviceId);
                this.tableData = this.tableData.join(",");
                if (judge == "-1"){

                //     /ProEvtServiceTicketRelevan/save
                    this.$axios.post("biz/ProEvtServiceTicketRelevan/save",{serviceTicket:this.serviceId,serviceTicketRelevant:this.tableData}).then(result => {
                        console.log(result.data);
                        // this.$axios.get("biz/ProEvtServiceTicketRelevan/list",{id:this.serviceId}).then(result => {
                        //     console.log(result);
                            this.columns1[1].serviceTicket = result.data.serviceTicket;
                            this.columns1[2].serviceStatusName = result.data.serviceStatusName;
                            this.columns1[3].description = result.data.description;
                        // });
                    });
                    // /ProEvtServiceTicketLog/list
                    // this.url1="biz/ProEvtServiceTicketRelevan/save";
                    // this.query1=[
                    //     {type:'static',code:'serviceTicket',exp:'in',value:()=>{
                    //             return this.serviceId
                    //         }
                    //     },
                    //     {type:'static',code:'serviceTicketRelevant',exp:'in',value:()=>{
                    //             return this.tableData
                    //         }
                    //     }
                    // ]
                    // console.log(this.query1);

                }else {
                    this.$confirm('不可以关联自己！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                    this.tableData=[];
                    this.arr = [];
                }
                this.Visible = false;
            },
            del(row){
                // if (true) {
                //     this.$confirm('确定删除操作吗?', '提示', {
                //         confirmButtonText: '确定',
                //         cancelButtonText: '取消',
                //         type: 'info'
                //     }).then(() => {
                //         this.$axios.delete('biz/ProEvtUserTicket/deleteTicket', {params: {id: row.serviceTicket}}).then(result => {
                //             this.$message.success("删除成功");
                //         }).catch(error => {
                //             this.$message.error("出错啦")
                //         })
                //     });
                // }
            }
        },
        components: {
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
        }
    }

</script>


<style scoped>
        .footer {
                width: 100%;
                margin-top: 10px;
                display: flex;
                justify-content: flex-end;
        }
</style>
