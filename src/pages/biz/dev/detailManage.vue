<template>
    <div class="ice-full-absolute">
        <pc-manage :dev-id="devId" :ref="PAGE_ENUM.REFS.EDIT.PC.REF"
                   v-if="PAGE_ENUM.REFS.EDIT.PC.SHOW"></pc-manage>
        <system-manage :dev-id="devId" :ref="PAGE_ENUM.REFS.EDIT.SYSTEM.REF"
                       v-if="PAGE_ENUM.REFS.EDIT.SYSTEM.SHOW"></system-manage>
        <net-manage :dev-id="devId" :ref="PAGE_ENUM.REFS.EDIT.NET.REF"
                    v-if="PAGE_ENUM.REFS.EDIT.NET.SHOW"></net-manage>
        <product-manage :dev-id="devId" :ref="PAGE_ENUM.REFS.EDIT.PRODUCT.REF"
                        v-if="PAGE_ENUM.REFS.EDIT.PRODUCT.SHOW"></product-manage>
        <storage-dev-manage :dev-id="devId" :ref="PAGE_ENUM.REFS.EDIT.STORAGE_DEV.REF"
                            v-if="PAGE_ENUM.REFS.EDIT.STORAGE_DEV.SHOW"></storage-dev-manage>
        <storage-media-manage :dev-id="devId" :ref="PAGE_ENUM.REFS.EDIT.STORAGE_MEDIA.REF"
                              v-if="PAGE_ENUM.REFS.EDIT.STORAGE_MEDIA.SHOW"></storage-media-manage>
    </div>
</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import SystemManage from "./system/manage";
    import PcManage from "./pc/manage";
    import NetManage from "./net/manage";
    import ProductManage from "./product/manage";
    import StorageDevManage from "./storage_dev/manage";
    import StorageMediaManage from "./storage_media/manage";

    export default {
        name: "detailManage",
        mixins: [bizComm, devComm],
        props: {
            devId: {},
            //设备大类
            categoryType: {
                type: Number,
                required: true
            }
        },
        components: {
            SystemManage,
            PcManage,
            NetManage,
            ProductManage,
            StorageDevManage,
            StorageMediaManage
        },
        watch: {
            devId(newValue, oldValue) {
                this.initManageType();
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        EDIT: {
                            SYSTEM: {//应用系统
                                REF: "systemManage", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE;
                                }
                            },
                            PC: {//服务器与计算机
                                REF: "pcManage", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.PC.CODE;
                                }
                            },
                            NET: {//网络设备
                                REF: "netManage", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.NET.CODE;
                                }
                            },
                            STORAGE_DEV: {//存储与备份设备
                                REF: "storageDevManage", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.STORAGE_DEV.CODE;
                                }
                            },
                            PRODUCT: {//安全保密产品
                                REF: "productManage", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.PRODUCT.CODE;
                                }
                            },
                            STORAGE_MEDIA: {//存储介质
                                REF: "storageMediaManage", SHOW: false, TYPE_CODE: () => {
                                    return this.ENUMS.CATEGORY_TYPE.STORAGE_MEDIA.CODE;
                                }
                            }
                        }
                    }
                },
                //当前的编辑页面ref
                curEdit: null,
            }
        },
        methods: {
            /**
             * 根据设备大类初始化调用的manage页面
             */
            initManageType() {
                if (!!this.categoryType) {
                    for (let i in this.PAGE_ENUM.REFS.EDIT) {
                        let _edit = this.PAGE_ENUM.REFS.EDIT[i];
                        if (_edit.TYPE_CODE() == this.categoryType) {
                            this.curEdit = _edit;
                            this.curEdit.SHOW = true;
                        } else {
                            _edit.SHOW = false;
                        }
                    }
                }
            }
        },
        mounted() {
            this.initManageType();
        }
    }
</script>

<style scoped>

</style>