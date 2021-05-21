<template>
    <el-form>
        <ice-grid-layout :columns="1" name="附属信息">
            <el-form-item>
                <el-tabs v-model="activeName" :model="mainData" @tab-click="handleClick">
                    <el-tab-pane label="关联服务单" name="first">
                        <ice-query-grid
                                data-url="/biz/ProEvtServiceTicketRelevan/list"
                                :gridData="information"
                                @selection-change="relevan"
                                :buttons="buttons"
                                :query="queryFirst"
                                :gridAutoRefresh="true"
                                chooseItem="multiple"
                                :columns='columnsFirst'
                                ref="auxGrid">
                        </ice-query-grid>
                    </el-tab-pane>
                    <el-tab-pane label="其他工单信息" name="second">
                        <ice-query-grid
                                data-url="/biz/ProEvtWorkTicket/orderTicket"
                                :query="querySecond"
                                :gridAutoRefresh="true"
                                @selection-change="Second"
                                :columns='columnsSecond'
                                ref="grids">
                        </ice-query-grid><!--  -->
                    </el-tab-pane>
                    <el-tab-pane label="技术服务目录信息" name="third">
                        <ice-query-grid
                                :gridData="inforThird"
                                :data-url="url3"
                                :query="querythird"
                                :gridAutoRefresh="true"
                                @selection-change="third"
                                :columns='columnsThird'
                                ref="thirdGrids">
                        </ice-query-grid>
                    </el-tab-pane>
                    <el-tab-pane label="操作记录" name="fourth"><!--/biz/ProEvtServiceTicketLog/list-->
                        <ice-query-grid
                                :data-url="url4"
                                :query="queryFourth"
                                :gridAutoRefresh="true"
                                @selection-change="fourth"
                                :columns='columnsFourth'
                                ref="daGrid">
                        </ice-query-grid>
                    </el-tab-pane>

                </el-tabs>

            </el-form-item>
            <el-dialog v-dialogDrag title="关联" custom-class="ice-dialog" center
                       :visible.sync="Visible5"
                       width="1200px" append-to-body :close-on-click-modal="false">
                <relevance @selection-change="child"></relevance>
                <el-form-item label-width="105px" class="footer">
                    <el-button type="primary" @click="confirmWith()">确定
                    </el-button>
                    <el-button type="info" @click="close()">取消</el-button>
                </el-form-item>
            </el-dialog>
        </ice-grid-layout>
    </el-form>
</template>

