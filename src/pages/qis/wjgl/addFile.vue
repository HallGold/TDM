<template>
    <div style="width: 1000px;margin: 0 auto;background: #fff;padding: 0 20px;" v-loading="loading">
        <div class="btns">
            <el-button type="primary" @click="fileConfirm">保存</el-button>
            <el-button @click="$router.go(-1)">退出</el-button>
        </div>
        <file-common ref="fileCommon" :jhdata="jhdata" :oid-type="oidType" :constantCode="constantCode"></file-common>
    </div>
</template>

<script>
    import fileCommon from './fileCommon'
    import {SBZT, SPZT, WDLX, WJBB} from "../../../utils/constant";

    export default {
        name: "addFile",
        components: {
            fileCommon
        },
        data() {
            return {
                oidType: '',
                dataFwg: {},
                formModel: {},
                loading: false
            }
        },
        computed: {
            constantCode() {
                return this.jhdata.type;
            },
            // 获取计划数据
            jhdata() {
                if (this.$route.query.jhdata) {
                    return JSON.parse(this.$route.query.jhdata);
                } else {
                    return {}
                }
            },
            userInfo() {
                return this.$userInfo
            }
        },
        created() {
        },
        mounted() {
            this.$refs.fileCommon.resetFormModel();
            this.initOidType();

        },
        methods: {
            async initOidType() {
                await   this.$axios.get("/permission/app_constant/byCode", {
                    params: {
                        appCode: 'PMS',
                        code: this.jhdata.type,
                    }
                }).then(resault => {
                    if (resault.data != null) {
                        this.oidType = resault.data.value;
                    } else {
                        this.$message.error("初始化数据字典oid失败！请确保是否配置了" + this.constantCode + "常量！")
                    }
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            fileConfirm() {
                // let a = this.$refs.fileCommon.formValidate();
                this.$refs.fileCommon.formValidate().then(v => {
                    if (v) {
                        let data = this.$refs.fileCommon.getData();
                        console.log(data)
                        this.formModel.scrcode = this.userInfo.userCode;
                        this.formModel.filescr = this.userInfo.userName;
                        this.formModel.oidScr = this.userInfo.userId;
                        this.formModel.filezt = WDLX.WFB;
                        if (!this.formModel.oid) {
                            //新增的话
                            // this.formModel.isfolder = 0;
                            this.formModel.filescrq = new Date();
                        } else {
                            //修改
                            // this.formModel.filescrq = new Date();
                            // this.formModel.version = this.formModel.version + 1;
                        }
                        let arr = [];
                        data.forEach(c => {
                            c = {...this.formModel, ...c};
                            arr.push(c);
                        })
                        console.log(arr, 'arr');
                        this.loading = true;
                        this.$axios.post("/pms/QisFileinfo/saveOrUpdate", {fileinfoVoList: arr})
                            .then(result => {
                                this.$message.success("保存成功!");
                                this.$router.go(-1);
                            }).catch(error => {
                            this.$message.error(error.msg);
                        }).finally(() => {
                            this.loading = false;
                        })
                    }

                }).catch(v => {
                    console.log(v, 'v')
                })

            }
        }
    }
</script>

<style lang="less" scoped>
    .btns {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
    }
</style>
