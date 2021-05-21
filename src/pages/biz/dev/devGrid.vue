<template>
    <div class="content-filled">
        <ice-tree-grid v-if="categoryTreeData"
                       :treeData="categoryTreeData"
                       label-prop="name"
                       value-prop="code"
                       :exportTitle="exportInfo.exportTitle"
                       :exportColumns="exportInfo.exportAllColumns"
                       :exportUrl="exportInfo.exportUrl"
                       tree-width="210px"
                       :lazy="true"
                       :data-url="dataUrl||ENUMS.ACTIONS.SEARCH_DEV_BY_TYPE_PAGE.URL()"
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
    import IceTreeGrid from '@/components/common/base/IceTreeGrid';
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";

    export default {
        name: "devGrid",
        mixins: [bizComm, devComm, renderer],
        components: {IceTreeGrid},
        props: {
            //自定义的数据url
            dataUrl: {
                type: String,
                default: undefined
            },
            selectFirst: {
                //是否默认选中第一条数据
                type: Boolean,
                default: true
            },
            chooseItem: {
                //数据选择方式multiple、single
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
                type: Array,
                default: () => []
            },
            columns: {
                type: Array
            },
            exportInfo: {
                type: Object,
                default: () => {
                    return {
                        exportTitle: "",
                        exportAllColumns: "",
                        exportUrl: ""
                    }
                }
            },
            //需要显示的设备分类数组 :filterTreeData="[10,1405,1101,1102]"
            filterTreeData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        DEV_MANAGE_TABLE: {REF: "devManageTable"}
                    }
                },
                categoryTreeData: null,
                categoryMap: {},
                currentSelectCategory: {},
            }
        },
        methods: {
            /**
             * 刷新表格
             */
            refreshTable() {
                this.$refs[this.PAGE_ENUM.REFS.DEV_MANAGE_TABLE.REF].$refs.queryGrid.refresh();
            },
            /**
             * 选中第一条数据
             **/
            selectFirstRecord() {
                this.$refs[this.PAGE_ENUM.REFS.DEV_MANAGE_TABLE.REF].$refs.queryGrid.toggleSelectionByIndex(0);
            },
            /**
             * 表格加载完成后的处理
             */
            afterBindData() {
                //表格数据默认选中第一行
                if (this.selectFirst) {
                    this.selectFirstRecord();
                }
                this.$emit("afterBindData");
                // this.$refs[this.PAGE_ENUM.REFS.DEV_MANAGE_TABLE.REF].$refs.queryGrid.search();
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(node, row) {
                this.currentSelectCategory = node;
                this.$emit("nodeClick", this.currentSelectCategory, row);
            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                this.$emit("selectionChange", rows);
            },
            /**
             * 行双击事件
             * @param row
             */
            onRowDbClick(row) {
                this.$emit("rowDbClick", row);
            },
            /**
             * 初始化设备类型树
             */
            initCategoryTreeData() {
                //初始化加载类别树的基础数据
                this.categoryTreeData = [{
                    code: this.ENUMS.CATEGORY_TYPE.DEV_TYPE.CODE,
                    name: "设备类型",
                    children: this.filterTreeData.length > 0 ? this.filterTree(this.filterTreeData) : this.ENUMS.CATEGORY_DATA
                }];
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initCategoryTreeData();
                this.extendQueryCondition();
            },
            /**
             * 扩展查询条件，设备分类只能在this.categoryTreeData范围内
             **/
            extendQueryCondition() {
                let _this = this;
                let categorys = [], childTypes = [];
                for (let i in this.categoryMap) {
                    //当前编码
                    let code = Number(i);
                    if (code < this.ENUMS.CHILD_CATEGORY_CODE_FLAG) {
                        //大类编码,需要把小类编码放入childTypes
                        categorys.push(code);
                        this.categoryMap[i].children.forEach((a, b, c) => {
                            childTypes.push(a.code);
                        });
                    }
                }
                _this.querys.push({
                    type: 'static', label: "父类型", code: "category", exp: "in", width: 80, value: categorys.toString()
                }, {
                    type: 'static', label: "子类型", code: "childType", exp: "in", width: 80, value: childTypes.toString()
                });

            },
            /**
             * 设备类型树的过滤
             * @param category
             */
            filterTree(categoryCodes) {
                categoryCodes = categoryCodes.sort();
                let categoryDatas = [];
                for (let i = 0; i < categoryCodes.length; i++) {
                    let _categoryCode = categoryCodes[i];
                    console.log("_categoryCode = " + _categoryCode);
                    if (_categoryCode < this.ENUMS.CHILD_CATEGORY_CODE_FLAG) {
                        //当前为大类代码,获取全部的小类编码
                        this.ENUMS.CATEGORY_DATA.find(item => {
                            if (item.code == _categoryCode) {
                                let _data = Object.assign({}, item);
                                categoryDatas.push(_data);
                                this.categoryMap[_categoryCode] = _data;
                            }
                        });
                    } else {
                        //当前为小类代码,获取大类编码
                        let _parentCode = this.getParentType(_categoryCode);
                        this.ENUMS.CATEGORY_DATA.find(item => {
                            if (item.code == _parentCode) {
                                if (!this.categoryMap[_parentCode]) {
                                    //未添加过该大类的处理
                                    let __data = Object.assign({}, item);
                                    __data.children = [];
                                    __data.childCategory = [];
                                    categoryDatas.push(__data);
                                    this.categoryMap[_parentCode] = __data;
                                }
                                //已经添加过该大类，执行小类的添加
                                let _children = item.children;
                                for (let _child in _children) {
                                    if (_children[_child].code == _categoryCode) {
                                        let ___data = Object.assign({}, _children[_child]);
                                        this.categoryMap[_parentCode].children.push(___data);
                                        this.categoryMap[_parentCode].childCategory.push(___data);
                                        this.categoryMap[_categoryCode] = ___data;
                                        break;
                                    }
                                }

                            }
                        });
                    }
                }
                return categoryDatas;
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.requestCategoryData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>