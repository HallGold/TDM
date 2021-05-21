<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/ResMsg/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                :operations-width="200"
                ref="grid"
                exportTitle="消息通知"
        >
            <div slot="operation-bar-expand" style="margin-left: 15px;font-size: 14px;color: red;">
                (非涉密表单请勿填写涉密信息)
            </div>
        </ice-query-grid>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="消息标题" label-width="110px" prop="msgTitle">
                            <el-input v-model="formModel.msgTitle" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="是否全部发送" label-width="110px">
                            <el-radio-group v-model="formModel.isAll">
                                <el-radio :label="0">否</el-radio>
                                <el-radio :label="1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第一行-->
                <el-row :gutter="20" v-if="this.formModel.isAll!=1">
                    <el-col :span="24">
                        <el-form-item label="接收人" label-width="110px" prop="userCodeTo">
                            <ice-persion-selector chooseItem="multiple" mode="onlySelect"
                                                  :mode="disabled?'readonly':'onlySelect'"
                                                  v-model="formModel.userCodeTo"
                                                  @select-confirm="depts=>formModel.receiveUsers=depts">
                            </ice-persion-selector>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第六行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="消息内容" label-width="110px" prop="msgContent">
                            <el-input :disabled="disabled" v-model="formModel.msgContent" placeholder="简要描述填写不超过500个字"
                                      type="textarea" :rows="5">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="primary" v-if="!disabled" @click="conserve" ctrlCode="confirm"
                                   :disabled="disabled">保存
                        </el-button>
                        <el-button type="info" @click="handleClose" ctrlCode="return">返回</el-button>
                    </div>
                </el-row>
            </el-form>
        </ice-dialog>
        <!--详情-->
        <ice-dialog title="消息通知" :visible.sync="msgvisible" width="800px">
            <el-form>
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="消息标题：" label-width="110px">
                            {{msgDetail.msgTitle}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="发送人：" label-width="110px">
                            {{msgDetail.userCodeFrom}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="接收人：" label-width="110px">
                            {{msgDetail.userCodeTo}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第六行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="消息内容：" label-width="110px">
                            <div style="border: 1px solid #ddd;min-height: 100px;max-height: 300px;overflow: auto;padding: 0 20px;">
                                {{msgDetail.msgContent}}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="info" @click="msgvisible=false" ctrlCode="return">返回</el-button>
                    </div>
                </el-row>
            </el-form>
        </ice-dialog>
    </div>
</template>

<script>
    //安全论证申报业务页面
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import qisVxeColumns from '@/pages/basePage/VxeColumns'
    import {mapGetters, mapMutations} from 'vuex';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";


    export default {
        name: "aqlzsb",
        components: {
            IceQueryGrid, qisVxeColumns, IceSelect, IceDeptSelector, IcePersionSelector
        },

        data() {
            return {
                //默认模态框标题为空
                title: '',
                queryListXmsc: [],
                //默认模态框状态为“关闭”
                visible: false,
                //加载动态转圈
                loading: false,

                disabled: true,

                //查询
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'sr',
                        value: '0',
                        tablist: [
                            {label: '全部', value: '2'},
                            {label: '我发送的', value: '0'},
                            {label: '我接受的', value: '1'}
                        ]
                    },
                    {type: 'input', code: 'msgTitle', label: '通知标题'},
                    {type: 'input', code: 'msgContent', label: '通知内容'},
                ],
                activeName: 'first',
                //调用网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {label: "通知标题", code: "msgTitle", sortable: true},
                    {label: "通知内容", code: "msgContent",},
                    {label: "通知人", code: "userCodeTo",},
                    {label: "发送人", code: "userCodeFrom",},
                    {label: "时间", code: "createDate",},
                    {
                        label: "是否已读", code: "ifRead", renderCell(h, data) {
                            let tagtext = data.row.ifRead == 0 ? <el-tag type="danger">未读</el-tag> :
                                <el-tag type="success">已读</el-tag>
                            return tagtext
                        }
                    },
                ],
                //按钮操作
                buttons: [
                    // {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "refresh", callback: this.addItem},
                    // {
                    //     name: '刷新',
                    //     icon: 'el-icon-refresh-right',
                    //     type: 'primary',
                    //     ctrlCode: "add",
                    //     callback: this.refresh
                    // },
                ],
                operations: [
                    {name: '查看', callback: this.look, ctrlCode: "BXZ1"},
                    {
                        name: '删除', callback: this.delete, ctrlCode: "del", type: 'danger', isShow(row) {
                            return row.sr == 0;
                        }
                    },
                ],
                //验证不能为空
                rules: {
                    msgTitle: [
                        {required: true, message: '消息标题不能为空'}
                    ],
                    msgContent: [
                        {required: true, message: '消息内容不能为空'}
                    ],
                    userCodeTo: [
                        {required: true, message: '接受人不能为空'}
                    ],
                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel: {
                    oid: '',
                    msgTitle: '',
                    msgContent: '',
                    userCodeTo: '',
                    receiveUsers: [],
                    isAll: 0
                },
                disabled: false,
                // 查看通知弹窗
                msgvisible: false,
                msgDetail: {}
            }
        },
        computed: {
            crewCodes() {
                let data = this.getConstants()('INFORM');
                if (data && data.length > 0) {
                    return data[0];
                } else {
                    return 0;
                }
            },
        },
        created() {
            this.addUndoTypeCodes({appCode: 'SYSTEM_COMMON_90', typeCode: 'INFORM', autoRefresh: true})

        },
        mounted() {

            this.initButtons();
        },

        watch: {
            crewCodes() {
                this.initButtons();
            },
        },
        //专门写方法的区域
        methods: {
            ...mapMutations('constant', ['addUndoTypeCodes']),
            ...mapGetters('constant', ['getConstants']),
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            initButtons() {
                console.log(this.crewCodes, 'crewCodes')
                if (this.crewCodes == 1) {
                    this.buttons = [
                        {
                            name: '新增',
                            icon: 'el-icon-plus',
                            type: 'primary',
                            ctrlCode: "refresh",
                            callback: this.addItem
                        },
                        {
                            name: '刷新',
                            icon: 'el-icon-refresh-right',
                            type: 'primary',
                            ctrlCode: "add",
                            callback: this.refresh
                        },
                    ];
                } else {
                    this.buttons = [
                        {
                            name: '刷新',
                            icon: 'el-icon-refresh-right',
                            type: 'primary',
                            ctrlCode: "add",
                            callback: this.refresh
                        },
                    ];
                }

            },
            refresh() {
                this.$refs.grid.refresh();
            },

            //新增安全论证申报模态框
            addItem() {
                this.title = '新增消息';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                    }
                })
            },

            //调用保存方法
            conserve() {
                console.log(this.formModel)
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var files = [];
                        files.push(this.fileInfo)
                        this.save('保存成功！', '保存失败！');
                    }
                })
            },

            //保存方法  success：成功提示信息，fail：失败信息
            save(success, fail) {
                this.loading = true;
                this.formModel.receiveUsers = this.formModel.receiveUsers.map((c) => {
                    return c.code
                })
                this.$axios.post("/pms//ResMsg/saveOrUpdate", this.formModel)
                    .then(result => {
                        this.visible = false
                        this.$message.success(success)
                        this.$refs.grid.refresh();
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            //选中一行进行编辑
            edit(row) {
                this.title = '编辑安全论证申报信息';
                this.visible = true;
                this.disabled = false;
                this.jymsTags = [];
                this.xtFjList = [];
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                })
            },
            // 查看
            look(row) {
                this.msgDetail = row;
                this.msgvisible = true;
                this.handleLookConfirm(row);
            },
            handleLookConfirm(data) {
                if (this.formModel.sr != 0 && this.formModel.ifRead == 0) {
                    this.$axios.post("pms/ResMsg/ack", {"id": data.oid}).then(result => {
                        this.visible = false;
                        this.refresh();
                    }).catch(error => {
                            this.$message.error("删除失败")
                        }
                    )
                }
            },
            //选中一行进行删除
            delete(row) {
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //this.formModel.deleteStatus = 1;
                    // return
                    //this.save('删除成功！', '删除失败！');
                    this.$axios.delete("pms//ResMsg/del", {params: {"id": row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.refresh();
                    }).catch(error => {
                            console.log(123)
                            this.$message.error("删除失败")
                        }
                    )
                }).catch(() => {
                    console.log('取消成功')
                })
            },
            handleClose() {
                this.visible = false;
            }
        },
    }

</script>
<style lang="less">
    .btns {
        padding: 10px 15px;

        .right {
            float: right;
        }

        .btn {
            margin-right: 10px;
        }
    }

    .vxe {
        flex-grow: 1;
    }
</style>
