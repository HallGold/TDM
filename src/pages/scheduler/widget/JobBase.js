export default {
    methods: {
        exec(item) {
            /*this.selectedJobId = */
            this.$confirm('是否确认立即执行?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post("/scheduler/job/exec", {jobId: item.oid})
                    .then((result) => {
                        //this.close()
                        this.$refs.scheduler.refresh();
                        this.$message.success("执行成功")
                    })
                    .catch(error => {
                        console.error(error);
                        this.$message.error(error.msg)
                    })
            }).catch(() => {

            });
        },
        resolveStatus(status) {
            //debugger
            switch (status) {
                case 'success':
                    return {code: 'success', name: '成功'}
                case 'error':
                    return {code: 'error', name: '失败'}


                case 'NORMAL':
                    return {code: 'normal', name: '正常'}
                case 'BLOCKED':
                    return {code: 'blocking', name: '阻塞中'}
                case 'COMPLETE':
                    return {code: 'complete', name: '执行完成'}
                case 'PAUSED':
                    return {code: 'paused', name: '已暂停'}
                case 'ERROR':
                    return {code: 'error', name: '执行异常'}
                default:
                    return {code: '', name: '无状态'}
            }
        },

        showHistory(item) {
            this.selectedJobId = item.oid;
            this.historyDialogVisible = true;
            /* this.$nextTick(() => {
                 this.$refs.schedulerHistory.refreshAndPageReset();
             })*/

        },


        pause(item) {
            this.$confirm('是否确认暂停执行?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post("/scheduler/job/pauseJob", {jobId: item.oid})
                    .then((result) => {
                        /* this.close()*/
                        this.$refs.scheduler.refresh();
                    })
                    .catch(error => {
                        this.$message.error(error.msg)
                    })
            }).catch(() => {

            });
        },
        resume(item) {
            this.$confirm('是否确认恢复执行?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post("/scheduler/job/resumeJob", {jobId: item.oid})
                    .then((result) => {
                        /* this.close()*/
                        this.$refs.scheduler.refresh();
                    })
                    .catch(error => {
                        this.$message.error(error.msg)
                    })
            }).catch(() => {

            });
        }
    },
}