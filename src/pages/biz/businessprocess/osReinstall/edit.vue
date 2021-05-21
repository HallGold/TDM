<template>
    <div class="content-filled">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :rules="formRules" :model="devEnterNetData" status-icon :ref="PAGE_ENUM.REFS.FORM.REF">
                    <ice-grid-layout name="申请人信息" :columns="2">
                        <el-form-item label="申请人" label-width="140px">
                            <el-input autocomplete="off" :disabled="true" v-model="devEnterNetData.afUserName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请单位" label-width="140px">
                            <el-input :readonly="true"
                                      :disabled="true" v-model="devEnterNetData.afDepartmentName"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devEnterNetData.afPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间" prop="afDate" label-width="140px">
                            <el-input :disabled="true" v-model="devEnterNetData.afDate"></el-input>
                            <!--<el-date-picker type="datetime"
                                            :disabled="flowScope.formReadonly"
                                            format="yyyy-MM-dd HH:mm" v-model="devEnterNetData.afDate"></el-date-picker>-->
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="涉密服务器设备重装操作系统相关信息" :columns="2">
                        <el-form-item label="" prop="typeDescPe" label-width="0px" layout="2">
                            <el-button icon="el-icon-plus" type="primary" @click="addDev()"
                                       v-if="!flowScope.formReadonly">选择设备
                            </el-button>
                            <el-button icon="el-icon-delete" type="primary" @click="deleteDev()"
                                       v-if="!flowScope.formReadonly">删除设备
                            </el-button>
                        </el-form-item>
                        <ice-editable-table :data="devEnterNetData.detailList" ref="executeTable" layout="2"
                                            :height="250" @selection-change="devTableChange">
                            <el-table-column
                                    type="selection" fixed width="30">
                            </el-table-column>
                            <el-table-column
                                    label="设备编号" width="120" prop="devSn">
                            </el-table-column>
                            <ice-editable-table-column label="新操作系统名称" :width="120"
                                                       type="input">
                                <template slot-scope="scope">
                                    <el-input style="width:100%" :disabled="flowScope.formReadonly"
                                                  v-model="scope.row.afterOsName">
                                    </el-input>
                                </template>
                            </ice-editable-table-column>
                            <ice-editable-table-column label="新操作系统版本" :width="120"
                                                       type="input">
                                <template slot-scope="scope">
                                    <el-input style="width:100%" :disabled="flowScope.formReadonly"
                                              v-model="scope.row.afterOsVersion">
                                    </el-input>
                                </template>
                            </ice-editable-table-column>
                            <el-table-column
                                    label="设备IP"
                                    width="120" prop="masterIp">
                            </el-table-column>
                            <el-table-column
                                    label="Mac地址"
                                    width="120" prop="mac">
                            </el-table-column>
                            <ice-editable-table-column label="主机名" :width="120"
                                                       type="input">
                                <template slot-scope="scope">
                                    <el-input style="width:100%" :disabled="flowScope.formReadonly"
                                              v-model="scope.row.hostname">
                                    </el-input>
                                </template>
                            </ice-editable-table-column>
                            <ice-editable-table-column label="重装操作系统原因" :width="380"
                                                       type="input">
                                <template slot-scope="scope">
                                    <el-input style="width:100%" :disabled="flowScope.formReadonly"
                                              v-model="scope.row.afReason">
                                    </el-input>
                                </template>
                            </ice-editable-table-column>
                        </ice-editable-table>
