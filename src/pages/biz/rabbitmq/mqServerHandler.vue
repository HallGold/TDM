<template>
    <div class="outer col">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="full-content">
            <el-tab-pane label="队列配置" name="first" class="outer">
                <div class="inner">
                    <ice-query-grid data-url="/biz/BizRabbitmqDeploy/list"
                                    exportTitle="导出"
                                    ref="grid"
                                    :query="queryA"
                                    :columns="columnsA"
                                    :operations="operations"
                                    :operations-width="200"
                                    :buttons="buttonsA"></ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="队列状态" name="second" class="outer">
                <div class="inner">
                    <ice-query-grid data-url="/biz/BizRabbitmqStatusLog/list"
                                    exportTitle="导出"
                                    :query="queryB"
                                    :columns="columnsB"
                                    :buttons="buttons"></ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="队列消息" name="third" class="outer">
                <div class="inner">
                    <ice-query-grid data-url="/biz/BizRabbitmqData/list"
                                    exportTitle="导出"
                                    :query="queryC"
                                    :columns="columnsC"
                                    :buttons="buttons"></ice-query-grid>
                </div>
            </el-tab-pane>
        </el-tabs>
        <ice-dialog width="700px" :visible.sync="dialogVisible" :title="title" :before-close="closeDialog">
            <el-form :model="mainData" :rules="formRules" label-width="100px" ref="form" :disabled="!isEdit">
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="服务名称" prop="sname">
                            <el-input v-model="mainData.sname" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否启用" prop="type">
                            <ice-select map-type-code="RAB_ENABLED" v-model="mainData.type"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="虚拟主机" prop="virtualHost">
                            <el-input v-model="mainData.virtualHost" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="队列名称" prop="queneName">
                            <el-input v-model="mainData.queneName" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="主机" prop="host">
                            <el-input v-model="mainData.host"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="端口" prop="port">
                            <el-input-number v-model="mainData.port" controls-position="right" :min="1" maxlength="30"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="mainData.userName" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="密码" prop="passWord">
                            <el-input v-model="mainData.passWord" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="save" v-if="isEdit">保存</el-button>
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </ice-dialog>
    </div>

</template>

