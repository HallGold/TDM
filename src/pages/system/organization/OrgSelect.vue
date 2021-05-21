<template>
    <el-container>
        <el-aside>
            <org-tree ref="orgTree" :loadDisabledDept="false" :multiple="multiple" :nodeClick="treeClickHandler"
                      :after-init="treeInitCallback"></org-tree>
        </el-aside>
    </el-container>
</template>

<script>
    import OrgTree from "./OrgTree";

    export default {
        name: "OrgSelect",
        components: {OrgTree},
        props: {
            multiple: {
                //是否多选
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                selection: {},
            };
        },
        methods: {
            treeClickHandler(node) {
                if (!this.multiple) {
                    //单选时处理
                    this.selection = node;
                }
            },
            treeInitCallback() {
            },
            getResult(onlyLeaf, includeHalf) {
                //1. onlyLeaf是否只是叶子节点，默认值为 false
                //2. includeHalf是否包含半选节点，默认值为 false
                let _value = null;
                if (this.multiple) {
                    //多选
                    _value = Object.assign({}, this.$refs.orgTree.getSelection(onlyLeaf, includeHalf));
                } else {
                    //单选
                    _value = Object.assign({}, this.selection);
                }
                this.destroy();
                return _value;
            },
            destroy() {
                this.selection = {};
            },
        }
    }
</script>
