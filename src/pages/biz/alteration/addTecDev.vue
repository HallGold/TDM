<template>
    <div class="fill-content" style="padding-bottom: 16px">
        <div style="margin-bottom: 8px;margin-top: 4px">
            <el-button icon="el-icon-plus" type="primary" @click="addExecute()"
                       v-if="isEdit">新增服务项
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="addDev()"
                       v-if="isEdit">新增对象
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="addRow()"
                       v-if="isEdit && showRowBtn">手动增加变更对象
            </el-button>
            <el-button icon="el-icon-delete" type="primary" @click="deleteExecute()"
                       v-if="isEdit">删除服务项
            </el-button>
            <el-button icon="el-icon-delete" type="primary" @click="deleteDev()"
                       v-if="isEdit">删除对象
            </el-button>
        </div>
        <ice-editable-table height="270" :data="tableData" :ref="PAGE_ENUMS.REFS.EDIT_TABLE.REF"
                            @selection-change="editTableChange" :rules="rules">
            <el-table-column v-if="false"
                             label="服务项oid" prop="oid"></el-table-column>
            <el-table-column v-if="false"
                             label="对象oid" prop="devOid"></el-table-column>
            <el-table-column v-if="false"
                             label="实施单号" prop="executeNum"></el-table-column>
            <el-table-column v-if="false"
                             label="技术服务目录ID" prop="catalogId"></el-table-column>
            <el-table-column v-if="false"
                             label="创建人" prop="catalogCreator"></el-table-column>
            <el-table-column v-if="false"
                             label="创建code" prop="creatorCode"></el-table-column>
            <el-table-column v-if="false"
                             label="创建组织机构code" prop="orgCode"></el-table-column>
            <el-table-column v-if="false"
                             label="创建时间" prop="gmtCreate"></el-table-column>
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>
            <el-table-column
                    type="index"
                    width="30">
            </el-table-column>
            <el-table-column label="区域"
                             width="150" prop="area">
            </el-table-column>
            <el-table-column label="服务大类"
                             width="130" prop="categoryName">
            </el-table-column>
            <el-table-column label="服务名称"
                             width="130" prop="catalogName">
            </el-table-column>
            <el-table-column label="服务项"
                             width="150" prop="itemName">
            </el-table-column>
            <el-table-column label="实施对象"
                             width="220" prop="devName" v-if="!showRowBtn">
            </el-table-column>
            <ice-editable-table-column label="实施对象" :width="150" prop="devName" v-if="showRowBtn"
                                       type="input">
                <template slot-scope="scope">
                    <el-input :disabled="!isEdit|| !!scope.row.devId" placeholder="请输入实施对象"
                              v-model="scope.row.devName">
                    </el-input>
                </template>
            </ice-editable-table-column>
            <ice-editable-table-column label="变更对象Ip" v-if="false" prop="devIp"
                                       type="input">
            </ice-editable-table-column>
            <el-table-column v-if="false"
                             label="对象编号" prop="devNum">
            </el-table-column>
            <el-table-column v-if="false"
                             label="变更对象ID"
                             width="95" prop="devId">
            </el-table-column>
            <template v-for="(item,key) in columns">
                <el-table-column :label="item.label" :prop="item.prop" :width="item.width" v-if="!(item.type)">
                </el-table-column>
                <ice-editable-table-column :label="item.label" :width="item.width" :prop="item.prop" v-if="item.type"
                                           :type="item.type" :disabled="!isEdit">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row[item.prop]" type="datetime" v-if="item.type == 'date'"
                                        :disabled="!isEdit"
                                        format="yyyy-MM-dd HH:mm:ss" :placeholder="item.placeholder"></el-date-picker>
                        <el-input type="textarea" v-if="item.type == 'textarea'"
                                  :rows="2" :disabled="!isEdit" :placeholder="item.placeholder"
                                  v-model="scope.row[item.prop]">
                        </el-input>
                        <el-select :placeholder="item.placeholder" v-model="scope.row[item.prop]"
                                   v-if="item.type == 'select'"
                                   clearable :disabled="!isEdit">
                            <el-option
                                    v-for="(item,index) in item.data()"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </template>
                </ice-editable-table-column>
            </template>
            <el-table-column :width="100" fixed="right" label="操作" v-if="isEdit">
                <template slot-scope="scope">
                    <el-button type="text"
                               size="small" @click="openChangeDevInfo(scope.row.devId)" v-if="!!scope.row.devId">设备属性变更
                    </el-button>
                </template>
            </el-table-column>
        </ice-editable-table>
        <pro-sc-tech-tree :ref="PAGE_ENUMS.REFS.TECH_SELECT.REF" :is-callback="true"
                          @getData="getTechData"
                          v-if="PAGE_ENUMS.REFS.TECH_SELECT.SHOW"></pro-sc-tech-tree>
        <dev-select v-if="PAGE_ENUMS.REFS.DEV_SELECT.SHOW" :ref="PAGE_ENUMS.REFS.DEV_SELECT.REF"
                    :querys="devQueryCondition" :on-close-handler="selectDev"
                    :multiple="true"
                    :columns="devColumnsCondition.length > 0 ? devColumnsCondition : ''"></dev-select>
        <dev-property-change :dev-id="devId" :head-form-code="executeNum" :on-close-handler="onCloseHandler"
                             v-if="PAGE_ENUMS.REFS.DEV_PROPERTY_CHANGE.SHOW" :head-source="2" :dev-property-apply-id="''"
                             :ref="PAGE_ENUMS.REFS.DEV_PROPERTY_CHANGE.REF"></dev-property-change>
    </div>
