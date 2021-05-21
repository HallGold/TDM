<template>
    <div>
        <ice-tree style="height: 400px; width: 380px"
                  load-url="/permission/frame_org/load_tree_datapriv?loadDisabled=false"
                  labelProp="deptName"
                  valueProp="inputDeptCode"
                  @node-click="handleNodeClick"></ice-tree>
        <el-row style="text-align: center;">
            <el-button type="primary" @click="selectConfirm" :disabled="key=='90'">确定选择</el-button>
            <el-button @click="selectCannel">取消</el-button>
        </el-row>
    </div>
</template>

<script>
    import IceTree from "../../../components/common/base/IceTree";

    export default {
        name: "FrameOrgTreeChoose",
        components: {IceTree},
        data() {
            return {
                orgData: {},
                key: '',
            }
        },
        methods: {
            handleNodeClick(data, node) {
                this.key = data;
                this.orgData = {
                    id: node.id,
                    name: node.data.deptName,
                    code: node.data.inputDeptCode,
                }
            },
            selectConfirm() {
                this.$emit("select-confirm", this.orgData);
            },
            selectCannel() {
                this.$emit("select-cannel");
            }
        }
    }
</script>

<style scoped>

</style>