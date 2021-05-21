<template>
    <div class="content-filled">
        <slot name="header"></slot>
        <el-tree ref="orgTree" :data="orgData" :props="defaultProps"
                 node-key="oid" @node-click="handleNodeClick" :show-checkbox="multiple"
                 default-expand-all highlight-current :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="isEnabled(data)" class="enabled-word">{{ node.label }}</span>
                <span v-else class="disabled-word">{{ node.label }}</span>
            </span>
        </el-tree>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";

    export default {
        name: "OrgTree",
        mixins: [OrgComm],
        props: {
            multiple: {
                //是否多选
                type: Boolean,
                default: false
            },
            //是否加载停用部门
            loadDisabledDept: {
                type: Boolean,
                default: true
            },
            nodeClick: {
                type: Function,
                default: (node) => {
                    // console.log("node-click!")
                }
            },
            afterInit: {
                //树加载完成后会回调并将当前选中节点作为参数
                type: Function,
                default: (node) => {
                    // console.log("tree init over!")
                }
            }
        },
        data() {
            return {
                init: true,
                orgData: [],
                defaultProps: {
                    children: 'children',
                    label: `deptName`
                }
            };
        },
        methods: {
            isEnabled(data) {
                if (data.enabled == this.ENABLED_ENUM.DISABLED) {
                    return false;
                }
                return true;
            },
            loadData() {
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.ORG.MANAGE_TREE, {
                        loadDisabled: this.loadDisabledDept
                    }, [res => {
                        resolve(res);
                    }], false);
                })
            },
            handleNodeClick(node) {
                this.nodeClick(node);
            },
            getSelection(onlyLeaf, includeHalf) {
                return this.$refs.orgTree.getCheckedNodes(!!onlyLeaf, !!includeHalf);
            },
        },
        mounted() {
            let _this = this;
            this.loadData().then((res) => {
                _this.orgData = res.data;
            });
        },
        updated() {
            if (this.init) {
                let _this = this;
                if (!!_this.orgData && _this.orgData.length > 0) {
                    _this.$refs.orgTree.setCurrentKey(_this.orgData[0].oid);
                    this.afterInit(_this.$refs.orgTree.getCurrentNode(_this.orgData[0].oid));
                }
                this.init = false;
            }
        },
        components: {}
    }
</script>

<style scoped>
    .content-filled {
        background-color: #FFFFFF;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>