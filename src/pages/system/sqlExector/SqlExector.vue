<template>
    <div class="ice-container sql-exector">
        <div class="editor">
            <div class="ice-full-absolute">
                <ice-sql-editor width="100%" height="100%" v-model="sql" ref="sqlEditor">

                </ice-sql-editor>
            </div>
        </div>

        <div class="ice-button-bar left" style="padding-left: 0">
            <el-button-group>
                <el-button type="primary" icon="el-icon-video-play" @click="exec" :disabled="executing&&!autoCommit">
                    执行
                </el-button>
                <el-button type="success" icon="el-icon-circle-check" @click="commit" v-if="!autoCommit">提交</el-button>
                <el-button type="warning" icon="el-icon-circle-close" @click="rollback" v-if="!autoCommit">回滚
                </el-button>
                <el-button type="danger" icon="el-icon-delete" @click="stop" :disabled="!loading">停止</el-button>
                <el-button type="info" icon="el-icon-upload" @click="$refs.file.click()">
                    选择文件(UTF-8)
                </el-button>
            </el-button-group>
            <input type="file" class="ice-full-absolute" style="display: none"
                   ref="file" @change="fileChange" :multiple="true"></input>
            <div style="width: 50px"></div>
            <el-checkbox v-model="autoCommit">自动提交</el-checkbox>
            <el-checkbox v-model="stopOnError">错误后停止</el-checkbox>

            <div style="color: red;padding-left: 50px" v-if="executing&&!autoCommit">
                {{timeout}}S后系统将自动回滚,如果需再次执行脚本请手动停止或提交
            </div>
        </div>
        <div class="result" v-loading="loading">
            <div class="ice-full-absolute">
                <el-tabs type="border-card" class="full-content no-padding " :value="outTab">
                    <el-tab-pane label="错误信息" name="error">
                        <div v-html="error" style="overflow: auto;width: 100%;height: 100%;"></div>
                    </el-tab-pane>
                    <el-tab-pane label="执行日志" name="info">
                        <div v-html="info" style="overflow: auto;width: 100%;height: 100%"></div>
                    </el-tab-pane>
                </el-tabs>
            </div>

        </div>

    </div>
</template>

<script>
    import IceSqlEditor from "../../../components/common/base/IceSqlEditor/IceSqlEditor";

    export default {
        name: "SqlExector",
        data() {
            return {
                sql: '',//sql语句
                sessionId: '',//执行sessionID
                autoCommit: false,//是否自动提交
                stopOnError: true,//执行遇见错误是否停止执行
                info: '',//执行日志信息
                error: '',//执行错误日志
                executing: false,//是否在执行中，未提交也未回滚
                timer: null,//定时器
                timeout: 0,//定时时间，默认超过120Ssession自动回滚
                loading: false,//请求是否在执行中
                outTab: 'error'//日志输出后默认打开的tab
            }
        },
        methods: {
            exec() {
                if (!this.sql) {
                    return
                }

                this.sessionId = this.$userInfo.userCode + ":" + new Date().getTime()
                this.loading = true
                this.$axios.post("/resources/sql/exec",
                    {
                        sql: this.sql,
                        sessionId: this.sessionId,
                        autoCommit: this.autoCommit,
                        stopOnError: this.stopOnError
                    }
                ).then(({data}) => {
                    this.info = data.info;
                    this.error = data.error;
                    if (data.success) {
                        this.executing = true
                        this.timeout = 120;
                        this.stopTimer();
                        this.timer = setInterval(_ => {
                            this.timeout -= 1
                            if (this.timeout <= 0) {
                                this.executing = false
                                this.stopTimer();
                            }
                        }, 1000)
                        this.outTab = 'info'
                    } else {
                        this.executing = false
                        this.outTab = 'error'
                    }

                }).catch(e => {
                    this.executing = false
                    this.outTab = 'error'
                }).finally(_ => {
                    this.loading = false
                })
            },
            commit() {
                if (!this.sessionId) {
                    return
                }
                this.$axios.post("/resources/sql/commit",
                    {sessionId: this.sessionId}
                ).then(({data}) => {
                    if (data.success) {
                        this.$message.success("提交成功")
                    } else {
                        this.$message.error("提交失败")
                    }

                }).finally(_ => {
                    this.executing = false
                    this.stopTimer();
                })
            },
            rollback() {
                if (!this.sessionId) {
                    return
                }
                this.$axios.post("/resources/sql/rollback",
                    {sessionId: this.sessionId}
                ).then(({data}) => {
                    if (data.success) {
                        this.$message.success("回滚成功")
                    } else {
                        this.$message.error("回滚失败")
                    }
                }).finally(_ => {
                    this.executing = false
                    this.stopTimer();
                })
            },
            stop() {
                if (!this.sessionId) {
                    return
                }
                this.$axios.post("/resources/sql/stop",
                    {sessionId: this.sessionId}
                ).then(({data}) => {
                    if (data.success) {
                        this.$message.success("停止成功")
                    } else {
                        this.$message.error("停止失败")
                    }
                }).finally(_ => {
                    this.executing = false
                    this.stopTimer();
                })
            }
            ,
            stopTimer() {
                if (this.timer) {
                    clearInterval(this.timer)
                    this.timer = null;
                }
            },
            /**
             * 从文件中读取sql
             * */
            fileChange(ev) {

                const files = ev.target.files
                const promises = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    promises.push(new Promise((resolve, reject) => {
                        const fileReader = new FileReader()
                        fileReader.onload = function ({target: {result}}) {
                            resolve({filename: file.name, result});
                        }
                        fileReader.readAsText(file)
                    }))
                }

                Promise.all(promises).then(results => {
                    this.$refs.file.value = "";
                    let outString = "";
                    results.forEach(result => {
                        outString += `/* ${result.filename} */\r\n`;
                        outString += result.result + "\r\n\r\n"
                    })

                    this.sql = outString
                    this.$refs.sqlEditor.setValue(outString)
                })

            }
        },
        components: {IceSqlEditor}
    }
</script>

<style lang="less" scoped>
    .sql-exector {
        box-sizing: border-box;
        padding: 5px;

        .editor {
            width: 100%;
            height: 300px;
            border: 1px solid #cdd6e7;
            position: relative;
        }

        .result {
            position: relative;
            width: 100%;
            flex-grow: 1;
        }

    }
</style>