<script>
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid';
    import relevance from "./relevance";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";

    export default {
        name: "subsidiaryMessage",
        props: {
            mainData: {},
            serviceTicket: String,
            workTicket: String,
            catalogId: String,
        },
        components: {
            IceEditableTableColumn,
            IceGridLayout, IceEditableTable, IceQueryGrid, relevance
        },
        data() {
            return {
                inforThird:[],
                flag1:true,
                flag: false,
                url4:"",
                serviceTicketData:[],
                workStatusData: "",
                opinionData: "",
                empty: null,
                url3: "",
                third: [],
                information: [],
                Visible5: false,
                Second: [],
                fourth: [],
                delSum:[],
                columnsFirst: [
                    {code: 'oid', hidden: true},
                    {label: '服务单号', code: 'serviceTicket'},
                    {label: '状态', code: 'serviceStatus', mapTypeCode: 'serviceStatus'},
                    {label: '用户事件描述', code: 'description'},
                ],
                columnsSecond: [
                    {label: '单号', code: 'afNo'},
                    {label: '操作人', code: 'engineerName'},
                    {label: '事件起因', code: 'reason'},
                    {label: '处理过程', code: 'measure'},
                    {label: '操作时间', code: 'gmtCreate'},
                ],

                columnsThird: [
                    {label: '区域', code: 'areaName'},
                    {label: '服务大类', code: 'parentName'},
                    {label: '服务分类', code: 'categoryName'},
                    {label: '服务项', code: 'catalogName'},
                    {label: '技术手册', code: 'manual'},
                ],
                queryFirst: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.mainData.serviceTicket;
                        }
                    },
                ],
                queryFourth: [],
                querySecond: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.mainData.serviceTicket;
                        }
                    },
                    {
                        type: 'static', code: 'workTicket', exp: '!=', value: () => {
                            return  this.mainData.workTicket;
                        }
                    },
                ],
                columnsFourth: [
                    {label: '操作类型', code: 'operationType', mapTypeCode: 'ServiceOperateType'},
                    {label: '原因', code: 'reason'},
                    {label: '说明', code: 'detail'},
                    {label: '确认人', code: 'creatorName'},
                    {label: '确认时间', code: 'gmtCreate'},
                ],
                querythird: [],
                buttons: [],
                activeName: 'first',
            }
        },
        methods: {
            /*刷新第一个关联服务单*/
            refFirst(){
                this.$refs.auxGrid.refresh();
            },
            handleClick() {
                if (this.activeName == "first") {
                    this.$refs.auxGrid.refresh();
                } else if (this.activeName == "second") {
                    this.$refs.grids.refresh();
                } else if (this.activeName == "third") {
                    if(this.flag1){
                        this.url3 = "biz/ProEvtServiceTicket/searchTech";
                        this. querythird= [
                            {type:'static',code:"serviceTicket",exp:'=',value:()=>{
                                    return  this.mainData.serviceTicket
                                }}
                        ];
                        this.flag1 = !this.flag1;
                    }else{
                        this.$refs.thirdGrids.refresh();
                    }
                } else if (this.activeName == "fourth") {
                    if (!this.flag){
                        this.url4 = "/biz/ProEvtServiceTicketLog/list";
                        this. queryFourth= [
                            {
                                type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                                    return this.mainData.serviceTicket;
                                }
                            },
                        ];
                        this.flag = !this.flag;
                    }else{
                        this.$refs.daGrid.refresh();
                    }
                }
            },
            /*保存，关联弹窗中的保存*/
            confirmWith() {
                let selectArr = [];
                if (this.arr.length != "0") {
                    for (let i = 0; i < this.arr.length; i++) {
                        selectArr.push(this.arr[i].serviceTicket);
                    }
                    if (selectArr.indexOf(this.mainData.serviceTicket) == "-1") {
                        this.$axios.post("biz/ProEvtServiceTicketRelevan/save", {
                            serviceTicket: this.mainData.serviceTicket,
                            serviceTicketRelevant: selectArr.join(",")
                        }).then(result => {
                            this.arr = [];
                            selectArr = [];
                            this.$message.success("关联成功！");
                            this.$refs.auxGrid.refresh();
                        });
                    } else {
                        this.$confirm('不可以关联自己！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        });
                    }
                } else {
                    this.$confirm('请选择想要关联的数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                }
                this.Visible5 = false;

            },
            relevan(row) {
                this.delArr = row
            },
            refresh(data) {
                if (data) {
                    this.workStatusData = data.workStatus;
                    this.opinionData = data.opinionData;
                    if (this.workStatusData == 1) {
                        if (this.opinionData !== "1") {
                            this.buttons = [
                                {
                                    name: '关联', icon: 'el-icon-plus', type: 'primary', callback: () => {
                                        this.rel()
                                    }
                                },
                                {
                                    name: '删除', icon: 'el-icon-plus', type: 'primary', callback: () => {
                                        this.del()
                                    }
                                }
                            ]
                        }
                    }
                    this.$refs.auxGrid.refresh();
                    this.$refs.daGrid.refresh();
                }
            },
            child(data) {
                this.arr = data;
            },
            /*确定添加关联信息*/
            rel() {
                this.aclKeyReadonly = false;
                this.Visible5 = true;
            },
            /*取消添加关联人的信息*/
            close() {
                this.Visible5 = false;
            },
            /*保存，关联弹窗中的保存*/
            confirm() {
                let selectArr = [];
                if (this.arr.length != "0") {
                    this.$axios.post("biz/ProEvtServiceTicketRelevan/save", {
                        serviceTicket: this.serviceTicket,
                        serviceTicketRelevant: this.arr.join(",")
                    }).then(result => {
                        this.arr = [];
                        selectArr = [];
                        this.$message.success("关联成功！");
                        this.$refs.auxGrid.refresh();
                    });
                } else {
                    this.$confirm('不可以关联自己！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                    this.tableData = [];
                    this.arr = [];
                }
                this.Visible5 = false;
            },
            /* 删除关联*/
            del() {
                let _this = this;
                if (_this.delArr.length == 0) {
                    _this.$confirm('请选择数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                    _this.$refs.auxGrid.refresh();
                } else {
                    _this.$confirm('确定删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < _this.delArr.length; i++) {
                            _this.delSum.push(_this.delArr[i].oid)
                        }
                        _this.delSum = _this.delSum.join(",");
                        console.log( _this.delSum);
                        _this.$axios.delete("biz/ProEvtServiceTicketRelevan/del", {params: {id: _this.delSum}}).then(result => {
                            _this.$message.success("删除成功");
                            _this.$refs.auxGrid.refresh();
                            _this.delSum = [];
                        });
                    })
                }
                _this.$refs.daGrid.refresh();
            },
        },
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
