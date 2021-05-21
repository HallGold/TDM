<template>
    <el-dialog v-dialogDrag
               title="设备属性变更"
               width="80%"
               center
               custom-class="dev-edit-dialog"
               :modal-append-to-body="false"
               :visible.sync="dialogVisible"
               :before-close="closeClickHandler"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
        <div class="dev-container" v-loading="isLoading">
            <system-edit :ref="PAGE_ENUM.REFS.EDIT.SYSTEM.REF"
                         :main-data.sync="devData" :is-edit="true"
                         v-if="PAGE_ENUM.REFS.EDIT.SYSTEM.SHOW"></system-edit>
            <pc-edit :ref="PAGE_ENUM.REFS.EDIT.PC.REF"
                     :main-data.sync="devData" :is-edit="true"
                     v-if="PAGE_ENUM.REFS.EDIT.PC.SHOW"></pc-edit>
            <net-edit :ref="PAGE_ENUM.REFS.EDIT.NET.REF"
                      :main-data.sync="devData" :is-edit="true"
                      v-if="PAGE_ENUM.REFS.EDIT.NET.SHOW"></net-edit>
            <media-edit :ref="PAGE_ENUM.REFS.EDIT.MEDIA.REF"
                        :main-data.sync="devData" :is-edit="true"
                        v-if="PAGE_ENUM.REFS.EDIT.MEDIA.SHOW"></media-edit>
            <product-edit :ref="PAGE_ENUM.REFS.EDIT.PRODUCT.REF"
                          :main-data.sync="devData" :is-edit="true"
                          v-if="PAGE_ENUM.REFS.EDIT.PRODUCT.SHOW"></product-edit>
            <storage-dev-edit :ref="PAGE_ENUM.REFS.EDIT.STORAGE_DEV.REF"
                              :main-data.sync="devData" :is-edit="true"
                              v-if="PAGE_ENUM.REFS.EDIT.STORAGE_DEV.SHOW"></storage-dev-edit>
            <storage-media-edit :ref="PAGE_ENUM.REFS.EDIT.STORAGE_MEDIA.REF"
                                :main-data.sync="devData" :is-edit="true"
                                v-if="PAGE_ENUM.REFS.EDIT.STORAGE_MEDIA.SHOW"></storage-media-edit>
            <equipment-edit :ref="PAGE_ENUM.REFS.EDIT.EQUIPMENT.REF"
                            :main-data.sync="devData" :is-edit="true"
                            v-if="PAGE_ENUM.REFS.EDIT.EQUIPMENT.SHOW"></equipment-edit>
        </div>
        <div class="ice-button-bar">
            <el-button type="primary" @click="saveClickHandler" :loading="isLoading">保存</el-button>
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
    import StorageMediaEdit from "./storage_media/edit";
    import MediaEdit from "./media/edit";
    import ProductEdit from "./product/edit";
    import StorageDevEdit from "./storage_dev/edit";
    import EquipmentEdit from "./equipment/edit";

    export default {
        name: "devPropertyChange",
        mixins: [bizComm, devComm],
        components: {
            EquipmentEdit,
            StorageDevEdit,
            ProductEdit,
            StorageMediaEdit,
            NetEdit,
            PcEdit,
            SystemEdit,
            MediaEdit
        },
        props: {
            devId: {
                type: String,
                default: ""
            },
            //主流程申请单号
            headFormCode: {
                type: String,
                default: ""
            },
            //主流程发起来源
            headSource: {
                type: String,
                default: ""
            },
            //设备属性变更申请单Id
            devPropertyApplyId: {
                type: String,
                default: ""
            },
            onCloseHandler: {
                type: Function,
                default: () => {
                    return Promise.resolve();
                }
            }
        },
        data() {
            return {
                dialogVisible: false,
                isLoading: true,
                PAGE_ENUM: {
                    REFS: {
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
                    },
                    ACTIONS: {
                        // 保存设备台账变更对象
                        SAVE_DEV_PROPERTY_CHANGED: {
                            URL: () => {
                                return "biz/BizDevPropertyApply/saveAutoDevPropertyApply";
                            },
                            TYPE: "post"
                        },
                        //根据主业务流程申请单查询设备属性申请列表
                        GET_BY_FORM_CODE: {
                            URL: () => {
                                return "biz/BizDevPropertyApply/listByHeadFormCode";
                            },
                            TYPE: "get"
                        }
                    }
                },
                //设备编辑实时页面数据
                devData: {},
                //初始化完成标志符
                initOver: false,
                //当前的编辑页面ref
                curEdit: null,
                //设备编辑页面老数据
                beforeDevData: {},
                //设备数据变更提交的数据
                formData: {}
            }
        },
        methods: {
            /**
             * 关闭按钮点击响应
             */
            closeClickHandler(e) {
                this.closeDialog(e);
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
            closeDialog(e) {
                this.onCloseHandler(e).then(() => {
                    this.dialogVisible = false;
                });
            },
            /**
             * 初始化devData
             */
            initDevData() {
                return new Promise((resolve, reject) => {
                    this.loadDevById(this.devId).then(res => {
                        this.assembleDevDataByRequest(res);
                        resolve();
                    }).catch(res => {
                        this.$message.error(res);
                        reject();
                    });
                });
            },
            /**
             * 组装编辑页面所需数据
             * @param res
             */
            assembleDevDataByRequest(res) {
                this.devData = res.dataDTO;
                this.devData.reFileVoList = res.reFileVoList;
                if (!this.devData.extendData) {
                    this.devData.extendData = {};
                }
                this.beforeDevData = JSON.parse(JSON.stringify(this.devData));
            },
            /**
             * 根据设备大类初始化调用的edit页面
             */
            initEditType() {
                for (let i in this.PAGE_ENUM.REFS.EDIT) {
                    let _edit = this.PAGE_ENUM.REFS.EDIT[i];
                    if (_edit.TYPE_CODE() == this.devData.commDTO.category) {
                        this.curEdit = _edit;
                        this.curEdit.SHOW = true;
                        break;
                    }
                }
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
            /**
             * 保存按钮点击响应
             */
            saveClickHandler() {
                let _this = this;
                this.$refs[this.curEdit.REF].validateData().then((resolve, reject) => {
                    _this.axios(_this.PAGE_ENUM.ACTIONS.SAVE_DEV_PROPERTY_CHANGED, this.assembleFormData(), [res => {
                        this.$message.success("保存成功!");
                        _this.devPropertyApplyId = res.data;
                        _this.closeClickHandler(res.data);
                    }, res => {
                        reject("保存数据失败!");
                    }, res => {
                        reject("保存数据异常!");
                    }]);
                }).catch((res) => {
                    if (!res) {
                        //数据校验失败
                        res = "数据校验失败!请核对页面数据!";
                    }
                    //校验失败
                    _this.$message.error(res);
                });
            },
            assembleChangeData() {
                let _devData = {
                    devPvDTOList: [],//设备规格
                    macIpDTOList: [],
                    commDTO: {},
                    extendData: {},
                    dependDTOList: [],
                    factoryReleDTOList: [],//相关厂商
                    factoryUserDTOList: [],//厂商联系人
                    useRangeDTOList: [],//使用范围
                    dutyDTOList: [],//系统三员
                    reFileVoList: [],//附件相关
                    macIpDTOList: [],//mac地址
                    devPvDTOList: []
                };
                for (let i in this.devData) {
                    if (this.devData[i] instanceof Object && !(this.devData[i] instanceof Array)) {
                        console.log(i);
                        for (let j in this.devData[i]) {
                            if (this.devData[i][j] != this.beforeDevData[i][j]) {
                                _devData[i][j] = this.devData[i][j];
                            }
                        }
                    } else if (this.devData[i] instanceof Array) {
                        this.beforeDevData[i] = this.beforeDevData[i] || [];
                        if (this.beforeDevData[i].length > 0) {
                            for (let m = 0; m < this.devData[i].length; m++) {
                                let _list = this.devData[i][m];
                                for (let l = 0; l < this.beforeDevData[i].length; l++) {
                                    let __list = this.beforeDevData[i][l];
                                    for (let o in __list) {
                                        if (__list[o] != _list[o]) {//对比数组的每一项
                                            _devData[i].push(_list);
                                            break;
                                        }
                                    }
                                }
                            }
                        } else if (this.beforeDevData[i].length == 0 && this.devData[i].length > 0) {
                            _devData[i] = this.devData[i];
                        }
                    }
                }
                return _devData;
            },
            /**
             * 组装向属性变更提交的数据
             * @return {formData|{}}
             */
            assembleFormData() {
                let DTO = "";
                let changeData = this.assembleChangeData();
                for (let i in this.ENUMS.CATEGORY_TYPE) {
                    if (this.ENUMS.CATEGORY_TYPE[i].CODE == this.beforeDevData.commDTO.category) {
                        DTO = this.ENUMS.CATEGORY_TYPE[i].DTO;
                        break;
                    }
                }
                this.formData.devPropertyApplyId = this.devPropertyApplyId;
                this.formData.headSource = this.headSource;
                this.formData.headFormCode = this.headFormCode;
                this.formData.category = this.beforeDevData.commDTO.category;
                this.formData[DTO] = changeData;
                this.formData[DTO].devId = this.beforeDevData.commDTO.oid;
                this.formData.reFileVoList = changeData.reFileVoList;
                console.log(JSON.stringify(this.formData));
                return this.formData;
            },
            getByFormCode() {
                if (this.devPropertyApplyId != "") {
                    let _this = this;
                    return new Promise((resolve,reject)=>{
                        this.axios(this.PAGE_ENUM.ACTIONS.GET_BY_FORM_CODE, {headFormCode: this.headFormCode}, [res => {
                            resolve();
                        },res=>{
                            reject("查询数据失败");
                        }]);
                    });
                }
            }
        },
        mounted() {
            let _this = this;
            Promise.all([_this.initDevData(), _this.getByFormCode()]).then(() => {
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