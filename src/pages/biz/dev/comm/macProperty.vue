<template>
    <div class="form-content">
        <div style="display: flex;align-items: center">
            <div style="width: 60px">MAC地址</div>
            <div>
                <div class="add_cls" v-if="isEdit">
                    <el-button @click="add" :type="COMM_ENUMS.BUTTON.ADD.type" :icon="COMM_ENUMS.BUTTON.ADD.icon"
                               class="tableBtn">{{COMM_ENUMS.BUTTON.ADD.name}}
                    </el-button>
                </div>
                <ice-editable-table :data="macList"
                                    :height="200"
                                    style="width: 100%"
                                    :rules="tableRules"
                                    :ref="PAGE_ENUM.REFS.MAC_TABLE.REF">
                    <el-table-column :width="50"
                                     label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <ice-editable-table-column prop="mac"
                                               :width="220"
                                               input-type="input"
                                               :disabled="!isEdit"
                                               label="MAC地址">
                    </ice-editable-table-column>
                    <ice-editable-table-column label="是否启用" :width="130"
                                               type="input" prop="using">
                        <template slot-scope="scope">
                            <el-select placeholder="请选择" :disabled="!isEdit" v-model="scope.row.using">
                                <el-option
                                        v-for="(item,index) in ENUMS.TRUE_AND_FALSE.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </template>
                    </ice-editable-table-column>
                    <el-table-column prop="id" v-if="false"
                                     label="id">
                    </el-table-column>
                    <el-table-column prop="devId" v-if="false"
                                     label="devId">
                    </el-table-column>
                    <el-table-column label="操作" :width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="isEdit"
                                       size="small" @click="deleteItem(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </ice-editable-table>
            </div>
        </div>
    </div>
</template>

<script>
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import {macTest} from "@/pages/biz/dev/js/comm/commValidator"

    export default {
        name: "macProperty",
        mixins: [bizComm, devComm],
        components: {IceEditableTableColumn, IceEditableTable},
        props: {
            width: Number,
            isEdit: {
                type: Boolean,
                default: false
            },
            macList: {
                type: Array,
                default: []
            },
            devId: String
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        MAC_TABLE: {REF: "macTable"}
                    }
                },
                tableRules: {//列表验证规则
                    mac: {validator: macTest, required: true, trigger: 'blur'}
                }
            }
        },
        methods: {
            /**删除*/
            deleteItem(index) {
                this.macList.splice(index, 1);
            },
            /**新增*/
            add() {
                let obj = {};
                obj.mac = '';
                obj.using = this.ENUMS.TRUE_AND_FALSE.TRUE;
                obj.devId = this.devId;
                this.macList.push(obj);
            },
            /**
             * 校验页面数据
             * @returns {Promise<any>}
             */
            validateMac() {
                return new Promise((resolve, reject) => {
                    this.$refs[this.PAGE_ENUM.REFS.MAC_TABLE.REF].validateAll((valid) => {
                        if (!valid) {
                            reject();
                        } else {
                            resolve('mac地址校验失败,请核对!');
                        }
                    });
                });
            }
        },
        mounted() {
            this.initPageOver();
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/edit.less";

    .form-content {
        width: 100%;
    }

    .add_cls {
        margin-bottom: 2px
    }

    .form-content {
        width: 100%;
    }
</style>