<template>
    <div style="width: 100%">
        <ice-grid-layout name="规格相关" :columns="1">
            <div :layout="1" style="display: flex">
                <div :class="showMac ?'standardContent' :'standardContentNOMac'" style="margin-right: 16px" id="left">
                    <div class="text">设备规格</div>
                    <div v-if="false">
                        <ice-editable-table :data="mainData.devPvDTOList"
                                            :height="200"
                                            style="width: 100%"
                                            ref="editTable">
                            <el-table-column prop="name"
                                             :width="typeWidth"
                                             label="规格类型">
                            </el-table-column>
                            <ice-editable-table-column prop="value"
                                                       :disabled="!isEdit"
                                                       type="input"
                                                       :width="320"
                                                       label="规格明细">
                            </ice-editable-table-column>
                            <el-table-column prop="id" v-if="false"
                                             label="id">
                            </el-table-column>
                            <el-table-column prop="devId" v-if="false"
                                             label="devId">
                            </el-table-column>
                            <el-table-column prop="propertyId" v-if="false"
                                             label="propertyId">
                            </el-table-column>
                            <el-table-column prop="detail" v-if="false"
                                             label="detail">
                            </el-table-column>
                            <el-table-column prop="necessary" v-if="false"
                                             label="necessary">
                            </el-table-column>
                        </ice-editable-table>
                        <div class="tableTips" v-if="PAGE_ENUM.VALIDATE_TYPE.standardV">
                            请录入规格类型为【{{PAGE_ENUM.VALIDATE_TYPE.standardRow}}】的明细
                        </div>
                    </div>
                    <el-input type="textarea" v-model="mainData.commDTO.devNorm" :rows="8" placeholder="请输入设备规格明细"
                              :disabled="!isEdit"></el-input>
                </div>
                <div class="standardContent" v-if="showMac">
                    <div :class="isEdit?'isEditTrue':''" id="right">
                        <mac-property :is-edit="isEdit" :mac-list="mainData.macIpDTOList"
                                      :ref="PAGE_ENUM.REFS.MAC.REF" :dev-id="mainData.commDTO.oid"></mac-property>
                    </div>
                </div>
            </div>
        </ice-grid-layout>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import MacProperty from "./macProperty";

    export default {
        name: "standardProperty",
        components: {MacProperty, IceEditableTableColumn, IceEditableTable, IceGridLayout},
        mixins: [bizComm, devComm],
        props: {
            tableData: Array,
            isEdit: {
                type: Boolean,
                default: false
            },
            mainData: {}
        },
        data() {
            return {
                width: 0,
                typeWidth: 0,          //规格类型宽度
                detailsWidth: 0,       //规格明细宽度
                widthNum: 0,           //设备规格外层div宽度
                PAGE_ENUM: {
                    REFS: {
                        MAC: {REF: "mac"}
                    },
                    VALIDATE_TYPE: {
                        standardRow: "",
                        standardV: false
                    }
                },
                showMac: true
            }
        },
        watch: {
            /*  mainData: {
                  handler(newData, oldData) {
                      debugger
                      if (newData.commDTO.childType != oldData.commDTO.childType) {
                          this.setDevPvDtoList(newData.commDTO.childType);
                      }
                  }, deep: false
              }*/
        },
        methods: {
            /**
             * 设置规格属性值
             */
            setDevPvDtoList(childType) {
                let _this = this;
                this.mainData.devPvMap = this.mainData.devPvMap || {};
                this.axios(this.ENUMS.ACTIONS.GET_STANDARD_LIST, {
                    category: childType,
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
                    _this.mainData.devPvMap[childType] = res.data;
                }]);
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                // if (!this.mainData.devPvDTOList || this.mainData.devPvDTOList.length == 0) {
                this.setDevPvDtoList(this.mainData.commDTO.childType);
                // }
                this.mainData.macIpDTOList = this.mainData.macIpDTOList || [];
                this.initPageOver();
            },
            /**
             * 校验设备规则
             * @returns {Promise<any>}
             */
            validateStandard() {
                let validate = true;
                if (this.mainData.devPvDTOList) {
                    for (let i = 0; i < this.mainData.devPvDTOList.length; i++) {
                        if (this.mainData.devPvDTOList[i].necessary == this.ENUMS.YES_NO.YES && !!!this.mainData.devPvDTOList[i].value) {
                            this.PAGE_ENUM.VALIDATE_TYPE.standardRow += this.mainData.devPvDTOList[i].name;
                            this.PAGE_ENUM.VALIDATE_TYPE.standardV = true;
                            validate = false;
                            break;
                        }
                    }
                    return new Promise((resolve, reject) => {
                        if (validate) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                }
            },
            /**
             * 校验页面数据
             * @returns {Promise<[any, any]>}
             */
            validateData() {
                return Promise.all([this.$refs[this.PAGE_ENUM.REFS.MAC.REF].validateMac()]);
            }
        },
        mounted() {
            this.$nextTick(() => {
                let widthNum = document.getElementById("left").offsetWidth;
                // this.width = document.getElementById("right").offsetWidth;
                this.typeWidth = widthNum * 0.3;
                this.detailsWidth = widthNum - widthNum * 0.3;
                this.initControls();
            });
        }
    }
</script>

<style scoped>
    .text {
        width: 70px;
    }

    .standardContent {
        display: flex;
        align-items: center;
        width: 50%;
    }

    .standardContentNOMac {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .isEditTrue {
        /*margin-top: -37px;*/
    }
</style>