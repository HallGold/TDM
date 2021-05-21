<template>
    <div class="abbb">
        <div :style="{width: Width}">
            <div class="buttons">
                <el-button v-for="(item, index) in buttons" :size="item.size" :key="index" :type="item.type"
                           :icon="item.icon" @click="item.callback">{{item.name}}
                </el-button>
            </div>
            <div class="_input">
                <el-input
                        :placeholder="searchIs"
                        v-model="filterText">
                </el-input>
            </div>
            <div class="btn" v-if="isemptyBtn">
                <el-button @click="emptyChecked" v-if="showChecked" type="text">清空</el-button>
            </div>
            <div style="max-height: 400px; overflow: auto;">
                <el-tree
                        ref="tree"
                        :props="transfer.props"
                        :data="data"
                        :load="loadNode"
                        :expand-on-click-node="expandOnClickNode"
                        :default-expanded-keys="keys"
                        :lazy="transfer.lazy"
                        :highlight-current="highlightcurrent"
                        :node-key="transfer.nodeKey"
                        :show-checkbox="showChecked"
                        :filter-node-method="filterNode"
                        :default-expand-all="defaultExpandAll"
                        v-bind="$attrs"
                        @check="currentChecked"
                        @current-change="currentChange"
                        @check-change="handleCheckChange"
                        @node-click="handleNodeClick">
                    <div slot-scope="{ node, data }" style="padding-left: 5px;">
                        <i :class="node.isLeaf?'el-icon-tickets':'el-icon-folder'"
                           :style="{color:node.isLeaf?'':'#0091b0'}"/>
                        <span style="padding-left: 5px" :title="data[transfer.props.label]">{{data[transfer.props.label]}} </span>
                        <!--<slot name="append" :node="node" :data="node"></slot>-->
                    </div>
                </el-tree>
            </div>

        </div>
    </div>
</template>
<script>
    export default {
        name: "IceCustomTree",
        props: {
            Width: {
                default: 'auto'
            },
            transfer: {
                default: function () {
                    return {}
                }
            },
            expandOnClickNode: Boolean,
            searchIs: {
                default: '请输入关键字搜索'
            },
            // 需要回调与否
            unbrid: {
                type: Boolean
            },
            buttons: {
                type: Array,
            },
            // 是否需要展示多选
            showChecked: {
                default: false,
            },
            // 是否需要展示清空按钮
            isemptyBtn: {
                default: false
            },
            treeData: {},
            // 是否
            defaultValue: {
                type: Array,
                default: function () {
                    return []
                },
            },
            // 是否默认选中第一个数据
            iscanLevel1: {
                default: true
            },
            defaultExpandAll: false,
            // 选中节点
            sectNodeLevel: {
                default: 1
            }
        },
        data() {
            return {
                count: 1,
                highlightcurrent: true,
                id: '',
                data: [],
                filterText: '',
                keys: [],
                key: '',
                arr: [],
                // sectKeys
                sectCodes: [],
                currentNodeKeys: null
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            defaultValue: {
                immediate: false,
                handler(newValue) {
                    this.sectCodes = this.defaultValue;
                }
            },
            sectCodes () {
                if (this.showChecked) {
                    this.$nextTick(_=>{
                        this.$refs.tree.setCheckedKeys(this.sectCodes);
                    })

                } else {
                    if (this.sectCodes.length<=0) {
                        this.currentNodeKeys = null;
                        this.$emit('handleCallback', {});
                    } else {
                        this.initDefaultShow();
                    }

                }
            },
            "transfer.api" () {
                console.log("执行到这里了")
                this.getListNoAsync();
            },
        },
        created() {
            if (!this.transfer.lazy) {
                this.getListNoAsync();
            }

        },
        mounted() {
            let self = this;
        },
        methods: {
            // 刷新组件
            refresh() {
                this.getListNoAsync();
            },
            // 清空选中
            emptyChecked() {
                this.$refs.tree.setCheckedNodes([])
                this.$emit('handleCallback', []);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data[this.transfer.props.label].indexOf(value) !== -1;
            },
            // 选中节点变化，触发的节点
            currentChecked(nodes) {
            },
            handleCheckChange(data, checked, indeterminate) {
                this.sectCodes = data.map(c=>{
                    return c[this.transfer.code]
                })
            },
            currentChange (a, b) {
                // this.$emit('handleCallback', a);
            },
            handleNodeClick(data, node, el) {
                if (node.level > this.sectNodeLevel) {
                    this.$emit('handleCallback', data);
                    this.sectCodes = [data[this.transfer.code]]
                }
                this.currentNodeKeys = [data[this.transfer.code]];
            },
            loadNode(node, resolve) {
                if (node.data) {
                    this.formModel.year = node.data.xmname;
                }
                if (node.level === 0 && this.yibu) {
                    return resolve([{'xmname': '2019'}, {'xmname': '2020'}]);
                } else {
                    this.getList(node, resolve);
                }
            },
            // 不需要异步请求
            getListNoAsync() {
                if (!this.transfer.api) {
                    return
                }
                this.$axios.get(this.transfer.api, {params: this.transfer.initModel})
                    .then(result => {

                        if (result.data.length > 0) {
                            let self = this
                            this.data = result.data;
                            // 加载默认选中
                            if (this.transfer.nodeKey) {
                                this.$nextTick(_ => {
                                    this.initDefaultShow();
                                })
                            }
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取失败")
                    })
                    .finally(_ => {

                    })
            },
            // 设置选中
            // 获取第一次默认展开初始化
            initDefaultShow() {
                if (this.currentNodeKeys&&this.defaultValue&&this.currentNodeKeys.toString()==this.defaultValue.toString()) {
                    return
                }
                let arr = [];
                if (this.data.length <= 0) {
                    return;
                }
                if (this.showChecked || this.defaultValue.length <= 0) {
                    arr.push(this.data[0][this.transfer.nodeKey])
                    if (!this.iscanLevel1) {
                        console.log('执行到这里了')
                        this.$emit('handleCallback', {});
                        return;
                    }
                } else {
                    arr = this.defaultValue;
                }
                this.keys = arr;
                // 试用nexTick 页面渲染完了，设置第一次加载的东西
                this.$nextTick(() => {
                    if (!this.transfer.nodeKey) {
                        return
                    }
                    this.$refs.tree.setCurrentKey(null);
                    this.$refs.tree.setCurrentKey(this.keys.join());
                    // 当前选中节点返回
                    this.$emit('handleCallback', this.$refs.tree.getCurrentNode() ? this.$refs.tree.getCurrentNode() : {});
                })

            },
            setCurrentKey(key) {
                this.$refs.tree.setCurrentKey(key);
            },
            setTreeCurrentNode(node) {
                this.$refs.tree.setCurrentKey(node);
            },
            // 异步请求获取树数据
            getList(node, resolve) {
                this.$axios.get(this.api, {params: this.formModel})
                    .then(result => {
                        if (result.data.length > 0) {
                            resolve(result.data);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取失败")
                    })
                    .finally(_ => {

                    })
            }
        }
    }
</script>

<style lang="less" scoped>
    ._input {
        margin-bottom: 10px;
    }

    .buttons {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }

    .btn {
        text-align: right;
        font-size: 14px;
    }
</style>