<!--                        <ice-query-grid title="关联设备"-->
<!--                                        :gridData="devEnterNetData.childList"-->
<!--                                        :query="[]"-->
<!--                                        :columns="columns"-->
<!--                                        ref="contactQueryGrid"-->
<!--                                        :operations="[]"-->
<!--                                        :operationsWidth=100-->
<!--                                        :minHeight="200"-->
<!--                                        :pagination="false"-->
<!--                                        layout="2"-->
<!--                                        :buttons="[]">-->
<!--                        </ice-query-grid>-->
                        <el-form-item label="设备责任人" label-width="140px">
                            <el-input autocomplete="off" v-model="devEnterNetData.dutyName" :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="设备责任部门" label-width="140px">
                            <el-input autocomplete="off" v-model="devEnterNetData.dutyOrgName" :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请原因" label-width="140px" prop="afReason" layout="1">
                            <!--   <el-input type="textarea" :rows="4" placeholder="请输入申请原因" map-type-code="ENTER_REASON"
                                         v-model="devEnterNetData.afReason" :disabled="flowScope.formReadonly"></el-input>-->
                            <ice-select map-type-code="ENTER_REASON" placeholder="请选择"
                                        v-model="devEnterNetData.afReason"
                                        :disabled="flowScope.formReadonly"></ice-select>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
                <template v-if="false">
                    <process-form :form-data="devEnterNetData"></process-form>
                </template>
            </div>
        </ice-flow-form>
        <dev-select :ref="PAGE_ENUM.REFS.DEV_SELECT.REF" v-if="PAGE_ENUM.REFS.DEV_SELECT.SHOW"
                    :multiple="true" :get-all-dev-info="true"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import processForm from "./process"
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IcePersionByDeptSelector from "@/components/common/biz/IcePersionByDeptSelector";
    import DevSelect from "@/pages/biz/dev/devSelect";
    import bizComm from "@/pages/biz/js/comm";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import devComm from "../../dev/js/comm/devComm"
    import editRenderer from "./js/renderer"
    import editComm from "./js/comm"

    export default {
        name: "edit",
        components: {
            DevSelect,
            IcePersionByDeptSelector,
            IceFlowForm,
            IceEditableTable,
            IceEditableTableColumn,
            IceGridLayout,
            IceQueryGrid,
            IceSelect,
            IcePersionSelector,
            processForm
        },
        mixins: [bizComm, renderer, devComm, editRenderer, editComm],
        data() {
            return {
                formRules: {
                    afReason: {required: true, message: '请选择系统重装原因', trigger: 'blur'},
                    afDate: {required: true, message: '请选择申请时间'}
                },
                devEnterNetData: {
                    oid: "",
                    afNo: "",//审批单号
                    afDate: "",//申请时间
                    afUserCode: "",//申请人编码
                    afUserName: "",//申请人名字
                    afDepartmentCode: "",//申请人部门编码
                    afDepartmentName: "",//申请人部门名字
                    afOrgCode: "",//申请人单位编码
                    afOrgName: "",//申请人单位名字
                    afReason: "",//申请原因
                    afPhone: "",//申请人联系电话
                    dutyName: "",//责任人
                    deptName: "",//责任部门
                    dutyCode: "",//责任人code
                    dutyOrgCode: "",//责任人orgcode
                    dutyOrgName: "",//责任人orgName
                    deptCode: "",//责任人部门code
                    dutySecretLevel: "",//责任人涉密等级
                    detailList: [],//设备list
                    childList: []//关联设备list
                },
                formReadonly: false,
                columns: [],
                PAGE_ENUM: {
                    REFS: {
                        DEV_SELECT: {REF: "devSelect", SHOW: false},
                        FORM: {REF: "form"}
                    },
                    //部门选择以及人员选择mode
                    MODE: "readonly",
                    MODE_TYPE: {
                        READ_ONLY: "readonly",
                        ONLY_SELECT: "onlySelect"
                    },
                },
                childTypeData: [],
                devSelected: [],
                visible:''
            }
        },
        methods: {
            /**
             * 初始化页面数据
             * @param flowcont
             * @param bizdata
             */
            flowReady(flowcont, bizdata) {
                Object.assign(this.devEnterNetData, bizdata);
                this.setAfDeptName();
                this.initStyle();
                this.setCurrentPlace(this.devEnterNetData.detailList);
            },
            setAfDeptName() {
                // this.devEnterNetData.afDepartmentName = this.devEnterNetData.afDepartmentName + "[" + this.devEnterNetData.afOrgName + "]"
            },
            /**
             * 流程操作按钮监听事件
             * @param flowContext
             * @param bizdata
             */
            flowOperateBtn(flowContext, bizdata) {
                return Promise.all([this.$refs[this.PAGE_ENUM.REFS.FORM.REF].validate(), this.validateGridData()]);
            },
            /**
             * 向流程引擎传递数据
             * @returns {devEnterNetData|{}}
             */
            flowBizData() {
                return this.devEnterNetData;
            },
            /**
             * 校验表格数据
             */
            validateGridData() {
                let validate = true;
                let _this = this;
                return new Promise((resolve, reject) => {
                    if (_this.devEnterNetData.detailList.length == 0) {
                        _this.$alert("请选择需要重装系统的设备", "提示");
                        validate = false;
                    }
                    if (validate) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            },
            /**
             * 设备责任人选择
             */
            selectConfirm(row) {
                this.devEnterNetData.dutyOrgCode = row[0].deptCode;//责任人orgcode
            },
            /**
             * 检查所选设备是否能批量申请
             */
            checkMultipleApplyDev(datas) {
                let allDetailList = datas.concat(this.devEnterNetData.detailList);
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    Object.assign(_data, _data.commDTO);
                    _data.devId = _data.oid;
                    delete _data.oid;
                    for (let j = 1; j < allDetailList.length; j++) {
                        let _list = allDetailList[j].commDTO ? Object.assign(allDetailList[j], allDetailList[j].commDTO) : allDetailList[j];
                        if (_data.deptCode != _list.deptCode || _data.dutyCode != _list.dutyCode || _data.isVersion != _list.isVersion) {
                            this.$alert("请选择【设备责任单位】【设备责任人】以及【是否安装操作系统】相同的设备!", "提示");
                            return;
                        }
                    }
                    this.setCurrentPlace(_data);
                    this.setNetAreaCode(_data);
                    this.devEnterNetData.detailList.push(_data);
                    this.devEnterNetData.childList.push(..._data.childList);
                    this.setDutyUserInfo(_data);
                }
            },
            /**
             * 设置责任人信息
             */
            setDutyUserInfo(data) {
                let _this = this;
                _this.devEnterNetData.dutyName = data.dutyName;
                // this.getDeptByCode(data.dutyOrgCode).then(res => {
                _this.devEnterNetData.dutyName = data.dutyName;
                _this.devEnterNetData.dutyCode = data.dutyCode;
                _this.devEnterNetData.deptName = data.deptName;
                _this.devEnterNetData.deptCode = data.deptCode;
                _this.devEnterNetData.dutyOrgCode = data.dutyOrgCode;
                _this.devEnterNetData.dutyOrgName = data.dutyOrgCode;//res.deptName;
                _this.devEnterNetData.isVersion = data.isVersion;
                _this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.ONLY_SELECT;
                // });
            },
            /**
             * 根据部门code获取部门名称
             */
            getDeptByCode(code) {
                return new Promise((reslove, reject) => {
                    this.axios(this.ENTER_ENUMS.ACTIONS.GET_DEPT_BY_CODE, {deptCode: code}, [res => {
                        reslove(res.data);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            /**
             * 设备选择页面关闭事件
             * @param data
             */
            selectOverHandler(data) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    let checkArr = [];
                    for (let i = 0; i < data.length; i++) {
                        if (_this.findSameRowByCode(_this.devEnterNetData.detailList, data[i].oid, "devId") == -1) {
                            checkArr.push(_this.getDevById(data[i].oid));
                        }
                    }
                    Promise.all(checkArr).then(res => {
                        _this.checkMultipleApplyDev(res);
                    });
                    resolve();
                    _this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = false;
                });
            },
            /**
             * 设置是否操作系统安装
             */
            setIsVersion(version) {
                if (!version || version == "") {
                    return this.ENUMS.YES_NO.NO
                }
                return this.ENUMS.YES_NO.YES;
            },
            /**
             * 设置设备相关数据
             */
            getDevById(devId) {
                let _this = this;
                return new Promise((resovle, reject) => {
                    this.loadDevById(devId).then(res => {
                        let resData = {
                            childList: [],
                            commDTO: res.dataDTO.commDTO
                        };
                        resData.childList = _this.getChildList(res.dataDTO.dependDTOList);
                        resData.commDTO.mac = _this.convertToString("mac", res.dataDTO.macIpDTOList, ",");
                        if (res.dataDTO.extendData) {
                            resData.commDTO.isVersion = _this.setIsVersion(res.dataDTO.extendData.osVersion);
                        } else {
                            resData.commDTO.isVersion = _this.ENUMS.YES_NO.YES;
                        }
                        resovle(resData);
                    }).catch(res => {
                        reject(res);
                    });
                });
            },
            /**
             * 获取关联设备
             */
            getChildList(data) {
                let res = [];
                for (let i = 0; i < data.length; i++) {
                    let _cur = data[i].dependDevDTO;
                    _cur.extendData = _cur.extendData || {};
                    res.push({
                        devId: _cur.commDTO.oid,
                        name: _cur.commDTO.name,
                        category: _cur.commDTO.category,
                        childType: _cur.commDTO.childType,
                        secretLevel: _cur.commDTO.secretLevel,
                        secretSn: _cur.commDTO.secretSn,
                        state: _cur.commDTO.state,
                        shape: _cur.extendData.shape,
                        license: _cur.extendData.license
                    });
                }
                return res;
            },
            /**
             * 将列表中指定field的值组装成用separator分割的字符串
             * @param fieldName
             * @param dealData
             * @param separator
             * @returns {string}
             */
            convertToString(fieldName, dealData, separator) {
                let returnData = "";
                if (dealData) {
                    for (let i = 0; i < dealData.length; i++) {
                        returnData += dealData[i][fieldName] + separator;
                    }
                    returnData = returnData.substring(0, returnData.length - 1);
                }
                return returnData;
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initColumns();
            },
            /**
             * 初始化页面样式
             */
            initStyle() {
                if (!this.devEnterNetData.deptCode || this.devEnterNetData.deptCode == "") {
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.READ_ONLY;
                } else {
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.ONLY_SELECT;
                }
                if (this.devEnterNetData.afStatus == this.ENTER_ENUMS.STATE.DRAFT) {
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.ONLY_SELECT;
                } else {
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.READ_ONLY;
                }
            },
            /**
             * 初始化列
             */
            initColumns() {
                let _this = this;
                this.columns = [{code: 'devId', hidden: true},
                    {
                        label: '设备类型', code: 'category', width: 180, renderCell(h, data) {
                            return _this.onCategoryRenderer(data.row.category);
                        }
                    },
                    {
                        label: '设备子类', code: 'childType', width: 180, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {label: '设备名称', code: 'name', width: 150},
                    {label: '设备状态', code: 'state', hidden: true},
                    {label: '保密编号', code: 'secretSn', width: 250},
                    {
                        label: '设备状态', code: 'state', width: 150, renderCell(h, data) {
                            return _this.onStateRenderer(data.row.state, data.row.category);
                        }
                    },
                    {label: '序列号', code: 'licenseType', width: 150}]
            },
            /**
             * 添加设备
             */
            addDev() {
                this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_SELECT.REF].openDialog();
                });
            },
            /**
             * 选中的设备
             * @param rows
             */
            devTableChange(rows) {
                this.devSelected = rows;
            },
            /**
             * 删除设备
             */
            deleteDev() {
                if (this.devSelected.length == 0) {
                    this.$alert("请选择设备!", "提示");
                    return;
                }
                this.deletes(this.devEnterNetData.detailList, this.devSelected);
                this.deleteReleDev();
            },
            /**
             * 删除关联设备
             */
            deleteReleDev() {
                for (let i = 0; i < this.devSelected.length; i++) {
                    this.getDevById(this.devSelected[i].devId).then(data => {
                        this.deletes(this.devEnterNetData.childList, data.childList);
                    });
                }
            },
            /**
             * 获取设备子类数据
             * @param categoryCode
             */
            getChildTypeDataByCategory(categoryCode) {
                let category = this.ENUMS.CATEGORY_DATA;
                for (let i = 0; i < category.length; i++) {
                    if (categoryCode == category[i].code) {
                        this.childTypeData = category[i].children;
                        break;
                    }
                }
            },
            /**
             * 设置联网区域代码
             * @param netArea
             * @param netType
             * @returns {*}
             */
            setNetAreaCode(data) {
                if (!data.netArea) {
                    data.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
                data.netAreaAndType = data.netArea + this.ENUMS.NET_SEPARATOR() + data.netType;
            },
            /**
             * 设置放置地点
             */
            setCurrentPlace(data) {
                if (data.currentPlace) {
                    let placeStr = data.currentPlace;
                    if (placeStr) {
                        let place = data.currentPlace.split(this.ENUMS.NET_SEPARATOR());
                        data.currentPlace1 = place[0];
                        data.currentPlace2 = place[1];
                        if (place[2]) {
                            data.currentPlace3 = place[2];
                        }
                        if (place[3]) {
                            data.currentPlace4 = place[3];
                        }
                    }
                }
            },
            /**
             * 点击设备名称，查看审批单
             * @param e
             */
            viewProcess(e) {
                alert(e.name);
            }
        },
        mounted() {
            //初始化设备类别枚举--this.requestCategoryData()
            //初始化使用情况枚举--this.requestSystemStateData()
            //初始化联网类型--this.requestNetAreaTypeData()
            //预处理任务链
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USE_FOR.CODE, this.ENUMS.DATA_DICTIONARY.USE_FOR_TWO.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData(),
                this.requestNetAreaTypeData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped lang="less">
    @import "css/process.less";
</style>
