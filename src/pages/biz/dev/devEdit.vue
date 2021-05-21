<template>
    <el-dialog v-dialogDrag
               :title="title"
               width="80%"
               center
               custom-class="dev-edit-dialog"
               :modal-append-to-body="false"
               :visible.sync="dialogVisible"
               :before-close="closeClickHandler"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="基本信息" name="basic">
                <div class="dev-container" v-loading="isLoading">
                    <system-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.SYSTEM.REF"
                                 :main-data.sync="devData"
                                 v-if="PAGE_ENUM.REFS.EDIT.SYSTEM.SHOW"></system-edit>
                    <pc-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.PC.REF"
                             :main-data.sync="devData"
                             v-if="PAGE_ENUM.REFS.EDIT.PC.SHOW"></pc-edit>
                    <net-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.NET.REF"
                              :main-data.sync="devData"
                              v-if="PAGE_ENUM.REFS.EDIT.NET.SHOW"></net-edit>
                    <media-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.MEDIA.REF"
                                :main-data.sync="devData"
                                v-if="PAGE_ENUM.REFS.EDIT.MEDIA.SHOW"></media-edit>
                    <product-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.PRODUCT.REF"
                                  :main-data.sync="devData"
                                  v-if="PAGE_ENUM.REFS.EDIT.PRODUCT.SHOW"></product-edit>
                    <storage-dev-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.STORAGE_DEV.REF"
                                      :main-data.sync="devData"
                                      v-if="PAGE_ENUM.REFS.EDIT.STORAGE_DEV.SHOW"></storage-dev-edit>
                    <storage-media-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.STORAGE_MEDIA.REF"
                                        :main-data.sync="devData"
                                        v-if="PAGE_ENUM.REFS.EDIT.STORAGE_MEDIA.SHOW"></storage-media-edit>
                    <equipment-edit :is-edit="isEdit" :ref="PAGE_ENUM.REFS.EDIT.EQUIPMENT.REF"
                                    :main-data.sync="devData"
                                    v-if="PAGE_ENUM.REFS.EDIT.EQUIPMENT.SHOW"></equipment-edit>
                </div>
                <el-form :ref="PAGE_ENUM.REFS.FORM" :model="formData"></el-form>
            </el-tab-pane>
            <el-tab-pane label="相关审批" name="approve" v-if="!isEdit && devId != null">
                <div class="dev-container">
                    <dev-process v-if="activeName == 'approve' || tabApproveOpened == true "
                                 :devId="devId"></dev-process>
                </div>
            </el-tab-pane>
            <el-tab-pane label="变更历史" name="history" v-if="devId != null && devId != ''">
                <div v-if="activeName == 'history' || tabHistoryOpened == true" class="dev-container">
                    <dev-history v-if="activeName == 'history' || tabHistoryOpened == true "
                                 :devId="devId"></dev-history>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="ice-button-bar">
            <el-button type="primary" @click="saveClickHandler" v-if="isEdit" :loading="isLoading">保存</el-button>
            <el-button type="primary" @click="saveAndCopyClickHandler" v-if="isEdit && showCopyButton"
                       :loading="isLoading">保存并复制
            </el-button>
            <el-button type="info" @click="closeClickHandler">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import SystemEdit from "./system/edit";
    import PcEdit from "./pc/edit";
    import NetEdit from "./net/edit";
    import MediaEdit from "./media/edit";
    import ProductEdit from "./product/edit";
    import StorageDevEdit from "./storage_dev/edit";
    import StorageMediaEdit from "./storage_media/edit";
    import EquipmentEdit from "./equipment/edit";
    import DevProcess from "./devProcess";
    import DevHistory from "./devHistory";

    export default {
        name: "devEdit",
        mixins: [bizComm, devComm],
        components: {
            SystemEdit,
            PcEdit,
            NetEdit,
            MediaEdit,
            ProductEdit,
            StorageDevEdit,
            StorageMediaEdit,
            EquipmentEdit,
            DevProcess,
            DevHistory
        },
        props: {
            //是否可编辑
            isEdit: {
                type: Boolean,
                default: false
            },
            //设备大类
            categoryType: {
                type: Number,
                required: true
            },
            //设备Id
            devId: {
                type: String,
                default: ""
            },
            //页面关闭的回调
            onCloseHandler: {
                type: Function,
                default: () => {
                    return Promise.resolve();
                }
            },
            title: {
                type: String,
                default: "设备查看"
            },
            childType: {
                type: Number,
                default: 0
            },
            showCopyButton: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            // devData: {
            //     handler(newValue, oldValue) {
            //         if (this.initOver) {
            //             for (let i in oldValue) {
            //                 let op = oldValue[i];
            //                 if (newValue[i] != op) {
            //                     // console.log(i + "变了");
            //                 }
            //             }
            //         }
            //     }, deep: true
            // }
        },
        data: function () {
            return {
                PAGE_ENUM: {
                    REFS: {
                        FORM: "form",
                        EDIT: {
                            SYSTEM: {//应用系统
                                REF: "systemEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE;
                                }
                            },
                            PC: {//服务器与计算机
                                REF: "pcEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.PC.CODE;
                                }
                            },
                            NET: {//网络设备
                                REF: "netEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.NET.CODE;
                                }
                            },
                            STORAGE_DEV: {//存储与备份设备
                                REF: "storageDevEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.STORAGE_DEV.CODE;
                                }
                            },
                            PRODUCT: {//安全保密产品
                                REF: "productEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.PRODUCT.CODE;
                                }
                            },
                            STORAGE_MEDIA: {//存储介质
                                REF: "storageMediaEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.STORAGE_MEDIA.CODE;
                                }
                            },
                            EQUIPMENT: {//外部设施与办公自动化设备
                                REF: "equipmentEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.EQUIPMENT.CODE;
                                }
                            },
                            MEDIA: {//声像设备
                                REF: "mediaEdit", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.MEDIA.CODE;
                                }
                            }
                        },
                    }
                },
                //子页面是否在初始化标志
                isLoading: true,
                //流程tab打开过的标志
                tabApproveOpened: false,
                //变更tab打开过得标志
                tabHistoryOpened: false,
                //提交的表单数据
                formData: {},
                //当前选中的tab页名称
                activeName: "basic",
                //是否保存成功
                isSaved: false,
                //设备数据
                devData: {
                    devPvDTOList: [
                        /* {
                             devId: "",
                             necessary: null,
                             name: "",
                             detail: null,
                             oid: "",
                             category: 0,
                             propertyId: "",
                             value: ""
                         }*/
                    ],//设备规格
                    macIpDTOList: [
                        /*  {
                              devId: "",
                              using: true,
                              ip: null,
                              oid: "",
                              mac: ""
                          }*/
                    ],
                    commDTO: {
                        devNorm: "",//规格属性
                        devId: "",
                        deptName: "",//责任人
                        netArea: "",//联网区域
                        netAreaAndType: "",
                        netType: "",//联网类型
                        deptOrgCode: "",//责任人单位编码
                        masterIp: "",//ip地址
                        creatorDeptCode: "",//创建人单位code
                        buyDate: "",//购置日期
                        childState: null,
                        dutyCode: "",//责任人编码
                        secretSn: "",//保密编号
                        remark: "",//备注
                        oid: "",
                        secret: 0,//涉密属性
                        dutyOrgCode: "",//责任人单位code
                        userCode: "",//使用人code
                        specialOut: null,
                        processName: null,
                        orgCode: null,
                        price: 0,
                        qualityDate: "",
                        model: "",
                        sn: "",
                        state: 2,
                        userDeptCode: "",
                        processClock: false,
                        devSn: "",
                        creatorDeptName: "",
                        childType: 0,
                        creator: "",
                        creatorCode: "",
                        fundsSource: 1,
                        useFor: null,
                        userName: "",
                        birthDate: "",
                        secretLevel: 1,
                        dutyName: "",
                        dutyOrgName: "",
                        userDeptName: "",
                        dutyPhone: null,
                        useDate: "",
                        createTime: "",
                        birthSn: "",
                        currentPlace: "",
                        name: "",
                        systemLevel: null,
                        category: 0,
                        deptCode: "",
                        controllable: 0,
                        safeAble: null,
                        devUseType: null
                    },
                    extendData: {
                        desp: null,
                        pcRelationId: "",
                        setupDate: "",
                        shape: 1,
                        origin: '',
                        model: null,
                        oid: "",
                        terminal: false,
                        osVersion: null,
                        checkCertsignName: "",//检查证书
                        checkCertsignCode: "",
                        checkCertsignDate: "",
                        validConclusion: true,//在线验证
                        onlineValidDate: "",//验证时间
                        licenseType: 3,//许可类型
                        validDate: "",//许可验证有效时间
                        license: "",//序列号
                        id: "",//扩展表id
                        devId: "",//devID
                        passOfflineValid: false,//通过安全测评
                        checkDeptName: "",//检测单位
                        trayNo: "",//储存介质-盘柜编号
                        capacity: "",//储存介质-容量
                        softWareNo: "",//储存介质-软件识别编号
                        deployMode: "",//应用系统-部署模式
                    },
                    dependDTOList: [
                        /*  {
                              devId: "",
                              dependType: 0,
                              dependDevId: "",
                              dependDevType: 0,
                              dependDevDTO: {
                                  commDTO: {
                                      deptName: "",
                                      netArea: "",
                                      deptOrgCode: "",
                                      masterIp: null,
                                      creatorDeptCode: null,
                                      buyDate: null,
                                      childState: null,
                                      dutyCode: "",
                                      secretSn: "",
                                      remark: "",
                                      oid: "",
                                      secret: true,
                                      dutyOrgCode: "",
                                      userCode: null,
                                      specialOut: null,
                                      processName: null,
                                      orgCode: "",
                                      price: 0,
                                      qualityDate: null,
                                      model: null,
                                      sn: "",
                                      state: 0,
                                      userDeptCode: null,
                                      processClock: false,
                                      devSn: null,
                                      creatorDeptName: null,
                                      childType: 0,
                                      creator: null,
                                      creatorCode: null,
                                      fundsSource: null,
                                      netType: "",
                                      useFor: null,
                                      userName: null,
                                      birthDate: null,
                                      secretLevel: 4,
                                      dutyName: "",
                                      userDeptName: null,
                                      dutyPhone: null,
                                      useDate: "",
                                      createTime: null,
                                      birthSn: null,
                                      currentPlace: "",
                                      name: "",
                                      systemLevel: null,
                                      category: 0,
                                      deptCode: ""
                                  },
                                  extendData: null
                              },
                              oid: ""
                          }*/
                    ],
                    factoryReleDTOList: [
                        /* {
                             devId: "",
                             factoryId: "",
                             releType: 0,
                             factoryName: "",
                             oid: ""
                         }*/
                    ],//相关厂商
                    factoryUserDTOList: [],//厂商联系人
                    useRangeDTOList: [],//使用范围
                    dutyDTOList: [],//系统三员
                    reFileVoList: [],//附件相关
                    macIpDTOList: [],//mac地址
                    devPvDTOList: []
                },
                //页面显示状态
                dialogVisible: false,
                //当前的编辑页面ref
                curEdit: null,
                //初始化完成标志符
                initOver: false,
            };
        },
        methods: {
            /**
             * tab变换事件处理
             */
            handleTabClick(tab, event) {
                if (tab.name == "history") {
                    this.tabHistoryOpened = true;
                } else if (tab.name == "approve") {
                    this.tabApproveOpened = true;
                }

            },
            /**
             * 打开窗口
             */
            openDialog() {
                this.dialogVisible = true;
            },
            /**
             * 关闭窗口
             */
            closeDialog() {
                this.onCloseHandler(this.isSaved).then(() => {
                    this.dialogVisible = false;
                });
            },
            /**
             * 根据设备大类初始化调用的edit页面
             */
            initEditType() {
                let _this = this;
                if (!!this.categoryType) {
                    for (let i in this.PAGE_ENUM.REFS.EDIT) {
                        let _edit = this.PAGE_ENUM.REFS.EDIT[i];
                        if (_edit.TYPE_CODE() == this.categoryType) {
                            this.curEdit = _edit;
                            this.curEdit.SHOW = true;
                            break;
                        }
                    }
                }
            },
            /**
             * 保存按钮点击响应
             */
            saveClickHandler() {
                let _this = this;
                this.$refs[this.curEdit.REF].validateData().then(() => {
                    this.doSaveDev().then(this.closeDialog);
                }).catch((res) => {
                    if (!res) {
                        //数据校验失败
                        res = "数据校验失败!请核对页面数据!";
                    }
                    //校验失败
                    _this.$message.error(res);
                });
            },
            /**
             * 因为张嘉鑫个瓜皮把reFileVoList放到与dataDTO平级，需要特殊处理
             */
            assembleDevDataByRequest(res) {
                this.devData = res.dataDTO;
                this.devData.reFileVoList = res.reFileVoList;
                if (!this.devData.extendData) {
                    this.devData.extendData = {};
                }
            },
            /**
             * 因为张嘉鑫个瓜皮把reFileVoList放到与dataDTO平级，需要特殊处理
             */
            assembleDevDataParam() {
                let DTO = "";
                for (let i in this.ENUMS.CATEGORY_TYPE) {
                    if (this.ENUMS.CATEGORY_TYPE[i].CODE == this.devData.commDTO.category) {
                        DTO = this.ENUMS.CATEGORY_TYPE[i].DTO;
                        break;
                    }
                }
                this.formData.category = this.devData.commDTO.category;
                this.formData[DTO] = this.devData;
                this.formData[DTO].devId = this.devData.commDTO.oid;
                this.formData.reFileVoList = this.devData.reFileVoList;
                console.log(JSON.stringify(this.formData));
                return this.formData;
            },
            /**
             * 保存设备数据
             */
            doSaveDev() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.axios(_this.ENUMS.ACTIONS.SAVE_DEV, _this.assembleDevDataParam(), [res => {
                        _this.assembleDevDataByRequest(res.data);
                        _this.setIsSaved(true);
                        this.$message.success("保存成功!");
                        resolve(res);
                    }, res => {
                        reject("保存设备数据失败!");
                    }, res => {
                        reject("保存设备数据异常!");
                    }])
                });
            },
            /**
             * 保存并复制按钮点击响应
             */
            saveAndCopyClickHandler() {
                let _this = this;
                this.$refs[this.curEdit.REF].validateData().then(this.doSaveDev).then(res => {
                    //将当前数据oid置空
                    _this.devData.commDTO.oid = "";
                    _this.devData.extendData.devId = "";
                    _this.devData.reFileVoList = [];
                }).catch((res) => {
                    if (!res) {
                        //数据校验失败
                        res = "数据校验失败!请核对页面数据!";
                    }
                    //校验失败
                    _this.$message.error(res);
                });
            },
            /**
             * 设置保存标志符
             */
            setIsSaved(flag) {
                this.isSaved = flag;
            },
            /**
             * 初始化devData
             */
            initDevData() {
                return new Promise((resolve, reject) => {
                    if (this.devId == "") {
                        //新增设备
                        //子类code
                        this.devData.commDTO.childType = this.childType;
                        //父类
                        this.devData.commDTO.category = this.getParentType(this.categoryType);
                        resolve();
                    } else {
                        //编辑设备,从服务器加载数据
                        this.loadDevById(this.devId).then(res => {
                            this.assembleDevDataByRequest(res);
                            resolve();
                        }).catch(res => {
                            this.$message.error(res);
                            reject();
                        });
                    }
                });
            },
            /**
             * 关闭按钮点击响应
             */
            closeClickHandler() {
                this.closeDialog(this.isSaved);
            },
            /**
             * 检查是否全部组件加载完成
             */
            allPropertyInitOver() {
                let _this = this;
                setTimeout(() => {
                    _this.isLoading = !_this.$refs[_this.curEdit.REF].isInitEditPageOver();
                    if (_this.isLoading) {
                        console.log("检查是否全部组件加载完成");
                        _this.allPropertyInitOver();
                    }
                }, 1000);
            },
        },
        mounted() {
            let _this = this;
            _this.initDevData().then(() => {
                _this.initEditType();
                _this.initOver = true;
                _this.allPropertyInitOver();
            });
        }
    }
</script>

<style lang="less" scoped>
    @import "style/edit.less";
</style>