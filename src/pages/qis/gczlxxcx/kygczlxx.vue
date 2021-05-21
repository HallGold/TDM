<template>
    <div class="ice-container">
        <el-container>
            <el-aside width="250px" class="asidelayout">
                <!--调用左侧组件格式-->
                <el-tabs type="border-card">
                    <el-tab-pane label="按项目">
                        <ice-tree :load-url="dataUrl"
                                  label-prop="xmname"
                                  value-prop="oid"
                                  class="tree"
                                  @node-click="orgNodeClick"
                                  :lazy="false"
                                  ref="iceGrid"
                        >
                            <div slot="prefix">
                                <!--<el-date-picker v-model="xmyear" type="year" value-format="yyyy"-->
                                <!--@change="xmDateChange"></el-date-picker>-->
                                <date-cus-select v-model="yearOrange"></date-cus-select>
                            </div>
                        </ice-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-aside>
            <!--引用组件,定义变量-->
            <el-main>
                <div class="ice-container">
                    <el-cascader
                            :options="options"
                            :props="props"
                            ref="tree"
                            :placeholder="options.length>0?'请选择':'无数据'"
                            :disabled="options.length>0?false:true"
                            @change="change"
                            clearable></el-cascader>
                    <!--                    <ice-query-grid-->
                    <!--                            :grid-data="tabledata"-->
                    <!--                            :columns="columns"-->
                    <!--                            chooseItem="single"-->
                    <!--                            ref="grid"-->
                    <!--                            :operations="operations"-->
                    <!--                            :query="querys"-->
                    <!--                            exportTitle="交付物信息"-->
                    <!--                    >-->
                    <!--                    </ice-query-grid>-->
                    <div class="vxe-full-main">
                        <div class="vxe-full-container">
                            <vxe-table
                                    align="center"
                                    height="100%"
                                    :data="tabledata">
                                <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                                <vxe-table-column type="expand" field="cgydFjNum" title="文件" width="80">
                                    <template v-slot:content="{ row, rowIndex }">
                                        <div style="width: 80%;">
                                            <ATTACHMENT
                                                    :isHandleer="false" :data="row.wbsCgydJf"
                                                    ref="pmsXmRwFjListXmsr1"></ATTACHMENT>
                                        </div>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="cgmc" title="成果名称"></vxe-table-column>
                                <vxe-table-column field="issq" title="是否审签"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'IS_YES_NO'}"></vxe-table-column>
                                <vxe-table-column field="cgsm" title="成果说明"></vxe-table-column>
                                <vxe-table-column field="zljcd" title="质量检查点"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'IS_YES_NO'}"></vxe-table-column>
                                <vxe-table-column field="spzt" title="审批状态"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SPZT'}"></vxe-table-column>
                                <vxe-table-column field="dataSecretLevcode" title="密级"
                                                  :cell-render="{name: 'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}"></vxe-table-column>
                            </vxe-table>
                        </div>
                    </div>

                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceTree from "../../../components/common/base/IceTree";
    import getLastLoginUserName from "../../../utils/localstoreUtil";
    import moment from 'moment'
    import dateCusSelect from '../../pms/xmgl/components/dateCusSelect'
    import {mapGetters, mapMutations} from 'vuex'
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    //export default 只能导出一个默认模块，这个模块可以匿名

    let now = new Date();
    let year = now.getFullYear();
    const initstart = year + '-1-1';
    const initend = year + '-12-31';
    let datesj = [initstart, initend]
    export default {
        name: "kygczlxx",
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                allAlign: null,
                yearOrange: datesj,
                tabledata: [],
                options: [],
                props: {
                    label: 'rwname',
                    value: 'oid',
                    children: 'children',
                    checkStrictly: true
                },
                //调用页面网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {code: "dataid", hidden: true},
                    {label: "质量检查点", code: "cgmc", width: 200},
                    {label: "成果交付物", code: "filename", width: 130, sortable: true},
                    {label: "是否审签", code: "issq", width: 200, mapTypeCode: 'IS_YES_NO'},
                    {label: '审批状态', code: 'spzt', mapTypeCode: 'SPZT'},
                    // {label: '备注', code: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],

                //定义模态框 转圈加载过程
                loading: false,

                //定义行的下载
                operations: [
                    {
                        name: '下载', callback: this.downloadFile, ctrlCode: "BXZ", isShow: (row) => {
                            return row.filename ? true : false
                        }
                    },
                ],

                //定义高级模糊查询方法
                querys: [
                    {type: 'static', code: 'oid', label: '父ID', value: 0},
                ],

                /**
                 * 左边树tree
                 * 点击获取节点内容ID
                 */
                selectedDeptId: '',

                /**
                 * 左边树Tree 加载
                 * loding转圈加载
                 */
                loadingTree: false,

                /**
                 * 左边树Tree
                 * 弹出模态框默认为true
                 */
                treevisible: false,

                /**
                 * 左边树Tree
                 * 定义左侧树节点 默认为空
                 */
                nodeType: '',
                /**
                 * 左边树
                 * 定义获取行内容
                 */
                curTreeNode: {},
            }
        },
        computed: {
            // 项目成员
            memberList() {
                return this.queryListXmcy.filter((c) => {
                    return c.deleteStatus !== 1;
                })
            },
            dataUrl() {
                let dates = this.yearOrange;
                let obj = {
                    sdate: moment(dates[0]).format('YYYY-MM-DD'),
                    edate: moment(dates[1]).format('YYYY-MM-DD'),
                }
                let url = this.urlJoint('pms/Xminfo/QueryTree', obj)
                return url;
            },
        },
        created() {
            this.membershow = true;
        },
        //触发事件方法
        methods: {
            // 拼接url
            urlJoint(baseurl, params) {
                let str = "";
                for (let i in params) {
                    str += '&' + i + '=' + params[i];
                }
                return baseurl + '?' + str.substring(1);
            },
            change(data) {
                if (data.length <= 0) {
                    this.recursion(this.options);
                } else {
                    let node = this.$refs.tree.getCheckedNodes();
                    let nodeData = node[0].data;
                    this.tabledata = [];
                    this.recursion([nodeData]);
                }

            },
            // 递归获取成果交付物数据
            recursion(data) {
                // let arr = [];
                let arr = this.$utils.toTreeArray(data, {data: 'cgydList'});
                let d = arr.flat();
                // function digui(sjdata) {
                //     sjdata.forEach(c => {
                //         if (c.children && c.children.length > 0) {
                //             digui(c.children);
                //         }
                //         arr = [...arr, ...c.cgydList];
                //     })
                // };
                // digui(data);
                this.tabledata = d.filter(c => {
                    return c.zljcd == 'IS_YES'
                });
            },
            ...mapGetters('datamapStore', ['getDataMapList']),
            pageList(oid) {
                let queryParam = {
                    columns: ['oid', 'rwname'],
                    conditions: [
                        {
                            'column': 'oidXm',
                            exp: '=',
                            value: oid
                        }
                    ]
                }
                this.$axios.get("/pms/PmsWbs/treeList", {params: queryParam})
                    .then(result => {

                        let a = this.digui(result.data, 'children');
                        this.options = a;
                        this.recursion(a);
                        // this.tabledata = result.data[2].cgydList
                    }).catch(err => {

                })
            },

            // 递归整理数据
            digui(data, children) {
                function funDigu(data1) {
                    data1.forEach(c => {
                        if (c[children] && c[children].length > 0) {
                            funDigu(c[children])
                        } else {
                            delete c[children]
                        }
                    })
                }

                funDigu(data)
                return data
            },
            // 获取详情信息
            // 双击一行
            getDetail(row) {

            },
            //刷新按钮
            refreshGrid() {
                this.$refs.grid.refresh();
            },
            /**
             *左侧树Tree
             * 获取点击项目的ID
             */
            orgNodeClick(id, row) {
                this.tabledata = [];
                this.pageList(row.data.oid);
            },
            /**
             * 左边树的刷新方法
             */
            refreshTree() {
                this.$refs.iceGrid.refresh();
            },
            // 下载附件
            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
        },  //methods方法底部


        //这个是你引用插件生成的,不用管它
        components: {
            IceTree,
            IceQueryGrid,
            dateCusSelect,
            ATTACHMENT
        },
        watch: {}
    }
</script>
<style lang="less">
    .asidelayout {
        position: relative;
    }

    .asidelayout /deep/ .el-tabs {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .asidelayout /deep/ .el-tabs .el-tabs__content {
        position: absolute;
        top: 39px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .asidelayout /deep/ .el-tabs .el-tabs__content .tree {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 15px;
        width: auto !important;
        overflow-y: auto;
    }

    .box-card {
        height: 580px;
        overflow: auto;
    }

    .hint {
        font-size: 12px;
        line-height: 30px;
        color: #f30213;
    }

    .detail-tab {
        height: 500px;
        overflow: auto;
    }

    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;

        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>