</template>

<script>
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import ProScTechCatalog from "../../pro/sc/ProScTechCatalog";
    import ProScTechTree from "../../pro/sc/ProScTechTree";
    import DevSelect from "../dev/devSelect";
    import bizComm from "@/pages/biz/js/comm";
    import DevPropertyChange from "../dev/devPropertyChange";

    export default {
        name: "addTecDev",
        components: {
            DevPropertyChange,
            DevSelect, ProScTechTree, ProScTechCatalog, IceEditableTableColumn, IceEditableTable
        },
        mixins: [bizComm],
        props: {
            //单号
            executeNum: {
                type: String,
                default: ""
            },
            //是否显示手动增加设备按钮
            showRowBtn: {
                type: Boolean,
                default: true
            },
            //扩展列
            columns: {
                type: Array,
                default: () => {
                    return []
                }
            },
            //是否编辑
            isEdit: {
                type: Boolean,
                default: true
            },
            //设备选择页面查询页面
            devColumnsCondition: {
                type: Array,
                default: () => {
                    return []
                }
            },
            //表格校验规则
            rules: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            executeList: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                devQueryCondition: [],
                PAGE_ENUMS: {
                    REFS: {
                        EDIT_TABLE: {REF: "editTable"},
                        TECH_SELECT: {REF: "techSelect", SHOW: false},
                        DEV_SELECT: {REF: "devSelect", SHOW: false},
                        DEV_PROPERTY_CHANGE: {REF: "devPropertyChange", SHOW: false}
                    },
                    AREA_DATA: [],
                    ACTIONS: {
                        //获取联网类型
                        GET_NET_AREA_TYPE: {
                            URL: () => {
                                return "/pro/ProBaseArea/all";
                            },
                            TYPE: "get"
                        },
                        //根据设备ID获取设备详情数据
                        GET_DEV_DATA: {
                            URL: () => {
                                return "biz/BizDev/searchDevById";
                            },
                            TYPE: "get"
                        }
                    }
                },
                //网络区域类型分隔符
                netSeparator: "__",
                tableData: [],//表格数据
                currentSelectTech: [],//当前选中的技术服务目录
                currentIndex: 0,
                devMap: {},
                devId: "",
            }
        },
        methods: {
            /**
             * 从服务器获取联网类型
             */
            requestNetAreaData() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.axios(_this.PAGE_ENUMS.ACTIONS.GET_NET_AREA_TYPE, {}, [res => {
                        for (let i = 0; i < res.data.length; i++) {
                            _this.PAGE_ENUMS.AREA_DATA.push({
                                code: res.data[i].unit + _this.netSeparator + res.data[i].network,
                                name: res.data[i].shortname,
                                oid: res.data[i].oid
                            });
                        }
                        resolve();
                    }, res => {
                        _this.$message.error("加载联网类型失败!");
                        reject(res);
                    }, res => {
                        _this.$message.error("加载联网类型失败!");
                        reject(res);
                    }])
                });
            },
            /**
             * 根据区域id获取区域code
             * @param areaId
             */
            getAreaById(areaId) {
                let _return = {};
                for (let i = 0; i < this.PAGE_ENUMS.AREA_DATA.length; i++) {
                    let _area = this.PAGE_ENUMS.AREA_DATA[i];
                    if (_area.oid == areaId) {
                        _return = _area;
                        break;
                    }
                }
                return _return;
            },
            /**
             * 跟基友区域名称获取区域
             * @param area
             */
            getAreaByName(area) {
                let _return = {};
                for (let i = 0; i < this.PAGE_ENUMS.AREA_DATA.length; i++) {
                    let _area = this.PAGE_ENUMS.AREA_DATA[i];
                    if (_area.name == area) {
                        _return = _area;
                        break;
                    }
                }
                return _return;
            },
            /**
             * 新增技术服务项
             */
            addExecute() {
                let _this = this;
                this.PAGE_ENUMS.REFS.TECH_SELECT.SHOW = true;
                this.$nextTick(() => {
                    _this.$refs[_this.PAGE_ENUMS.REFS.TECH_SELECT.REF].openDialog();
                });
                // this.$refs.executeGrid.toggleSelectionByIndex(0);
            },
            /**
             * 技术服务目录选择后触发
             * @param data
             */
            getTechData(data) {
                let _this = this;
                data.forEach(item => {
                    if (_this.findSameRowByCode(_this.tableData, item.catalogId, "catalogId") == -1) {
                        let area = _this.getAreaById(item.areaId);
                        _this.tableData.push({
                            executeNum: _this.executeNum,
                            catalogId: item.catalogId,
                            categoryName: item.bigCategoryName,
                            catalogName: item.categoryName,
                            itemName: item.name,
                            netArea: area.code.split(_this.netSeparator)[0],
                            netType: area.code.split(_this.netSeparator)[1],
                            area: item.areaName
                        });
                        this.devMap[item.catalogId] = [];
                    }
                });
            },
            /**
             * 服务目录选中后触发
             * @param rows
             */
            editTableChange(rows) {
                console.log(rows);
                this.currentSelectTech = rows;
                if (rows.length == 1) {
                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].catalogId == rows[0].catalogId) {
                            this.currentIndex = i + 1;
                            break;
                        }
                    }
                }
                console.log(this.currentIndex);
            },
            /**
             * 打开设备选择页面
             */
            openDevSelect() {
                let _this = this;
                this.PAGE_ENUMS.REFS.DEV_SELECT.SHOW = true;
                this.$nextTick(() => {
                    _this.$refs[_this.PAGE_ENUMS.REFS.DEV_SELECT.REF].openDialog();
                });
            },
            /**
             * 初始化设备查询条件
             */
            initDevQueryCondition() {
                let _this = this;
                if (!this.currentSelectTech[0].netType) {
                    let _area = this.getAreaByName(this.currentSelectTech[0].area).code.split(this.netSeparator);
                    this.currentSelectTech[0].netType = _area[1];
                    this.currentSelectTech[0].netArea = _area[0];
                }
                this.devQueryCondition = [
                    {
                        type: 'static',
                        label: '联网类型type',
                        code: 'netType',
                        width: 80,
                        value: _this.currentSelectTech[0].netType
                    }, {
                        type: 'static',
                        label: '联网类型code',
                        code: 'netArea',
                        width: 80,
                        value: _this.currentSelectTech[0].netArea
                    }
                ];
            },
            /**
             * 增加设备按钮响应事件
             */
            addDev() {
                if (!!this.checkCurrentSelectTech()) {
                    this.openDevSelect();
                }
            },
            /**
             * 新增设备前判断当前选择的服务项是否合规
             * @return Boolean
             */
            checkCurrentSelectTech() {
                let value = true;
                if (this.currentSelectTech.length == 0) {
                    this.$alert("请选择相关服务项", "提示", {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                    value = false;
                } else if (this.currentSelectTech.length > 1) {
                    this.$alert("请选择一条服务项", "提示", {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                    value = false;
                }
                return value;
            },
            /**
             * 加载dev数据
             */
            loadDevById(devId) {
                return new Promise((resolve, reject) => {
                    this.axios(this.PAGE_ENUMS.ACTIONS.GET_DEV_DATA, {devId: devId}, [res => {
                        resolve(res.data);
                    }, res => {
                        reject(res.code);
                    }, res => {
                        reject("请求异常!");
                    }]);
                });
            },
            /**
             * 根据code查找相同行
             * @param data
             * @param code
             * @param filedName
             * @returns {number}
             */
            findSameRowByCode(data, code, filedName) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i][filedName] == code) {
                        return i;
                    }
                }
                return -1;
            },
            /**
             * 选择设备页面关闭后触发
             * @param data
             * @return {Promise<unknown>}
             */
            selectDev(data) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        if (_this.findSameRowByCode(_this.devMap[_this.currentSelectTech[0].catalogId], data[i].oid, "devId") == -1) {
                            _this.loadDevById(data[i].oid).then(res => {
                                let _name = '';
                                if (!res.dataDTO.commDTO.masterIp || res.dataDTO.commDTO.masterIp == "") {
                                    _name = res.dataDTO.commDTO.name;
                                } else {
                                    _name = res.dataDTO.commDTO.name + "【" + res.dataDTO.commDTO.masterIp + "】";
                                }
                                let devList = {
                                    devName: _name,
                                    devIp: res.dataDTO.commDTO.masterIp,
                                    devNum: res.dataDTO.commDTO.devSn,
                                    devId: res.dataDTO.commDTO.oid
                                };
                                let catalogId = _this.currentSelectTech[0].catalogId;
                                _this.devMap[catalogId].push(devList);
                                _this.setDevTableData(catalogId, devList);
                            });
                        }
                    }
                    _this.PAGE_ENUMS.REFS.DEV_SELECT.SHOW = false;
                });
            },
            /**
             * 设置设备数据
             * @param catalogId 服务目录id
             * @param devList 设备list
             */
            setDevTableData(catalogId, devList) {
                if (!this.currentSelectTech[0].devName || this.currentSelectTech[0].devName == "") {
                    Object.assign(this.currentSelectTech[0], devList);
                } else {
                    this.tableData.splice(this.currentIndex, 0, {
                        execuNum: this.currentSelectTech[0].execuNum,
                        catalogId: this.currentSelectTech[0].catalogId,
                        categoryName: this.currentSelectTech[0].categoryName,
                        catalogName: this.currentSelectTech[0].catalogName,
                        itemName: this.currentSelectTech[0].itemName,
                        netArea: this.currentSelectTech[0].netArea,
                        netType: this.currentSelectTech[0].netType,
                        area: this.currentSelectTech[0].area,
                        devName: devList.devName,
                        devIp: devList.devIp,
                        devNum: devList.devNum,
                        devId: devList.devId
                    });
                }
            },
            /**
             * 跟基友区域名称获取区域
             * @param area
             */
            getAreaByName(area) {
                let _return = {};
                for (let i = 0; i < this.AREA_DATA.length; i++) {
                    let _area = this.AREA_DATA[i];
                    if (_area.name == area) {
                        _return = _area;
                        break;
                    }
                }
                return _return;
            },
            /**
             * 手动增加设备
             */
            addRow() {
                if (!!this.checkCurrentSelectTech()) {
                    let _devList = {
                        devName: "",
                        devIp: "",
                        devNum: "",
                        devId: ""
                    };
                    this.setDevTableData(this.currentSelectTech[0].catalogId, _devList);
                }
            },
            /**
             * 删除服务项
             */
            deleteExecute() {
                if (!!this.checkSelect('tech')) {
                    this.deleteTechList(this.currentSelectTech);
                }
            },
            /**
             * 删除设备
             */
            deleteDev() {
                if (!!this.checkSelect('dev')) {
                    this.deleteDevMap(this.currentSelectTech);
                    for (let i = 0; i < this.currentSelectTech.length; i++) {
                        let item = this.currentSelectTech[i];
                        this.tableData.remove(item);
                        if (!this.getCurrentCatalogByCatalogId(item.catalogId)) {
                            this.tableData.push({
                                executeNum: this.executeNum,
                                catalogId: item.catalogId,
                                categoryName: item.categoryName,
                                catalogName: item.catalogName,
                                itemName: item.itemName,
                                netArea: item.netArea,
                                netType: item.netType,
                                area: item.area
                            });
                        }
                    }
                }
            },
            /**
             * 删除设备map对象
             * @param list
             */
            deleteDevMap(list) {
                let _devMapList = [];
                for (let i = 0; i < list.length; i++) {
                    _devMapList.push(...this.devMap[list[i].catalogId]);
                    for (let j = 0; j < _devMapList.length; j++) {
                        if (!!_devMapList[j].devId && _devMapList[j].devId == list[i].devId) {
                            this.devMap[list[i].catalogId].remove(_devMapList[j]);
                        }
                    }
                }
            },
            /**
             * 根据catalogId判断当前表格数据是否有数据
             * @param catalogId
             * @return Boolean
             */
            getCurrentCatalogByCatalogId(catalogId) {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (catalogId == this.tableData[i].catalogId) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * 删除服务或设备时判断是否有选中列
             * @return {boolean}
             */
            checkSelect(type) {
                if (type == 'tech') {
                    if (this.currentSelectTech.length == 0) {
                        this.$message.warning("请选择需要删除的服务项");
                        return false;
                    }
                } else if (type == 'dev') {
                    if (this.currentSelectTech.length == 0) {
                        this.$message.warning("请选择需要删除的设备");
                        return false;
                    }
                }
                return true;
            },
            /**
             * 删除服务项
             * @param list
             */
            deleteTechList(list) {
                let _data = [];
                _data.push(...this.tableData);
                for (let i = 0; i < list.length; i++) {
                    this.devMap[list[i].catalogId] = [];
                    for (let j = 0; j < _data.length; j++) {
                        if (list[i].catalogId == _data[j].catalogId) {
                            this.tableData.remove(_data[j]);
                        }
                    }
                }
                this.$message.success('删除服务项成功');
            },
            /**
             * 组装向父页面传的值
             * @return {{catalogData: [], map: {}}}
             */
            assembleDevMap() {
                let _returnValue = {
                    map: {},
                    catalogData: []
                };
                for (let i = 0; i < this.tableData.length; i++) {
                    if (!_returnValue.map[this.tableData[i].catalogId]) {
                        _returnValue.catalogData.push(this.tableData[i]);
                        _returnValue.map[this.tableData[i].catalogId] = [];
                        for (let j = 0; j < this.tableData.length; j++) {
                            if (this.tableData[i].catalogId == this.tableData[j].catalogId) {
                                delete this.tableData[j].oid;
                                _returnValue.map[this.tableData[i].catalogId].push(Object.assign({}, this.tableData[j]));
                            }
                        }
                    }
                }
                return _returnValue;
            },
            /**
             * 父页面调用，获取页面数据
             * @return {*|{catalogData: *[], map: {}}}
             */
            getData() {
                return this.assembleDevMap();
            },
            /**
             * 校验页面数据
             * @return {Promise<unknown>}
             */
            validateData() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.$refs[this.PAGE_ENUMS.REFS.EDIT_TABLE.REF].validateAll((valid) => {
                        if (valid) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            /**
             * 初始化页面数据
             */
            initControls() {
                if (this.executeList) {
                    for (let i = 0; i < this.executeList.length; i++) {
                        for (let j in this.executeList[i]) {
                            if (this.executeList[i][j] instanceof Array) {
                                let _list = this.executeList[i][j];
                                this.devMap[this.executeList[i].catalogId] = _list;
                                delete this.executeList[i][j];
                                for (let k = 0; k < _list.length; k++) {
                                    _list[k].devOid = _list[k].oid;
                                    delete _list[k].oid;
                                    let __list = Object.assign({}, this.executeList[i]);
                                    this.tableData.push(Object.assign(__list, _list[k]));
                                }
                                break;
                            }
                        }
                    }
                }
            },
            openChangeDevInfo(devId) {
                console.log(devId);
                this.devId = devId;
                this.PAGE_ENUMS.REFS.DEV_PROPERTY_CHANGE.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUMS.REFS.DEV_PROPERTY_CHANGE.REF].openDialog();
                });
            },
            onCloseHandler(e) {
                return new Promise((resolve, reject) => {
                    this.PAGE_ENUMS.REFS.DEV_PROPERTY_CHANGE.SHOW = false;
                    resolve();
                });
            }
        },
        mounted() {
            this.requestNetAreaData().then(this.initControls);
        }
    }
</script>

<style scoped>

</style>