<script>
    import IceTreeGrid from "@/components/common/base/IceTreeGrid";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import {validateIP} from "@/pages/system/comm/Validator.js"

    export default {
        name: "mqServerHandler",
        components: {IceSelect, IceDialog, IceQueryGrid, IceTreeGrid},
        data() {
            return {
                columns: [],
                buttons: [],
                buttonsA: [],
                operations:[],
                userCode: '',
                activeName: 'first',
                dialogVisible: false,
                title: '',
                isEdit: true,
                queryA: [
                    {
                        // type: 'static', code: 'userCode', exp: '=', value: () => {
                        //     return this.userCode;
                        // }
                    }
                ],
                columnsA:[
                    {label: '状态', code: 'status', width: 70,mapTypeCode:'RAB_STATUS'},
                    {label: '启用/禁用', code: 'type', width: 100,mapTypeCode:'RAB_ENABLED'},
                ],
                queryB: [
                    {
                        type: 'static', code: 'roleCode', exp: '=', value: () => {
                            return '0';
                        }
                    }
                ],
                columnsB:[
                    {label: '状态', code: 'status', width: 70,mapTypeCode:'RAB_STATUS'},
                ],
                queryC: [
                    {
                        type: 'static', code: 'roleCode', exp: '>', value: () => {
                            return '0';
                        }
                    }
                ],
                columnsC:[
                    {label: '状态', code: 'type', width: 70,mapTypeCode:"type"},
                    {label: '数据', code: 'jsonData', width: 70},
                    {label: '单号', code: 'num', width: 70},
                ],
                queryObj: [
                    {label: '服务名称', code: 'userName', type: 'input', value: ''},
                    {label: '虚拟主机', code: 'roleName', type: 'input', value: ''},
                    {label: '队列名称', code: 'systemName', type: 'input', value: ''},
                    {label: '主机', code: 'userAuth', type: 'input', value: ''},
                ],
                mainData: {//表单对象
                    sname: '',
                    type: '1',
                    virtualHost: '',
                    queneName: '',
                    host: '',
                    port: '',
                    userName: '',
                    passWord: ''
                },
                formRules: {//表单字段验证规则
                    host:[
                        {validator: validateIP, trigger: 'blur'},
                        { required: true, message: '请输入IP地址', trigger: 'blur' }
                        ],
                    sname:[{ required: true,whitespace:true, message: '请输入服务名称', trigger: 'blur' }],
                    virtualHost:[{ required: true, whitespace:true,message: '请输入虚拟主机', trigger: 'blur' }],
                    queneName:[{ required: true,whitespace:true, message: '请输入队列名称', trigger: 'blur' }],
                    port:[{ required: true, message: '请输入端口号', trigger: 'blur' }],
                    userName:[{ required: true,whitespace:true, message: '请输入用户名', trigger: 'blur' }],
                    passWord:[{ required: true,whitespace:true, message: '请输入密码', trigger: 'blur' }],
                }
            }
        },
        methods: {
            /**
             * 初始化
             */
            initTemplate() {
                this.columns = [
                    {code: 'oid', hidden: true},
                    {code: 'userName', hidden: true},
                    {code: 'passWord', hidden: true},
                    {code: 'routingkey', hidden: true},
                    {code: 'exchangeName', hidden: true},
                    {label: '服务名称', code: 'sname', width: 200},
                    /*{label: '状态', code: 'status', width: 70,mapTypeCode:'RAB_STATUS'},*/
                    {label: '虚拟主机', code: 'virtualHost', width: 150},
                    {label: '队列名称', code: 'queneName', width: 150},
                    {label: '主机', code: 'host', width: 100},
                    {label: '端口', code: 'port', width: 50},
                    /*{label: '启用/禁用', code: 'type', width: 100,mapTypeCode:'RAB_ENABLED'},*/
                    {label:'创建时间',code:'createDate',width:150}
                ];
                this.buttons = [
                    {name: '导出', icon: 'el-icon-upload2', type: 'export', selectable: true}
                ];
                this.buttonsA = [
                    {name: '导出', icon: 'el-icon-upload2', type: 'export', selectable: true},
                    {name: '新增', callback: this.addItem}
                ];
                this.queryA.push(...this.queryObj);
                this.queryB.push(...this.queryObj);
                this.queryC.push(...this.queryObj);
                this.columnsA.push(...this.columns);
                this.columnsB.push(...this.columns);
                this.columnsC.push(...this.columns);
                this.operations = [
                    {name: '连接', callback: this.connectMq,isShow:function (row) {
                            return row.status == 2 && row.type ==1;
                        }},
                    {name: '断开', callback: this.closeMq,isShow:function (row) {
                            return row.status == 1;
                        }},
                    {name: '编辑', callback: this.updateMq,isShow:function (row) {
                            return row.status ==2;
                        }},
                    {name: '查看', callback: this.lookMq},
                    {name: '启用', callback: this.qyMq,isShow:function (row) {
                            return row.type ==2 && row.status ==2;
                        }},
                    {name: '禁用', callback: this.jyMq,isShow:function (row) {
                            return row.type ==1 && row.status ==2;
                        }}
                ]
            },
            /**
             * 刷新
             */
            refresh() {
                this.$refs.grid.refresh();
            },
            /**
             * 连接MQ
             */
            connectMq(row){
                this.$axios.post("/biz/BizRabbitmqDeploy/contentMq", row).then(success => {
                    this.$message.success("连接成功!");
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '连接失败！'
                    })
                });
            },
            /**
             * 关闭Mq连接
             */
            closeMq(row){
                this.$axios.post("/biz/BizRabbitmqDeploy/closeMq", row).then(success => {
                    this.$message.success("成功断开!");
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '关闭失败！'
                    })
                });
            },
            /**
             * 启用
             */
            qyMq(row){
                row.type = '1';
                this.$axios.post("/biz/BizRabbitmqDeploy/saveOrUpdate", row).then(success => {
                    this.$message.success("启用成功");
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '保存失败'
                    })
                });
            },
            /**
             *  禁用
             */
            jyMq(row){
                row.type = '2';
                this.$axios.post("/biz/BizRabbitmqDeploy/saveOrUpdate", row).then(success => {
                    this.$message.success("禁用成功");
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '保存失败'
                    })
                });
            },
            /**
             * 查看
             */
            lookMq(row){
                this.isEdit = false;
                this.title = '查看';
                Object.assign(this.mainData,row);
                this.dialogVisible = true;
            },
            /**
             * 编辑
             */
            updateMq(row){
                this.isEdit = true;
                this.title = '编辑';
                Object.assign(this.mainData,row);
                this.dialogVisible = true;
            },
            /**
             * 切换时刷新数据
             */
            handleClick() {
                this.refresh();
            },
            /**
             * 新增
             */
            addItem() {
                this.isEdit = true;
                this.title = '新增';
                this.dialogVisible = true;
            },
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/biz/BizRabbitmqDeploy/saveOrUpdate", this.mainData).then(success => {
                        this.$message.success("保存成功");
                        this.closeDialog();
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '保存失败'
                        })
                    });
                });
            },
            /**
             * 取消
             */
            closeDialog() {
                // debugger;
                this.resetForm();
                this.$nextTick(()=>{
                    this.dialogVisible = false;
                });

            },
            resetForm(){
                this.$refs.form.resetFields();
            },
        },
        mounted() {
            this.initTemplate();
            this.userCode = this.$userInfo.userCode;
        }
    }
</script>

<style scoped>
    .outer {
        width: 100%;
        height: 100%;
    }

    .col {
        background: white;
    }

    .inner {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>