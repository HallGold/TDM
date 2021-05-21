<template>
    <div class="ice-container">
        <el-container>
            <el-aside width="250px" class="asidelayout">
                <!--调用左侧组件格式-->
                <el-tabs type="border-card">
                    <el-tab-pane label="按项目">
                        <ice-tree :load-url="dataUrlTree"
                                  label-prop="xmname"
                                  class="tree"
                                  value-prop="oid"
                                  @node-click="orgNodeClick"
                                  :lazy="false"
                                  ref="iceGrid"
                        >
                            <div slot="prefix">
                                <date-cus-select  v-model="yearOrangeXmly"></date-cus-select>
                            </div>
                        </ice-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-aside>
            <!--引用组件,定义变量-->
            <el-main>
                <ice-query-grid
                        :data-url="dataUrl"
                        :columns="columns"
                        chooseItem="single"
                        ref="grid"
                        :buttons="buttons"
                        :operations="operations"
                        :query="querys"
                        @dbClick="getDetail"
                        exportTitle="科研项目信息"
                >
                </ice-query-grid>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceTree from "../../../components/common/base/IceTree";
    import getLastLoginUserName from "../../../utils/localstoreUtil";
    import moment from 'moment'
    import {mapGetters, mapMutations} from 'vuex'

    import docConstants from '../../../utils/docConstants'


    import dateCusSelect from './components/dateCusSelect'
    //export default 只能导出一个默认模块，这个模块可以匿名
    let now = new Date();
    let year = now.getFullYear();
    const initstart = year+'-1-1';
    const initend = year+'-12-31';
    let datesj = [initstart, initend]
    export default {
        name: "Xminfo",
        mixins: [docConstants],
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                yearOrangeXmly: datesj,
                oidXm: '',
                //定义高级模糊查询方法
                querys: [
                    {type: 'static', code: 'oid', label: '父ID', value: 0},
                    {type: 'input', code: 'filename', label: '文件名称'},
                    {type: 'input', code: 'filecode', label: '文件编号'},
                    {type: 'input', code: 'fileSize', label: '文件大小'},
                    {type: 'date', code: 'createDate', label: '上传日期'},
                    {type: 'select', code: 'fileLylx', label: '文件来源', mapTypeCode: 'FILE_LY_SYS'},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                //调用页面网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {code: "dataid", hidden: true},
                    {label: "文件来源", code: "fileLylx", width: 200, mapTypeCode: 'FILE_LY_SYS'},
                    {label: "文件编号", code: "filecode", width: 130, sortable: true},
                    {label: "文件名称", code: "filename", width: 200,},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {
                        label: '文件大小(B)', code: 'fileSize', width: 150, sortable: true,
                    },
                    {
                        label: "上传日期", code: "createDate", width: 100, sortable: true, formatter(row) {
                            return row.createDate ? moment(row.createDate).format('YYYY-MM-DD') : "";
                        }
                    },
                ],
                //按钮组件1231414
                buttons: [
                    // {name: '导出', ctrlCode: "BDC", icon: 'el-icon-upload2', ctrlCode: "BDC", type: 'export'},  //导出Excel表需要定义一个组件就行，这里声明就可以使用
                    {name: '刷新', icon: 'el-icon-refresh', ctrlCode: "BSX", type: 'success', callback: this.refreshGrid},
                ],

                //定义模态框 转圈加载过程
                loading: false,

                //定义行的下载
                operations: [
                    {
                        name: '下载', callback: this.downloadFile, ctrlCode: "BXZ"
                    },
                    {
                        name: '查看', callback: this.lookFile, ctrlCode: "BXZ"
                    },
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
            docListUrl() {
                return "pms/XtFj/listByoidXm?oidXm=" + this.oidXm;
            },
            dataUrlTree () {
                let dates =this.yearOrangeXmly;
                let obj = {
                    sdate: moment(dates[0]).format('YYYY-MM-DD'),
                    edate: moment(dates[1]).format('YYYY-MM-DD'),
                }
                let url = this.urlJoint('pms/Xminfo/QueryTreeAll', obj)
                return  url;
            },
            dataUrl (){
                let dates =this.yearOrangeXmly;
                let obj = {
                    sdate: moment(dates[0]).format('YYYY-MM-DD'),
                    edate: moment(dates[1]).format('YYYY-MM-DD'),
                }
                let url = this.urlJoint('pms/XtFj/listByoidXm', obj)
                return  url;
            }
        },
        created() {
            this.membershow = true;
            // this.filterSelectList();
        },
        //触发事件方法
        methods: {
            ...mapGetters('datamapStore', ['getDataMapList']),
            // 拼接url
            urlJoint (baseurl, params) {
                let str = "";
                for(let i in params) {
                    str += '&'+i+'='+params[i];
                }
                return baseurl+'?'+str.substring(1);
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

                this.selectedDeptId = id;

                // this.transferWbsTreeData.id = id;
                // this.transferWbsTreeData.obj = row;
                this.curTreeNode = row;  //获取行数据
                if (id == 0) {
                    this.querys[0].value = "";
                } else {
                    this.querys[0].value = id;
                }
                this.$refs.grid.refresh();
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
            xmDateChange(year) {
                this.xmyear = year;
                this.dataUrl = 'pms/Xminfo/QueryTreeAll?time=' + this.xmyear;
                this.gridUrl = 'pms/XtFj/listByoidXm?time=' + this.xmyear;
                // this.refreshGrid();
            },
        },  //methods方法底部


        //这个是你引用插件生成的,不用管它
        components: {
            IceTree,
            IceQueryGrid,
            dateCusSelect
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
</style>
