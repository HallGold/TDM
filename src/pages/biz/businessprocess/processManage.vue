<template>
    <div class="content-filled">
        <ice-tree ref="treeOrg" style="height: 98%;width: 250px"
                  :lazy="true"
                  v-if="processTypeData.length > 0"
                  :showTreeCheckbox="false"
                  labelProp="bpmDefName"
                  valueProp="actDefKey"
                  node-key="DEV_REPAIR_AF"
                  :default-checked-keys="[1]"
                  :treeData="processTypeData"
                  @node-click="nodeClick">
        </ice-tree>
        <router-view>

        </router-view>
    </div>
</template>

<script>
    import IceTree from "../../../components/common/base/IceTree";
    import bizComm from "@/pages/biz/js/comm";
    import BPComm from "./js/bpComm.js";

    export default {
        name: "processManage",
        components: {IceTree},
        mixins: [bizComm, BPComm],
        data() {
            return {
                processTypeData: [],//当前登录用户所能发起的流程
                fullPath: '/biz/businessprocess/processManage'//路由开始的路径
            }
        },
        methods: {
            /**
             * 向服务器请求当前用户的可申请的设备流程分类
             */
            requestProcessType() {
                return new Promise((resolve, reject) => {
                    this.axios(this.ENUMS.ACTIONS.GET_PROCESS_TYPE, {typeId: this.ENUMS.DEV_FLOW_TYPE}, [
                        res => {
                            this.processTypeData.push(...res.data);
                            resolve();
                        }
                    ])
                });
            },
            /**
             * 树节点点击事件
             * @param e
             */
            nodeClick(e) {
                if (!this.ENUMS.MAP.DEV_FLOW_ROUTE[e]) {
                    this.$message.warning("请先在数据字典配置相关流程管理页面");
                    this.$router.replace(this.fullPath);
                } else {
                    this.$router.replace(this.fullPath + this.ENUMS.MAP.DEV_FLOW_ROUTE[e]);
                }
            }
        },
        mounted() {
            this.requestDevFlowType().then(() => {
                this.requestProcessType();
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEV_FLOW_URL.CODE);
            });
        }
    }
</script>

<style scoped>

</style>