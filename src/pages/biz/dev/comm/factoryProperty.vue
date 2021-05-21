<template>
    <div style="width: 100%">
        <ice-grid-layout :columns="1" name="相关厂商">
            <factory-form :factory-list="mainData.factoryReleDTOList" :factory-user-list="mainData.factoryUserDTOList"
                          :oid="mainData.commDTO.oid" :ref="PAGE_ENUM.REFS.FACTORYS_FORM.REF"
                          :is-edit="isEdit"></factory-form>
        </ice-grid-layout>
    </div>
</template>

<script>

    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import FactoryForm from "./factoryForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";

    export default {
        name: "factoryProperty",
        mixins: [bizComm, devComm],
        components: {
            IceGridLayout,
            FactoryForm
        },
        watch: {
            // mainData: {
            //     handler(newData) {
            //         debugger;
            //         this.$emit("update:mainData", newData);
            //     }, deep: true
            // },
        },
        props: {
            mainData: {
                type: Object,
                default: {
                    factorys: []
                }
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        FACTORYS_FORM: {REF: "factorysTable"}
                    }
                }
            }
        },
        methods: {
            /**
             * 初始化控件
             */
            initControls() {
                this.mainData.factoryReleDTOList = this.mainData.factoryReleDTOList || [];
                this.mainData.factoryUserDTOList = this.mainData.factoryUserDTOList || [];
                this.initPageOver();
            },
            /**
             * 校验页面数据
             * @returns {Promise<any>}
             */
            validateData() {
                this.getData();
                return this.$refs[this.PAGE_ENUM.REFS.FACTORYS_FORM.REF].validateFactorys();
            },
            /**
             * 获取页面数据
             */
            getData() {
                let data = this.$refs[this.PAGE_ENUM.REFS.FACTORYS_FORM.REF].getData();
                Object.assign(this.mainData, {
                    factoryUserDTOList: data.factoryUserList,
                    factoryReleDTOList: data.factoryList,
                });
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.FACTORY_TYPE.CODE)
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/edit.less";

    .text {
        width: 70px;
    }

    .factoryContent {
        display: flex;
        align-items: center;
    }

</style>