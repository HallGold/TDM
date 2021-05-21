<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-dialog v-dialogDrag title="指定人员" custom-class="ice-dialog" center :visible.sync="dialogVisibled"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataFormd" label-position="right" :rules="formRules"
                         ref="personForm">
                    <ice-grid-layout name="预置角色人员规则信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="人员" label-width="70px" prop="personId">
                                    <el-select placeholder="请选择" v-model="selectLable" @input="onChange">
                                        <el-option v-for="(item,index) in el_option"
                                                   :key="index"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="人员值" label-width="70px" prop="personName">
                                    <el-input v-model="mainDataFormd.personId" :disabled="readOnly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar " slot="footer" v-if="editData?false:true">
                <el-button  type="primary" @click="saved">确认</el-button>
                <el-button type="info" @click="goBack">返回</el-button>
            </div>
        </ice-dialog>

        <ice-persion-selector style="padding: 0 2%;box-sizing: border-box"
                              label="审核人"
                              title="请选择"
                              text-prop="name"
                              code-prop="code"
                              mode="hidden"
                              choose-item="multiple" ref="selectUser"
                              @select-confirm="selectUserConfirm"
                              @select-cannel="cancelSelectUser">
        </ice-persion-selector>

    </div>
</template>

<script>
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue';
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";

    export default {
        name: "ExtPerson",
        components: {IceGridLayout, IcePersionSelector},
        props: {
            editData: {
                type: Object
            }
        },
        data() {
            return {
                el_option: [{label: "申请人", value: "{applierPerson}"}, {
                    label: "发起人",
                    value: "{currentPerson}"
                }, {label: "申请人上级", value: "{applierLeader}"}
                    , {label: "发起人上级", value: "{currentLeader}"}, {
                        label: "变量:特定人员",
                        value: "{specialPerson}"
                    }, {label: "指定:指定人员", value: "6"}],
                dialogVisibled: false,
                selectLable: "",
                readOnly: true,
                mainDataFormd: {
                    personId: "",
                    personName: ""
                },
                formRules: {
                    personId: [{required: true, message: '请选择人员', trigger: 'blur'}],
                    personName: [{required: true, message: '请选择人员', trigger: 'blur'}]
                },
            }
        },
        methods: {
            clean() {
                this.selectLable = "";
                this.mainDataFormd.personId = '';
                this.mainDataFormd.personName = '';
            },
            edit() {
                if (this.editData) {
                    Object.assign(this.mainDataFormd, {...this.editData});
                }
            },
            saved() {
                this.$refs['personForm'].validate((valid) => {
                    if (valid) {
                        this.dialogVisibled = false;
                        this.$emit("set-ext-person", {...this.mainDataFormd});
                    } else {
                        return false;
                    }
                })
            },
            onChange(val) {
                let txt = this.el_option.find(bt => bt.value == val).label;
                this.mainDataFormd.personName = txt;
                this.mainDataFormd.personId = val;
                if (val == "{specialPerson}") {
                    this.readOnly = false;
                } else {
                    this.readOnly = true;
                }
                if (val == 6) {
                    this.$refs.selectUser.openDialog();
                }
            },
            goBack() {
                this.dialogVisibled = false;
            },
            selectUserConfirm(rows, texts, values) {
                let personId = "", personName = "";
                rows.forEach(item => {
                    personId += "," + item.code;
                    personName += "," + item.name;
                })
                this.mainDataFormd.personName = personName.substr(1);
                this.mainDataFormd.personId = personId.substr(1);
                this.$refs.selectUser.cleanColumnSelect();
            },
            cancelSelectUser() {
                this.$refs.selectUser.cleanColumnSelect();
            }
        }

    }
</script>

<style scoped>

</style>
