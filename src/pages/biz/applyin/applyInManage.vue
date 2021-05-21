<template>
    <div style="width: 100%">
        <ice-query-grid
                data-url="biz/applyIn/list"
                :columns=columns
                :buttons=buttons
                :query=query
                :operations=options
                chooseItem="single"
                @selection-change="select"
                title="要害部位管理-授权进入管理"
                ref="mainQG"
        ></ice-query-grid>
        <!--查看弹窗-->
        <ice-dialog v-dialogDrag title="查看" center :visible.sync="VisibleLook"
                    width="1000px" height="500px" append-to-body :close-on-click-modal="false" remounted>
            <look-this :lookData="lookData"></look-this>
            <div slot="footer">
                <el-button type="primary" @click="print" icon="el-icon-printer">打印</el-button>
                <el-button type="info" @click="cloose" icon="el-icon-close">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import AddNew from "./addNew";
    import LookThis from "./comm/lookThis";
    import bus from "./comm/bus.js";
    import positionComm from "./position/positionComm.js"

    export default {
        name: "applyInManage",
        components: {LookThis, AddNew, IceDialog, IceQueryGrid, bus},
        mixins: [positionComm],
        data() {
            return {
                lookData: [],
                VisibleAdd: false,
                optForMsg: [],
                VisibleLook: false,
                newOne: "false",
                columns: [
                    {label: '申请编号', code: 'applyNum',width:120},
                    {label: '申请人', code: 'applyName',width:100},
                    {label: '申请人code', code: 'applyId', hidden: true},
                    {label: '所在单位', code: 'applyUnit',width:95},
                    {label: '部位名称', code: 'name',},
                    {label: '受控类型', code: 'manageType',width:90, mapTypeCode: "controlledType"},
                    {label: '部位类型', code: 'type',width:90, mapTypeCode: "specificType"},
                    {label: '申请进入时间', code: 'createTime',},
                    {label: '陪同人', code: 'escort',width:100},
                    {label: '是否进入', code: 'isInto', mapTypeCode: "YES_NO",width:80},
                    {label: '实际进入时间', code: 'actualIntoDate',},
                    {label: '实际离开时间', code: 'actualOutDate',},
                    {label: '申请进入部位', code: 'inLocation', hidden: true},
                ],
                buttons: [
                    {
                        name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addNew
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.detMsg
                    },
                    {
                        name: '查看', icon: 'el-icon-search', type: 'primary', callback: this.lookThis
                    },
                    {
                        name: '导出', icon: 'el-icon-upload2', type: 'export',
                    },
                ],
                query: [
                    {type: 'input', label: '申请编号', code: 'applyNum', value: '',},
                    {type: 'input', label: '申请人', code: 'applyName', value: '',},
                    {type: 'input', label: '所在单位', code: 'applyUnit', value: '',},
                    {type: 'input', label: '部位名称', code: 'isContact', value: '',},
                    {type: 'input', label: '部位类型', code: 'type', value: '',},
                    {type: 'date', label: '申请进入时间(开始)', code: 'createTime', value: '', exp: ">=",compare:1},
                    {type: 'date', label: '申请进入时间(结束)', code: 'createTime', value: '', exp: "<=",compare:2},
                    {type: 'input', label: '陪同人', code: 'escort', value: '',},
                    {type: 'select', label: '是否进入', code: 'isInto', value: '', mapTypeCode: "YES_NO"},
                ],

                options: [
                    {
                        name: '详情',
                        type: "primary",
                        callback: this.detail,
                        dbclick: true
                    },
                ],
            }
        },
        methods: {
            /**新增*/
            addNew() {
                this.$router.push("applyInManage/addNew");
            },
            /**保存*/
            save() {
                this.$refs.dangerMessage.isTrue()
                if (this.$refs.dangerMessage.isTrue() == true) {
                    this.VisibleAdd = false;
                }
            },
            /**取消*/
            cancel() {
                this.VisibleAdd = false;
            },
            /**查看*/
            lookThis() {
                if (this.optForMsg.length == "0") {
                    this.$confirm("请选择要查看的的信息!", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    this.VisibleLook = true;
                }
            },
            /**删除*/
            detMsg() {
                if (this.optForMsg.length != 0) {
                    this.$confirm("是否确定要删除该信息！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete('/biz/applyIn/del', {params: {id: this.optForMsg[0].oid}}).then(result => {
                            this.$message.success("删除成功");
                            this.$refs.mainQG.refresh();
                            this.optForMsg = [];
                        });
                    });
                } else {
                    this.$confirm("请选择一条你要删除的信息！", "提示")
                }

            },
            /**操作列详情*/
            detail(row) {
                this.$router.push("/biz/applyin/applyInManage/addNew?dataId=" + row.oid + "&button=look");
            },
            /**关闭*/
            cloose() {
                this.VisibleLook = false;
                this.lookData = [];
            },
            /**打印*/
            print() {
                this.lookData = [];
                this.VisibleLook = false;
            },
            /**选中数据*/
            select(row) {
                this.optForMsg = row;
                this.lookData = row;
            },
        },
    }
</script>

<style scoped>

</style>