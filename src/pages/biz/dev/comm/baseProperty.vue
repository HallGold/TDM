<template>
    <div class="form-content">
        <el-form :model="mainData"
                 :rules="rulesForm"
                 ref="form"
                 :disabled="!isEdit"
                 label-width="110px">
            <ice-grid-layout :columns="3" name="基础属性">
                <el-form-item label="设备类型">
                    <el-select v-model="mainData.commDTO.category" :disabled="true">
                        <el-option
                                v-for="item in ENUMS.CATEGORY_DATA"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备子类" prop="childType">
                    <el-select v-model="mainData.commDTO.childType" @change="onChildTypeChanged">
                        <el-option
                                v-for="(item,key) in childTypeData"
                                :key="key"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备名称" prop="commDTO.name">
                    <el-input v-model="mainData.commDTO.name"></el-input>
                </el-form-item>
                <el-form-item label="保密编号" prop="commDTO.secretSn">
                    <el-input v-model="mainData.commDTO.secretSn"></el-input>
                </el-form-item>
                <el-form-item label="资产编号" prop="commDTO.sn">
                    <el-input v-model="mainData.commDTO.sn"></el-input>
                </el-form-item>
                <!--  <el-form-item label-width="0">
                      <div style="display: flex;justify-content:center">
                          <span class="required-star" style="padding-right: 4px">*</span>联网类型
                          <span style="margin-left: 10px;width: 240px">
                         <el-select v-model="formData.netAreaAndType" @change="onNetAreaChanged"
                                    style="width: 265px">
                          <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                     :key="item.code"
                                     :label="item.name"
                                     :value="item.code"></el-option>
                      </el-select>
                      <el-input v-model="mainData.commDTO.netArea" v-if="false"></el-input>
                      <el-input v-model="mainData.commDTO.netType" v-if="false"></el-input>
                      </span>
                      </div>
                  </el-form-item>-->
                <el-form-item label="联网类型" prop="">
                    <el-select v-model="formData.netAreaAndType" @change="onNetAreaChanged">
                        <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                    <el-input v-model="mainData.commDTO.netArea" v-if="false"></el-input>
                    <el-input v-model="mainData.commDTO.netType" v-if="false"></el-input>
                </el-form-item>
                <el-form-item label="密级" prop="commDTO.secretLevel">
                    <el-select v-model="mainData.commDTO.secretLevel" @change="onSecretLevelChanged">
                        <el-option v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="涉密属性" prop="commDTO.secret">
                    <el-select v-model="mainData.commDTO.secret" :disabled="true">
                        <el-option v-for="item in ENUMS.YES_NO.properties"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用情况" prop="commDTO.state">
                    <el-select v-model="mainData.commDTO.state">
                        <el-option v-for="item in stateData"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :layout="2" label-width="0">
                    <div style="display: flex;justify-content:center">
                        <div style="width:130px;text-align: right">
                            <span class="required-star" style="padding-right: 4px">*</span>放置地点
                        </div>
                        <div style="display: flex;margin-left: 8px">
                            <div style="width: 100%">
                                <el-input v-model="formData.currentPlace1" placeholder="园区"
                                          @blur="currentPlace1Blur"></el-input>
                                <div class="tableTips row" v-if="VALIDATE_TYPE.currentPlace1V">请输入园区号
                                </div>
                            </div>&nbsp;<span>-</span>&nbsp;
                            <div style="width:100%">
                                <el-input v-model="formData.currentPlace2" placeholder="楼号"
                                          @blur="currentPlace2Blur"></el-input>
                                <div class="tableTips row" v-if="VALIDATE_TYPE.currentPlace2V">请输入楼号
                                </div>
                            </div>&nbsp;<span>-</span>&nbsp;
                            <el-input v-model="formData.currentPlace3" placeholder="房间号"
                                      @blur="currentPlace3Blur"></el-input>&nbsp;<span>-</span>&nbsp;
                            <el-input v-model="formData.currentPlace4" placeholder="工位号" :disabled="stationDisabled"
                                      ref="station" @blur="currentPlace4Blur"></el-input>
                        </div>
                    </div>
                </el-form-item>
                <el-input v-model="mainData.commDTO.currentPlace" v-if="false"></el-input>

                <el-form-item label="启用日期" v-if="mainData.commDTO.state != ENUMS.STATE_DATA.NO_USE.CODE" prop="useDate">
                    <el-date-picker v-model="mainData.commDTO.useDate"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="mainData.commDTO.state == ENUMS.STATE_DATA.NO_USE.CODE">
                </el-form-item>
                <el-form-item label="用途" prop="commDTO.useFor">
                    <!--                    <el-input v-model="mainData.commDTO.useFor" v-if="mainData.commDTO.netArea"></el-input>-->
                    <el-select v-model="mainData.commDTO.useFor"
                               v-if="!mainData.commDTO.netArea || mainData.commDTO.netArea == ' '">
                        <el-option v-for="item in ENUMS.USE_FOR_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                    <el-select v-model="mainData.commDTO.useFor"
                               v-if="mainData.commDTO.netArea && mainData.commDTO.netArea != ' '">
                        <el-option v-for="item in ENUMS.USE_FOR_TWO_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否安可设备" prop="commDTO.controllable">
                    <el-select v-model="mainData.commDTO.controllable">
                        <el-option v-for="item in ENUMS.YES_NO.properties"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code.toString()"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统级别" prop="extendData.systemLevel">
                    <el-select v-model="mainData.extendData.systemLevel">
                        <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="" layout="3">
                    <el-input type="textarea" rows="3" v-model="mainData.commDTO.remark"></el-input>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceSelect from "@/components/common/base/IceSelect";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import {resetRule} from "@/pages/biz/dev/js/comm/devT.js";

    export default {
        name: "baseProperty",
        components: {IceSelect, IceGridLayout},
        mixins: [bizComm, devComm],
        watch: {
            formData: {
                handler(newData, oldData) {
                    this.setCurrentPlace(newData);
                }, deep: true
            }
        },
        props: {
            mainData: {},
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            let _this = this;
            /**
             * 保密编号、资产编号的校验
             */
            let validateSecretSn = function (rule, value, callback) {
                _this.validateSn({
                    devId: _this.mainData.commDTO.oid,
                    secretSn: _this.mainData.commDTO.secretSn,
                    sn: _this.mainData.commDTO.sn
                }).then(res => {
                    if (!res.secretSn && rule.field == 'commDTO.secretSn') {
                        callback(new Error(rule.message));
                    } else if (!res.sn && rule.field == 'commDTO.sn') {
                        callback(new Error(rule.message));
                    } else {
                        callback();
                    }
                });
            };
            return {
                VALIDATE_TYPE: {//表格校验规则
                    currentPlace1V: false,
                    currentPlace2V: false
                },
                //工位号是否可编辑
                stationDisabled: true,
                formData: {//表单对象
                    currentPlace1: "",
                    currentPlace2: "",
                    currentPlace3: "",
                    currentPlace4: "",
                    netAreaAndType: ""
                },
                rulesForm: {//表单字段规则
                    "commDTO.childType": {required: true, message: '请选择设备子类', trigger: 'blur'},
                    "commDTO.secretSn": {message: '保密编号重复', trigger: 'blur', validator: validateSecretSn},
                    "commDTO.sn": {message: '资产编号重复', trigger: 'blur', validator: validateSecretSn},
                    "commDTO.name": {required: true, whitespace: true, message: '请输入设备名称', trigger: 'blur'},
                    "commDTO.secretLevel": {required: true, message: '请选择密级', trigger: 'blur'},
                    "commDTO.secret": {required: true, message: '请选择是否涉密', trigger: 'blur'},
                    "commDTO.controllable": {required: true, message: '请选择是否安可设备', trigger: 'blur'},
                    "commDTO.useDate": {required: true, message: '请输入启用日期', trigger: 'blur'},
                    "commDTO.useFor": {required: true, message: '请选择用途', trigger: 'blur'},
                    "commDTO.state": {required: true, message: '请选择使用情况', trigger: 'blur'},
                    "extendData.systemLevel": {required: true, message: '请选择系统级别', trigger: 'blur'}
                },
                //设备子类数据
                childTypeData: [],
                //设备状态数据
                stateData: []
            }
        },
        methods: {
            /**
             * 获取页面数据
             * @returns {default.props.mainData|{}}
             */
            getData() {
                return this.mainData;
            },
            /**
             * 校验页面数据
             * @returns {*}
             */
            validateData() {
                return Promise.all([this.$refs.form.validate(), this.validateCurrentPlace()]);
            },
            /**
             * 校验放置地点
             */
            validateCurrentPlace() {
                let _this = this;
                let validate = true;
                return new Promise((resolve, reject) => {
                    if (!_this.formData.currentPlace1 || _this.formData.currentPlace1 == "") {
                        _this.VALIDATE_TYPE.currentPlace1V = true;
                        validate = false;
                    } else {
                        _this.VALIDATE_TYPE.currentPlace1V = false;
                    }
                    if (!_this.formData.currentPlace2 || _this.formData.currentPlace2.length == 0) {
                        _this.VALIDATE_TYPE.currentPlace2V = true;
                        validate = false;
                    } else {
                        _this.VALIDATE_TYPE.currentPlace2V = false;
                    }
                    if (validate) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initData();
                this.initStates();
                this.initStyle();
                //设置页面规则
                resetRule(this.rulesForm, this.mainData.commDTO.category, this.mainData.commDTO.childType);
                this.initPageOver();
            },
            /**
             * 初始化状态数据
             */
            initStates() {
                if (this.mainData.commDTO.category == this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE) {
                    this.stateData = this.ENUMS.SYSTEM_STATE_DATA;
                } else {
                    this.stateData = this.ENUMS.COMM_STATE_DATA;
                }
            },
            /**
             * 初始化页面数据
             */
            initData() {
                this.initCurrentPlace();
                this.getChildTypeDataByCategory(this.mainData.commDTO.category);
                this.initNetAreaAndNetType();
                this.mainData.commDTO.controllable = this.mainData.commDTO.controllable.toString();
            },
            /**
             * 初始化联网区域
             */
            initNetAreaAndNetType() {
                if (this.mainData.commDTO.netArea) {
                    this.formData.netAreaAndType = this.mainData.commDTO.netArea + this.ENUMS.NET_SEPARATOR() + this.mainData.commDTO.netType;
                } else {
                    this.formData.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
            },
            /**
             * 初始化页面样式
             */
            initStyle() {
                if (this.formData.currentPlace3) {
                    this.stationDisabled = false;
                } else {
                    this.stationDisabled = true;
                }
            },
            /**
             * 初始化放置地点
             */
            initCurrentPlace() {
                let placeStr = this.mainData.commDTO.currentPlace;
                if (placeStr) {
                    let place = this.mainData.commDTO.currentPlace.split(this.ENUMS.NET_SEPARATOR());
                    this.formData.currentPlace1 = place[0];
                    this.formData.currentPlace2 = place[1];
                    if (place[2]) {
                        this.formData.currentPlace3 = place[2];
                    }
                    if (place[3]) {
                        this.formData.currentPlace4 = place[3];
                    }
                }
            },
            /**
             * 设置放置地点
             */
            setCurrentPlace(data) {
                let separator = this.ENUMS.NET_SEPARATOR();
                this.mainData.commDTO.currentPlace = data.currentPlace1 + separator + data.currentPlace2 + separator + data.currentPlace3 + separator + data.currentPlace4;
            },
            validatePlace(e) {
                if (e.indexOf("-") != -1) {
                    this.$message.warning("放置地点不允许输入【-】符号,请输入正确的放置地点");
                    return "";
                }
                return e;
            },
            /**
             * 当房间号失去焦点时，设置工位号是否可编辑
             * 校验是否输入正确字符串
             * @param e
             */
            currentPlace3Blur(e) {
                if (this.formData.currentPlace3.length != 0) {
                    this.stationDisabled = false;
                    this.formData.currentPlace3 = this.validatePlace(this.formData.currentPlace3);
                } else {
                    this.stationDisabled = true;
                    this.formData.currentPlace4 = "";
                }
            },
            /**
             * 当园区焦点时，校验是否输入正确字符串
             * @param e
             */
            currentPlace1Blur(e) {
                this.formData.currentPlace1 = this.validatePlace(this.formData.currentPlace1);
                this.validateCurrentPlace();
            },
            /**
             * 当楼号焦点时，校验是否输入正确字符串
             * @param e
             */
            currentPlace2Blur(e) {
                this.formData.currentPlace2 = this.validatePlace(this.formData.currentPlace2);
                this.validateCurrentPlace();
            },
            /**
             * 当工位号焦点时，校验是否输入正确字符串
             * @param e
             */
            currentPlace4Blur(e) {
                this.formData.currentPlace4 = this.validatePlace(this.formData.currentPlace4);
            },
            /**
             * 获取设备子类数据
             * @param categoryCode
             */
            getChildTypeDataByCategory(categoryCode) {
                let category = this.ENUMS.CATEGORY_DATA;
                if (category) {
                    for (let i = 0; i < category.length; i++) {
                        if (categoryCode == category[i].code) {
                            this.childTypeData = category[i].children;
                            break;
                        }
                    }
                }
            },
            /**
             * 联网区域改变时
             * @param e
             */
            onNetAreaChanged(e) {
                let _code = e.split(this.ENUMS.NET_SEPARATOR());
                if (this.mainData.commDTO.netArea == " " && _code[0] != " ") {//联网类型从无变成有时
                    this.mainData.commDTO.useFor = this.ENUMS.USE_FOR_TWO_DATA[0].code;
                    this.$refs.form.clearValidate();
                } else if (this.mainData.commDTO.netArea != " " && _code[0] == " ") {//联网类型从有变成无时
                    this.mainData.commDTO.useFor = this.ENUMS.USE_FOR_DATA[0].code;
                }
                this.mainData.commDTO.netArea = _code[0];
                this.mainData.commDTO.netType = _code[1];
            },
            /**
             * 设备子类改变时(设置规格属性table的数据)
             * @param e
             */
            onChildTypeChanged(e) {
                if (!this.mainData.devPvMap[e]) {
                    let _this = this;
                    this.axios(this.ENUMS.ACTIONS.GET_STANDARD_LIST, {
                        category: e,
                        devId: this.mainData.commDTO.oid
                    }, [res => {
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].name = res.data[i].propertyName;
                            res.data[i].propertyId = res.data[i].oid;
                            res.data[i].oid = null;
                            res.data[i].devId = _this.mainData.commDTO.oid;
                            if (res.data[i].value) {
                                res.data[i].value = res.data[i].value;
                            }
                        }
                        _this.mainData.devPvDTOList = res.data;
                        _this.mainData.devPvMap[e] = res.data;
                    }]);
                } else {
                    this.mainData.devPvDTOList = this.mainData.devPvMap[e];
                }
            },
            /**
             * 数据密级改变时
             * @param e
             */
            onSecretLevelChanged(e) {
                if (e > Number(this.ENUMS.DATA_SECRET_LEVEL_DATA[1].code)) {
                    //密级高于公开
                    this.mainData.commDTO.secret = this.ENUMS.YES_NO.YES;
                } else {
                    //密级高于公开
                    this.mainData.commDTO.secret = this.ENUMS.YES_NO.NO;
                }
            }
        },
        mounted() {
            //初始化设备类别枚举--this.requestCategoryData()
            //初始化使用情况枚举--this.requestSystemStateData()
            //初始化联网类型--this.requestNetAreaTypeData()
            //预处理任务链
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USE_FOR.CODE, this.ENUMS.DATA_DICTIONARY.USE_FOR_TWO.CODE, this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData(),
                this.requestCommStateData(),
                this.requestNetAreaTypeData(),
                this.requestSystemStateData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/edit.less";

    .form-content {
        width: 100%;
    }
</style>