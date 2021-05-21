<template>
    <ice-dialog title='请选择'
                width="350px"
                :buttons="bathButtons"
                remounted
                :visible.sync="innerVisible" :close-on-click-modal="false">
        <div class="ice-container" style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height:400px">
            <div style="flex-grow: 1;display: flex;flex-direction: row;width: 100%">
                <ice-tree
                        :treeData="categoryTreeData"
                        label-prop="name"
                        value-prop="code"
                        :showTreeCheckbox="true"
                        @node-check="checkedNodesClick"
                        ref="tree"
                        style="width:100%">
                    <slot name="prefix" slot="prefix"></slot>
                </ice-tree>
            </div>
        </div>
    </ice-dialog>
</template>

<script>
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    export default {
        name: "devCategoryTree",
        props:{
            filterTreeData:{
                type: Array,
                default: () => []
            }
        },
        components: {IceTree,IceDialog},
        mixins:[bizComm,devComm,renderer],
        data(){
            return {
                bathButtons:[
                    {name: '保存', iscannel: false,click: this.saveBatchData,disabled:()=>{
                        return this.datalist.length===0;
                        }},
                    {name: '返回', iscannel: true},
                ],
                innerVisible:false,
                categoryTreeData:[],//展示的设备分类树
                selectedNode:{},
                selectedRow:{},
                categoryMap:{},
                datalist:[],
            }
        },
        methods:{
            openDialog(){
                this.innerVisible = true;
                this.initCategoryTreeData();
            },
            refresh() {
                this.$nextTick(()=>{
                    this.$refs.tree.refresh();
                })
            },
            getChildVal(arr){
               for(let i=0;i<arr.length;i++){
                   if(!arr[i].children){
                       this.datalist.push(arr[i]);
                   }
               }
            },
            checkedNodesClick(data,node){
                this.datalist = [];
                this.getChildVal(node.checkedNodes);
            },
            saveBatchData(){
                this.$emit("nodeClick",this.datalist);
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
                        let _this = this;
                        this.ENUMS.CATEGORY_DATA.find(item => {
                            if (item.code == _categoryCode) {
                                let _data = Object.assign({}, item);
                                categoryDatas.push(_data);
                                _this.categoryMap[_categoryCode] = _data;
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
            },
        },
        mounted(){
            let prepareTaskChain = [
                this.requestCategoryData()
            ];
            Promise.all(prepareTaskChain).then();
        },
        watch:{
        }
    }
</script>

<style lang="less" scoped>


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