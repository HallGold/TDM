<template>
    <div class="content-filled">
        <!--        <div class="title" v-if="$attrs.title">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>{{$attrs.title}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>-->
        <div style="flex-grow: 2;display: flex;flex-direction: row;width: 100%">
            <div style="display: flex;flex-direction: column;height: 100%">
                <!--<div class="xbs" v-if="vif">
                    <el-button icon="el-icon-circle-plus" style="color: #85ce61" class="mar" @click="add" v-if="!vifc">
                        <span style="color: #222222">新增</span>
                    </el-button>
                    <el-dropdown v-if="vifc">
                        <el-button icon="el-icon-circle-plus" style="color: #85ce61" class="mar">
                            <span style="color: #222222">新增<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><span @click="addc">新增院级</span></el-dropdown-item>
                            <el-dropdown-item><span @click="add">新增所级</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-button icon="el-icon-edit" style="color: #ebb563" class="mar-u" @click="updata">
                        <span style="color: #222222">编辑</span>
                    </el-button>
                    <el-button icon="el-icon-delete" style="color: red" class="mar-d" @click="del">
                        <span style="color: #222222">删除</span>
                    </el-button>
                </div>-->
                <ice-tree v-bind="$attrs"
                          v-on="$listeners"
                          style="flex-grow: 1"
                          @node-click="handleNodeClick">
                 <!--   <div style="display: flex;justify-content:space-around" slot="prefix">
                        <el-button icon="el-icon-circle-plus" type="text" style="color: #85ce61" @click="addNode"
                                   :disabled="!selected">
                            <span style="color: #222222">新增</span>
                        </el-button>
                        <el-button icon="el-icon-edit" type="text" style="color: #ebb563" @click="updateNode"
                                   :disabled="!selected">
                            <span style="color: #222222">编辑</span>
                        </el-button>
                        <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteNode"
                                   :disabled="!selected">
                            <span style="color: #222222">删除</span>
                        </el-button>
                    </div>-->
                </ice-tree>
            </div>

            <div class="editableArea">
                <ice-query-grid
                        ref="queryGrid"
                        :grid-auto-refresh="false"
                        v-bind="$attrs"
                        :lazy="false"
                        :before-bind-data="dataFilter"
                        v-on="$listeners">
                </ice-query-grid>
            </div>
        </div>
    </div>
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";

    export default {
        name: "ApplicationIceTreeGrid",
        /*mixins: [IceQueryGridTemplate, IceTreeTemplate],*/
        props: {
            parentProp: {//父节点字段名，用于刷新网格数据
                type: String,
            },
            vif: Boolean,
            vifc: Boolean
        },
        data() {
            return {
                selectValue: null
            }
        },
        methods: {
            handleNodeClick(data, node) {
                this.selectValue = data;
                let item = this.$attrs.query.find(item => item.type == 'static' && item.code == this.parentProp);
                if (item) {
                    item["value"] = this.selectValue;
                }
                this.$emit("node-click", data, node);
                this.$nextTick(() => {
                    this.$refs.queryGrid.refreshAndPageReset();
                })


            }
            ,
            cleanColumnSelect() {
                this.$refs.queryGrid.cleanColumnSelect();
            },
            closeSelection(value) {
                this.$refs.queryGrid.closeSelection(value);
            },
            dataFilter(data) {
                if (data) {
                    data.forEach(item => {
                        delete item.children;
                    })
                    return data;
                } else {
                    return []
                }
            },
            addc() {
                this.$emit("click-addc");
            },
            add() {
                /*alert(JSON.stringify(this.selectValue))*/
                this.$emit("click-add");
            },
            updata() {
                this.$emit("click-updata");
            },
            del() {
                this.$emit("click-delete");
            }
        },
        watch: {},
        created() {

        },
        mounted() {
            if (this.parentProp) {
                this.$attrs.query.push({type: 'static', code: this.parentProp, value: this.selectValue});
            }

        },
        components: {
            IceQueryGrid,
            IceTree
        }
    }

</script>

<style lang="less" scoped>
    .mar {
        margin-left: 0;
        margin-right: 0;
        border: 0;
        position: absolute;
        overflow: hidden;
    }

    .mar-u {
        border: 0;
        position: absolute;
        left: 71px;
        overflow: hidden;
    }

    .mar-d {
        border: 0;
        position: absolute;
        left: 142px;
        overflow: hidden;
    }

    .xbs {
        height: 30px;
        width: 100%;
    }

    .title {
        font-size: 14px;
        padding: 4px 10px;
        padding-bottom: 10px;
        background: #f5f5f5;
    }

    .editableArea {
        flex-grow: 1;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        padding: 5px;
        background: white;
        margin-left: 5px;

        .operation-bar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            flex-shrink: 0;
            padding: 5px 10px;
            background: #ffffff;
        }

        .grid-bar {
            flex-grow: 1;
            flex-shrink: 1;
            position: relative;
        }
    }
</style>
