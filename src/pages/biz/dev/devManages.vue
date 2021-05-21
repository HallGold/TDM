<template>
    <div class="content-filled">
        <ice-tree-grid v-if="categoryTreeData"
                       :treeData="categoryTreeData"
                       label-prop="name"
                       value-prop="code"
                       :exportTitle="exportTitle"
                       :exportColumns="exportAllColumns"
                       :exportUrl="exportUrl"
                       tree-width="210px"
                       :lazy="false"
                       :data-url="ENUMS.ACTIONS.SEARCH_DEV_BY_TYPE_PAGE.URL()+'?category='+this.currentSelectCategory"
                       :columns="columns"
                       :query="querys"
                       :operations="operations"
                       :buttons="buttons"
                       :ref="PAGE_ENUM.REFS.DEV_MANAGE_TABLE.REF"
                       :chooseItem="chooseItem"
                       border
                       :gridAutoRefresh="true"
                       @dbClick="onRowDbClick"
                       :after-bind-data="afterBindData"
                       @selection-change="handleSelectionChange"
                       @node-click="nodeTreeSelectedHandler"
                       :operations-width="200">
            <template slot="bottom">
                <slot name="bottom"></slot>
            </template>
        </ice-tree-grid>
    </div>
</template>

<script>
    import categoryTree from './comm/categoryTree'
    import IceTreeGrid from '@/components/common/base/IceTreeGrid';
    import CategorySelect from "@/pages/biz/dev/comm/categorySelect";
    import devEdit from "@/pages/biz/dev/devEdit"
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";

    export default {
        name: "devManages",
        mixins: [bizComm, devComm, renderer],
        components: {CategorySelect, categoryTree, IceTreeGrid, devEdit},
        props: {
            chooseItem: {
                type: String,
                default: "single"
            },
            buttons: {
                type: Array
            },
            operations: {
                type: Array
            },
            querys: {
                type: Array
            },
            columns: {
                type: Array
            }
        },
        data() {
            return {
                exportTitle: "设备信息",
                //当前设备类型树
                categoryTreeData: null,
                PAGE_ENUM: {
                    REFS: {
                        DEV_MANAGE_TABLE: {REF: "devManageTable"}
                    }
                },
                exportUrl:"",
                exportAllColumns:"",
                exportColumns: {
                    16: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "masterIp", "qualityDate", "useFor", "devPv", "mac", "dependSn", "factoryName"],
                    17: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "useFor", "devPv", "mac", "factoryName"],
                    15: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "qualityDate", "useFor", "license", "softWareNo", "trayNo", "capacity", "softwareAccount", "devPv", "mac", "dependSn", "factoryName"],
                    14: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "masterIp", "qualityDate", "useFor", "softVersion", "checkCertsignName", "checkCertsignCode", "checkCertsignDate", "checkDeptName", "devPv", "mac", "dependSn", "factoryName"],
                    13: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "masterIp", "qualityDate", "useFor", "devPv", "mac", "dependSn", "factoryName"],
                    12: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "masterIp", "qualityDate", "useFor", "devPv", "mac", "dependSn", "factoryName"],
                    11: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName", "userCode", "userName", "userDeptName", "devSn", "model", "birthSn", "birthDate",
                        "price", "buyDate", "masterIp", "qualityDate", "useFor", "shape", "osVersion", "setupDate", "terminal", "devPv", "mac", "dependSn", "factoryName"],
                    10: ["category", "childType", "secretSn", "sn", "name", "netAreaAndType", "currentPlace", "secretLevel", "secret", "state", "useDate",
                        "remark", "dutyCode", "dutyName", "deptName",
                        "origin", "functionaldesc", "deployMode", "checkDeptName", "passOfflineValid", "onlinevalid", "onlineValidDate",
                        "systemAdmin", "systemAdminCode", "authAdmin", "authAdminCode", "auditAdmin", "auditAdminCode", "devPv", "dependSn", "factoryName"]
                },
                mainData: {
                    category: "",//设备类型
                    childType: "",//设备子类
                },
                currentSelectCategory: {},
                exportSelectCategory: 0
            }
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initCategoryTreeData();
            },
            /**
             * 初始化设备类型树
             */
            initCategoryTreeData() {
                //初始化加载类别树的基础数据
                this.categoryTreeData = [{
                    code: this.ENUMS.CATEGORY_TYPE.DEV_TYPE.CODE, name: "设备类型", children: this.ENUMS.CATEGORY_DATA
                }];
            },
            /**
             * 刷新表格
             */
            refreshTable() {
                this.$refs[this.PAGE_ENUM.REFS.DEV_MANAGE_TABLE.REF].$refs.queryGrid.refresh();
            },
            /**
             * 表格加载完成后的处理
             */
            afterBindData() {
                //表格数据默认选中第一行
                this.$refs[this.PAGE_ENUM.REFS.DEV_MANAGE_TABLE.REF].$refs.queryGrid.toggleSelectionByIndex(0);
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(node, row) {
                this.exportTitle = row.data.name;
                this.currentSelectCategory = node;
                this.exportSelectCategory = row.data.code;
                if (row.level == 3) {
                    this.exportSelectCategory = row.parent.data.code;
                }
                this.changeExportColumns();
                this.mainData.category = this.getParentType(node);
                this.mainData.childType = this.getChildType(node);
                this.$emit("node-click", this.currentSelectCategory, this.mainData);
            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                this.$emit("selection-change", rows);
            },
            /**
             * 行双击事件
             * @param row
             */
            onRowDbClick(row) {
                this.$emit("rowDbClick", row);
            },
            changeExportColumns() {//更改导出的列
                this.exportUrl="";
                this.exportAllColumns="";
                if(this.exportSelectCategory==0){
                    this.setExportAllColumnsStr();
                    return;
                }
                for (let i = 0; i < this.columns.length; i++) {
                    this.columns[i].export = false;
                }

                let exps = this.exportColumns[this.exportSelectCategory];
                for (let j = 0; !!exps && j < exps.length; j++) {
                    for (let i = 0; i < this.columns.length; i++) {
                        if (exps[j] == this.columns[i].code) {
                            this.columns[i].export = true;
                        }
                    }
                }

            },
            setExportAllColumnsStr(){
                let allStr="";
                let titles="";
                this.exportUrl="/biz/BizDev/exportAllDev";
                for(let k in this.exportColumns){
                    let exps = this.exportColumns[k];
                    titles+="##"+k;
                    let str="";
                    for (let j = 0; !!exps && j < exps.length; j++) {
                        for (let i = 0; i < this.columns.length; i++) {
                            if (exps[j] == this.columns[i].code) {
                                let column=this.columns[i];
                                let col=column.code + "::" + column.label + "::" + (column.mapTypeCode ? column.mapTypeCode : '');
                                str+=","+col;
                            }
                        }
                    }
                    str=str.substr(1);
                    allStr+="##"+str;
                }
                allStr=allStr.substr(2);
                titles=titles.substr(2);
                this.exportTitle=titles;
                this.exportAllColumns=allStr;
            }
        },
        mounted() {
            this.setExportAllColumnsStr();
            //预处理任务链
            let prepareTaskChain = [
                this.requestCategoryData(),
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>