<template>
    <div class="tblClass">
        <ice-dialog :visible.sync="visible" width="1000px" :title="title">
            <el-form :model="mainData" :rules="formRules" label-width="100px" ref="form">
                <ice-grid-layout :columns="3" name="设备责任人">
                    <el-form-item label="责任人" prop="dutyName">
                        <ice-persion-selector
                                choose-item="single"
                                ref="ips"
                                :mode="isEdit?'onlySelect':'readonly'"
                                :deptCode="deptCode"
                                v-model="mainData.dutyName"
                                @select-confirm="selectUserConfirm">
                        </ice-persion-selector>
                    </el-form-item>
                    <el-form-item label="所在部门" prop="dutyDeptName">
                        <el-input v-model="mainData.dutyDeptName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="设备" prop="name">
                        <el-input v-model="mainData.name" placeholder="请先选设备责任人" :disabled="!isEdit">
                            <el-button slot="append" icon="el-icon-edit" @click="chooseDevice"
                                       :disabled="!mainData.dutyName" v-if="isEdit"></el-button>
                        </el-input>
                    </el-form-item>
                </ice-grid-layout>
                <ice-grid-layout :columns="3" name="设备相关信息">
                    <el-form-item label="设备编号" prop="devSn">
                        <el-input v-model="mainData.devSn" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="资产编号" prop="sn">
                        <el-input v-model="mainData.sn" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型" prop="categoryText">
                        <el-input v-model="mainData.categoryText" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="设备子类" prop="childTypeText">
                        <el-input v-model="mainData.childTypeText" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="保密编号" prop="secretSn">
                        <el-input v-model="mainData.secretSn" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="密级" prop="secretLevel">
                        <ice-select v-model="mainData.secretLevel" map-type-code="devSecretLevel"
                                    :disabled="true"></ice-select>
                    </el-form-item>
                    <el-form-item label="放置地点" prop="currentPlace">
                        <el-input v-model="mainData.currentPlace" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="IP地址" prop="masterIp">
                        <el-input v-model="mainData.masterIp" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="联网类型/用途" prop="netAreaAndType">
                        <el-input v-model="mainData.netAreaAndType" :disabled="true"></el-input>
                    </el-form-item>
                </ice-grid-layout>
                <ice-form-group name="设备子类">
                    <el-table :data="tableData"
                              height="200px"
                              :row-class-name="tableRowClassName"
                              @selection-change="handleSelectionChange"
                              v-loading="loading"
                              ref="tbl">
                        <el-table-column type="selection" width="40px" :selectable="isSelectabled"
                                         v-if="isEdit"></el-table-column>
                        <el-table-column type="index" label="序号" width="50px"></el-table-column>
                        <el-table-column prop="hwTypeName" label="设备类型">
                            <template slot-scope="scope">
                                {{onCategoryRenderer(scope.row.category)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="设备名称"></el-table-column>
                        <el-table-column prop="devSn" label="设备编号"></el-table-column>
                        <el-table-column prop="sn" label="资产编号"></el-table-column>
                        <el-table-column prop="secretSn" label="保密编号"></el-table-column>
                    </el-table>
                </ice-form-group>
            </el-form>

            <div class="ice-button-bar">
                <el-button @click="save" type="primary" v-if="isEdit">确定</el-button>
                <el-button @click="closeDialog" type="info">取消</el-button>
            </div>
        </ice-dialog>
        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="false"
                    :columns="columns"
                    :querys="query"
                    :filterTreeData="[11,12,13,14]"
                    width="1120px"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>

</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import DevSelect from "../../../biz/dev/devSelect";

    export default {
        name: "equipmentSelector",
        components: {DevSelect, IceSelect, IcePersionSelector, IceFormGroup, IceGridLayout, IceDialog},
        mixins: [bizComm, devComm, renderer],
        props: {
            title: {//弹窗的标题
                type: String,
                default: '选择需要拆除的硬件'
            },
            isEdit: {
                type: Boolean,
                default: true

            },
            deptCode:{//申请人所在部门
                type:String
            }
        },
        data() {
            return {
                visible: false,//弹窗的开关属性
                devSelectShow: false,
                columns: [],
                dutyName: '',
                query: [
                    {
                        type: 'static', code: 'dutyName', value: () => {
                            return this.dutyName;
                        }, exp: '='
                    }
                ],
                tableData: [],//设备子类
                mainData: {//表单对象
                    dutyName: '',//责任人名称
                    dutyCode: '',//责任人编号
                    dutyDeptName: '',//责任人所在部门名称
                    dutyDeptCode: '',//责任人所在部门编号
                    devName: '',//宿主设备名称
                    sn: '',//宿主设备资产编号
                    devSn: '',//宿主设备编号
                    category: '',//宿主设备类型
                    childType: '',//宿主设备子类型
                    secretSn: '',//宿主设备保密编号
                    secretLevel: '',//宿主设备密级
                    currentPlace: '',//宿主设备放置地点
                    masterIp: '',//宿主设备IP地址
                    netAreaAndType: '',//宿主设备联网类型/用途
                    childTypeText: '',//翻译后的设备子类
                    categoryText: '',//翻译后的设备类型
                    childList: [],
                    devUseType: '',
                    netArea: '',
                    netType: '',
                    useFor: '',
                    devId: ''
                },
                formRules: {//表单字段规则

                },
                list: [],
                childList: [],
                devUseType: '',
                isChangeVal: false,
                loading: false,
            }
        },
        methods: {
            /**
             * 确定
             */
            save() {
                let arr = [];
                this.list.forEach(item => {
                    if (!item.isTrue) {
                        arr.push(item);
                    }
                });
                this.$emit("getData", this.mainData, arr);
                this.closeDialog();
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.tableData = [];
                this.visible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(data, list, devUseType) {
                this.visible = true;
                this.childList = list;
                this.isChangeVal = false;
                this.devUseType = devUseType;
                this.loading = false;
                if (!this.isEdit) {
                    this.loading = true;
                    Object.assign(this.mainData, data);
                    this.getEquipment(data.devId);
                }
            },
            /**
             * 初始化列表
             * @returns {*}
             */
            initTemplate() {
                let _this = this;
                this.columns = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {code: 'devUseType', hidden: true},
                    {
                        label: '设备子类', code: 'childType', width: 90, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {label: '责任人', code: 'dutyName', width: 90},
                    {label: '责任部门', code: 'deptName', width: 80},
                    {label: '资产编号', code: 'sn', width: 100},
                    {label: '保密编号', code: 'secretSn', width: 100},
                    {label: '设备名称', code: 'name', width: 90},
                    {
                        label: '联网类型/用途', code: 'netAreaAndType', width: 120, ignore: true, formatter: row => {
                            return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                        }
                    },
                    {label: '放置地点', code: 'currentPlace', width: 90},
                    {
                        label: '密级',
                        code: 'secretLevel',
                        width: 50,
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE
                    },
                ]
            },
            /**
             * 选择设备--确定后的相关数据处理
             * @param data
             */
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    if (data.length > 0) {
                        let devUseType = data[0].devUseType ? data[0].devUseType : '1';
                        if (this.devUseType == devUseType || this.devUseType == '') {
                            this.getEquipment(data[0].oid);//获取关联设备
                            this.chooseSingleDev(data[0]);
                        } else {
                            this.$message.warning("不可同时选择终端设备和服务端设备");
                        }
                    }
                    resolve();
                    this.devSelectShow = false;
                })

            },
            /**
             * 选择设备之后--相关数据填充
             * @param data
             */
            chooseSingleDev(data) {
                Object.assign(this.mainData, data);
                this.mainData.oid = "";
                this.mainData.devId = data.oid;
                this.mainData.devModel = data.model;
                this.mainData.devName = data.name;
                this.mainData.childTypeText = this.onChildTypeRenderer(data.childType);
                this.mainData.categoryText = this.onCategoryRenderer(data.category);
                this.mainData.secretLevel = data.secretLevel + '';
                this.mainData.devUseType = data.devUseType ? data.devUseType : '1';
                this.mainData.netAreaAndType = this.onNetAndTypeRenderer(data.netArea, data.netType, data.useFor)
            },
            /**
             * 选择责任人--相关数据处理
             * @param row
             */
            selectUserConfirm(row) {
                //当设备责任人更换时，情况数据，保留
                if (this.isChangeVal) {
                    this.resetForm();
                    this.tableData = [];
                    this.mainData.dutyName = row[0].name;
                    this.dutyName = row[0].name;
                    this.mainData.dutyCode = row[0].code;
                    this.mainData.dutyDeptName = row[0].deptShortName;
                    this.mainData.dutyDeptCode = row[0].deptCode;
                } else {
                    this.isChangeVal = true;
                    this.mainData.dutyName = row[0].name;
                    this.dutyName = row[0].name;
                    this.mainData.dutyCode = row[0].code;
                    this.mainData.dutyDeptName = row[0].deptShortName;
                    this.mainData.dutyDeptCode = row[0].deptCode;
                }
            },
            /**
             * 选择设备
             */
            chooseDevice() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**列表勾选触发的数据*/
            handleSelectionChange(list) {
                this.list = list;
            },
            /**
             * 获取关联设备
             * @param oid
             */
            getEquipment(oid) {
                this.loadDevById(oid).then(res => {
                    if (res.dataDTO && res.dataDTO.dependDTOList) {
                        this.tableData = [];
                        res.dataDTO.dependDTOList.forEach(item => {
                            if (item.dependDevDTO && item.dependDevDTO.commDTO) {
                                let obj = {};
                                obj.oid = item.dependDevDTO.commDTO.oid;
                                obj.category = item.dependDevDTO.commDTO.category;
                                obj.name = item.dependDevDTO.commDTO.name;
                                obj.sn = item.dependDevDTO.commDTO.sn;
                                obj.devSn = item.dependDevDTO.commDTO.devSn;
                                obj.childType = item.dependDevDTO.commDTO.childType;
                                obj.secretSn = item.dependDevDTO.commDTO.secretSn;
                                obj.isTrue = false;
                                this.tableData.push(obj);
                            }
                        });
                        for (let i = 0; i < this.childList.length; i++) {
                            let index = this.tableData.findIndex(item => item.oid == this.childList[i].oid);
                            if (index > -1) {
                                if (this.isEdit) {
                                    this.$nextTick(() => {
                                        this.$refs.tbl.toggleRowSelection(this.tableData[index], true);
                                    });
                                    this.tableData[index].isTrue = true;
                                } else {
                                    this.tableData[index].isTrue = true;
                                }
                            }
                        }
                        this.loading = false;
                        this.$nextTick(()=>{
                            this.$refs.tbl.doLayout()
                        })
                    }
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
            isSelectabled(row) {
                return row.isTrue ? false : true;
            },
            tableRowClassName({row, rowIndex}) {
                if (!this.isEdit && row.isTrue) {
                    return 'rowClass'
                }
            },
        },
        mounted() {
            this.requestCategoryData();
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE),
                this.requestCategoryData(),
            ];
            Promise.all(prepareTaskChain).then(this.initTemplate);
        },
    }
</script>

<style lang="less">
    .rowClass {
        background-color: #80c8d8 !important;
    }
</style>