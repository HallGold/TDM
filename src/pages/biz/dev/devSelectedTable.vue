<template>
    <el-container>
        <el-header v-if="!readonly" style="height: 20px">
            <el-button type="primary" icon="el-icon-plus" @click="selectDev">添加</el-button>
            <template v-for="button in extendsButton">
                <el-button :type="button.type||primary" :icon="button.icon" @click="button.clickHandler">
                    {{button.name}}
                </el-button>
            </template>
        </el-header>
        <el-main>
            <ice-tree-table ref="positionTreeTable" :data="table.selectedData" showProp="name"
                            border :expand-all="true" :showCheck="!readonly && showCheck">
                <template v-for="column in table.columns">
                    <el-table-column :label="column.label" :width="column.width"
                                     align="center">
                        <template slot-scope="scope">
                            {{!!column.renderCell?column.renderCell(scope.row):scope.row[column.code]}}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="操作" width="210" v-if="!readonly && allowRemove">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small" @click="removeRecord(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </ice-tree-table>
            <dev-select ref="devSelect" v-if="devSelectShow"
                        :dataUrl="dataUrl"
                        :originQuery="originQuery"
                        :querys="extendsQuery"
                        :multiple="true"
                        :filterTreeData="filterTreeData"
                        :on-close-handler="selectOverHandler"></dev-select>
        </el-main>
    </el-container>
</template>

<script>
    import IceTreeTable from "@/components/common/base/IceTreeTable";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import renderer from "@/pages/biz/dev/js/comm/renderer";
    import DevSelect from "./devSelect";

    export default {
        name: "devSelectedTable",
        mixins: [bizComm, devComm, renderer],
        components: {DevSelect, IceTreeTable},
        props: {
            //添加设备按钮点击后加载数据的自定义Url
            dataUrl: {
                type: String,
                default: undefined
            },
            //显示checkbox,目前不做支持--2019年10月15日
            showCheck: {
                type: Boolean,
                default: false
            },
            //是否允许删除设备
            allowRemove: {
                type: Boolean,
                default: true
            },
            //是否只读
            readonly: {
                type: Boolean,
                default: false
            },
            //自定义的原始列
            originColumns: {
                type: Array,
                default: undefined
            },
            //扩展列
            extendsColumns: {
                type: Array,
                default: undefined
            },
            //自定义查询条件
            originQuery: {
                type: Array,
                default: undefined
            },
            //扩展的查询条件
            extendsQuery: {
                type: Array,
                default: undefined
            },
            //初始化grid中的数据
            originSelectedData: {
                type: Array,
                default: () => []
            },
            //需要显示的设备分类数组 :filterTreeData=[10,1405,1101,1102]
            filterTreeData: {
                type: Array,
                default: undefined
            },
            //扩展button
            extendsButton: {
                type: Array,
                default: undefined
            }
        },
        data() {
            return {
                devSelectShow: false,
                table: {
                    //已选的主设备oid Map
                    selectedDataMap: {},
                    //列
                    columns: [],
                    //数据
                    selectedData: [
                        //     {
                        //     id: "1",
                        //     name: "A",
                        //     sn: "safkdjhsakfdshfj",
                        //     secretSn: "sdfhjgsajsdvfhjg",
                        //     category: 10,
                        //     childType: 1001,
                        //     children: [{
                        //         id: "11",
                        //         name: "A1",
                        //         children: [{
                        //             id: "111",
                        //             name: "A11",
                        //             sn: "safkdjhsakfdshfj",
                        //             secretSn: "sdfhjgsajsdvfhjg",
                        //         }]
                        //     }]
                        // }, {
                        //     id: "2",
                        //     name: "B",
                        //     sn: "safkdjhsakfdshfj",
                        //     secretSn: "sdfhjgsajsdvfhjg",
                        // }
                    ]
                }
            }
        },
        methods: {
            /**
             * 初始化列属性
             */
            initColumns() {
                let _this = this;
                this.table.columns = this.originColumns || [
                    {
                        label: '设备类型', code: 'category', width: 80, renderCell: row => {
                            return _this.onCategoryRenderer(row.category);
                        }
                    },
                    {
                        label: '设备子类', code: 'childType', width: 90, renderCell: row => {
                            return _this.onChildTypeRenderer(row.childType);
                        }
                    },
                    {label: '资产编号', code: 'sn', width: 100},
                    {label: '保密编号', code: 'secretSn', width: 100},
                    {
                        label: '联网类型/用途', code: 'netAreaAndType', width: 80, ignore: true, renderCell: row => {
                            return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                        }
                    },
                    {
                        label: '密级',
                        code: 'secretLevel',
                        width: 50,
                        renderCell: row => {
                            return _this.onSecretLevelRenderer(row.secretLevel)
                        }
                    },
                    {
                        label: '自主可控', code: 'controllable', width: 80, renderCell: row => {
                            return _this.onYesNoRenderer(row.controllable);
                        }
                    },
                    {label: '责任人', code: 'dutyName', width: 60},
                    {label: '责任部门', code: 'deptName', width: 80},
                    {
                        label: '使用情况', code: 'state', width: 80, renderCell: row => {
                            return _this.onStateRenderer(row.state, row.category);
                        }
                    }
                ];
                if (this.extendsColumns) {
                    this.table.columns.push(...this.extendsColumns);
                }
            },
            /**
             * 初始化列表数据
             */
            initTableData() {
                this.table.selectedData = this.originSelectedData;
                this.table.selectedData.forEach(data => {
                    this.table.selectedDataMap[data.oid || data.devId] = true;
                })
            },
            /**
             * 初始化控件
             */
            initControls() {
                this.initColumns();
                this.initTableData();
            },
            /**
             * 行数据点击回调
             */
            selectedDataClickHandler() {
                debugger;
            },
            /**
             * 新增设备
             */
            selectDev() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**
             * 设备选择完成处理
             * @param data
             */
            selectOverHandler(data) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    let devIds = [];
                    data.forEach(item => {
                        devIds.push(item.oid);
                    });
                    //加载所选设备的从设备
                    _this.requestReleDevData(devIds.toString()).then(res => {
                        //结果显示在grid中
                        _this.devSelectShow = false;
                        _this.assembleTableData(res.data);
                    });
                });
            },
            /**
             * 将request数据组装回table中
             * @param requestData
             */
            assembleTableData(requestData) {
                requestData.forEach(data => {
                    console.log(data.devId);
                    if (!!this.table.selectedDataMap[data.devId]) {
                        //存在map中
                        console.log("存在map中");
                    } else {
                        //不存在map中,加入到table中
                        console.log("不存在map中,加入到table中");
                        this.table.selectedData.push(data);
                        data.children = data.devBelongDTOList;
                        this.table.selectedDataMap[data.devId] = true;
                    }
                });
            },
            /**
             * 根据设备ids,获取关联设备数据
             * @param devIds String
             */
            requestReleDevData(devIds) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.axios(_this.ENUMS.ACTIONS.GET_RELE_DEV_BY_IDS, {devIds: devIds}, [res => {
                        resolve(res);
                    }, res => {
                        //请求结果为失败
                        this.$message(res.code);
                    }, res => {
                        this.$message("请求异常!");
                    }])
                });
            },
            /**
             * 获取列表中的数据
             * @returns {default.props.originSelectedData|{default, type}|*}
             */
            getData() {
                return this.table.selectedData;
            },
            /**
             * 对外提供的强行重写表格数据的方法
             * @param data
             */
            setData(data) {
                this.table.selectedData = data;
            },
            /**
             * 删除行数据
             * @param index
             * @param row
             */
            removeRecord(index, row) {
                let newData = [];
                let _this = this;
                this.table.selectedData = this.table.selectedData.filter((item, index) => {
                    if (item.devId == row.devId) {
                        //删除数据
                        _this.table.selectedDataMap[item.devId] = false;
                        return false;
                    } else {
                        item.devBelongDTOList = this.recursionData(item.devBelongDTOList, row.devId);
                        return true;
                    }
                });
            },
            /**
             * 递归数组并删除指定devId的数据
             * @param data
             * @param devId
             * @param callFn
             */
            recursionData(data, devId) {
                let _this = this;
                data = data.filter(item => {
                    if (item.devId == devId) {
                        //删除数据
                        return false;
                    } else {
                        item.devBelongDTOList = _this.recursionData(item.devBelongDTOList, devId);
                        return true;
                    }
                });
                return data;
                // if (!!data && data.length > 0) {
                //     console.log("递归" + devId)
                //     for (let j in data) {
                //         let cur = data[j];
                //         if (cur.devId == devId) {
                //             callFn(cur);
                //         } else {
                //             this.recursionData(data[j].devBelongDTOList, devId, callFn);
                //         }
                //     }
                // }
            }
        },
        mounted() {
            let _this = this;
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE, this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData(),
                this.requestNetAreaTypeData(),
                this.requestCommStateData(),
                this.requestSystemStateData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>

</style>