<template>
<!--    <el-dialog-->
<!--            v-dialogDrag-->
<!--            width="94%"-->
<!--            :modal-append-to-body="false"-->
<!--            :visible.sync="dialogVisible"-->
<!--            :close-on-press-escape="false"-->
<!--            :close-on-click-modal="false">-->
<!--        <div class="apply-dialog">-->
<!--            <iframe ref="frame" :src="flowUrl" frameborder="0" style="width: 100%;height: 95%"></iframe>-->
<!--        </div>-->
<!--    </el-dialog>-->
</template>

<script>
    export default {
        name: "commApply",
        props: {
            //流程
            flowUrl: {
                type: String
            },
            applyNo: {
                type: String
            }
        },
        data() {
            return {
                // dialogVisible: false,
            };
        },
        methods: {},
        mounted() {
            // this.dialogVisible = true;
            // this.$nextTick(()=>{
            //     this.flowUrl = "http://10.99.12.70:8080/null#" + this.flowUrl;
            // });
            this.$router.push(this.flowUrl);
        }
    }
</script>

<style scoped>
    .apply-dialog {
        width: 100%;
        background-color: #FFFFFF;
        overflow-y: auto;
        height: 550px;
        max-height: 550px;
    }
</style>