<template>
    <div style="max-height: 600px;overflow-y: auto;margin: 0;width: 980px">
        <el-form :model="formData" :rules="rules" label-position="right"
                 :disabled="readonly"
                 ref="form" style="margin-top: 10px;padding: 0 20px;width: 900px">
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="题目标题:" label-width="100px" prop="examTitle">
                        <el-input placeholder="请输入题目标题" v-model="formData.examTitle" :showWordLimit="true"
                                  maxlength="290" rows="4" resize="none" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="题目描述:" label-width="100px" prop="examDesc">
                        <el-input type="textarea"
                                  :rows="2"
                                  :showWordLimit="true"
                                  maxlength="290"
                                  placeholder="请输入题目描述"
                                  resize="none"
                                  v-model="formData.examDesc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="题目类型:" label-width="100px" prop="examType">
                        <el-select v-model="formData.examType" placeholder="请选择题目类型"
                                   @change="examTypeChange">
                            <el-option label="单选题" value="singleQuestion"></el-option>
                            <el-option label="多选题" value="multiQuestion"></el-option>
                            <el-option label="打分题" value="scoreQuestion"></el-option>
                            <el-option label="文本题" value="textQuestion"></el-option>
                            <el-option label="单选分组题" value="singleGroupQuestion"></el-option>
                            <el-option label="多选分组题" value="multiGroupQuestion"></el-option>
                            <el-option label="打分分组题" value="scoreGroupQuestion"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="允许用户追加:" label-width="110px" prop="needUserAdd"
                                  v-if="formData.examType!='textQuestion'">
                        <el-checkbox v-model="formData.needUserAdd" true-label="1" false-label="0"
                                     @change="userAdd(formData.needUserAdd)"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="formData.needUserAdd=='1'&&formData.examType.indexOf('Group')!=-1">
                    <el-form-item label="追加方式:" label-width="100px" prop="userAddWay">
                        <el-checkbox v-model="formData.userAddWay" true-label="1" false-label="0">
                            {{(formData.userAddWay=='0'||!formData.userAddWay)?'整体':'分组'}}
                        </el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="5" v-if="formData.needUserAdd=='1'">
                    <el-form-item label="追加是否必填:" label-width="110px" prop="additionRequired">
                        <el-checkbox v-model="formData.additionRequired" true-label="1"
                                     false-label="0"></el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="formData.needUserAdd=='1'">
                    <el-form-item label="追加条件:" label-width="100px" prop="additionCondition">
                        <el-select v-model="formData.additionCondition" placeholder="请选择追加条件">
                            <el-option label="一直显示" value="all"></el-option>
                            <el-option label="当条件等于" value="="></el-option>
                            <el-option label="当条件不等于" value="<>"></el-option>
                            <el-option label="当条件包含" value="in"></el-option>
                            <el-option label="当条件不包含" value="notin" :disabled="conditionDisabled"></el-option>
                        </el-select>
                        <!-- <ice-select map-type-code="examType" v-model="formData.additionCondition"></ice-select>-->
                    </el-form-item>
                </el-col>
                <el-col :span="12"
                        v-if="formData.additionCondition!='all'&&formData.additionCondition!='notall'&&formData.needUserAdd=='1'">
                    <el-form-item label="追加条件判断值:" label-width="120px" prop="additionConditionValue">
                        <el-input placeholder="多个值使用,(逗号)分割" v-model="formData.additionConditionValue"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24" v-if="formData.needUserAdd=='1'">
                    <el-form-item label="追加label:" label-width="100px" prop="userAdditionLabel">
                        <el-input placeholder="请输入题目标题" v-model="formData.userAdditionLabel" :showWordLimit="true"
                                  maxlength="50"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24" v-if="formData.needUserAdd=='1'">
                    <el-form-item label="追加提示语:" label-width="100px" prop="userAdditionTips">
                        <el-input placeholder="请输入题目标题" v-model="formData.userAdditionTips" :showWordLimit="true"
                                  maxlength="50"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>
        <el-tabs v-model="tabValue" style="padding: 0 20px;height: 360px" v-if="formData.examType!='textQuestion'">

            <el-tab-pane label="选项维护" name="options" class="ice-container">
                <editable-table v-model="options"
                                :disabled="readonly"
                                ref="options"
                                min-height="250px"
                                :grid-index="true"
                                :rules="gridRules"
                                :columns="columns"
                                :buttons="buttons"
                                :operations="operations">

                </editable-table>
            </el-tab-pane>
            <el-tab-pane label="分组维护" name="groups"
                         v-if="['singleGroupQuestion','multiGroupQuestion','scoreGroupQuestion'].indexOf(formData.examType)!=-1">
                <editable-table v-model="groups"
                                :disabled="readonly"
                                ref="groups"
                                min-height="250px"
                                :grid-index="true"
                                :rules="{groupCode:[{required: true,message:'分组编码必须输入'},{repeatable:false,message:'分组编码不能重复'}],groupName:[{required: true,message:'分组名称必须输入'},{repeatable:false,message:'分组名称不能重复'}]}"
                                :columns="[{code:'groupCode',label:'分组编码',width:200,type:'input',editable:true},{code:'groupName',label:'分组名称',width:200,type:'input',editable:true, maxLength: 30}]"
                                :buttons="[{code:'add',name:'新增',commond:'addRow'}]"
                                :operations="[{code:'delete',name:'删除',commond:'deleteRow'},{code:'moveup',name:'上移',commond:'moveup'},{code:'movedown',name:'下移',commond:'movedown'}]">
                </editable-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import EditableTable from "../../../components/common/form/panels/tablePanel/EditableTable";
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        name: "questionEditor",
        components: {IceSelect, EditableTable},
        props: {
            readonly: Boolean
        },
        data() {
            return {
                formData: {
                    oid: '',
                    examTitle: '',
                    examDesc: '',
                    examType: 'singleQuestion',
                    needUserAdd: '0',
                    userAddWay: '0',
                    additionRequired: 0,
                    additionCondition: 'all',
                    additionConditionValue: '',
                    userAdditionLabel: '请输入您的意见',
                    userAdditionTips: '为了我们更好的服务，请您输入宝贵的意见'
                },
                rules: {
                    examTitle: [{required: true, message: '标题必须输入'}]
                },
                tabValue: 'options',
                options: [
                    /* {optionName: '', optionCode: ''}*/
                ],
                groups: [
                    /* {groupName: '', groupCode: ''}*/
                ]
            }
        },
        methods: {
            async getData() {
                await this.$refs.form.validate();
                if (this.$refs.options) {

                    for (let i = 0; i < this.groups.length; i++) {
                        if ("" == this.groups[i].groupCode || "" == this.groups[i].groupName) {
                            this.$message.warning("分组编码或分组名称不能为空，请维护");
                            break;
                        }
                    }
                    await this.$refs.options.validate();

                    if (this.options.length <= 0) {
                        this.$message.warning("选项信息不能为空，请维护")
                        throw "选项信息不能为空，请维护"
                    }
                }

                if (this.$refs.groups) {
                    await this.$refs.groups.validate();
                    if (this.groups.length <= 0) {
                        this.$message.warning("分组信息不能为空，请维护")
                        throw "分组信息不能为空，请维护"
                    }
                }


                return {
                    ...this.formData,
                    options: this.options.map((item, index) => {
                        return {
                            ...item,
                            sequence: index + 1
                        }
                    }),
                    groups: this.groups.map((item, index) => {
                        return {
                            ...item,
                            sequence: index + 1
                        }
                    })
                }
            },
            setData(data) {
                if (!data) {
                    this.formData = {
                        oid: '',
                        examTitle: '',
                        examDesc: '',
                        examType: 'singleQuestion',
                        needUserAdd: '0',
                        userAddWay: '0',
                        additionRequired: '0',
                        additionCondition: 'all',
                        additionConditionValue: '',
                        userAdditionLabel: '请输入您的意见',
                        userAdditionTips: '为了我们更好的服务，请您输入宝贵的意见'
                    };
                    this.options = [
                        {optionName: '', optionCode: ''}
                    ]
                    this.groups = [
                        {groupName: '', groupCode: ''}
                    ]

                } else {
                    this.formData = data
                    this.options = data["options"]
                    this.groups = data["groups"]
                }

            },
            examTypeChange(value) {
                this.options = [];
                this.tabValue = "options";
                if (value == 'textQuestion') {
                    this.formData.needUserAdd = '0'
                }

                /*if ((value == 'scoreQuestion' || value == "scoreGroupQuestion")) {
                     this.options = [{optionCode: 1, optionName: ` 1分`}];
                }*/
            },
            /**
             * 允许用户追加切换时，清空关联数据
             * @param val
             * */
            userAdd(val) {
                if ('0' == val) {
                    this.formData.userAddWay = val;
                    this.formData.additionRequired = val;
                }
            }
        },
        computed: {
            //问卷追加条件，屏蔽分组的不包含选项
            conditionDisabled() {
                if (this.formData.examType == 'singleGroupQuestion' || this.formData.examType == 'multiGroupQuestion' || this.formData.examType == 'scoreGroupQuestion') {
                    if ((this.formData.userAddWay == '0' || !this.formData.userAddWay)) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false;
                }
            },

            columns() {
                if (this.formData.examType == 'scoreQuestion' || this.formData.examType == "scoreGroupQuestion") {
                    return [
                        {
                            code: 'optionCode',
                            label: '打分分数',
                            width: 200,
                            type: 'input',
                            editable: false
                        },
                        {code: 'optionName', label: '分数描述', width: 200, type: 'input', editable: true, maxLength: 20}]
                } else {
                    return [
                        {
                            code: 'optionCode',
                            label: '选项编码',
                            width: 200,
                            type: 'input',
                            editable: true,
                            maxLength:10
                        },
                        {
                            code: 'optionName',
                            label: '选项名称',
                            width: 200,
                            type: 'input',
                            editable: true,
                            showWordLimit: true,
                            maxLength: 290
                        }]
                }

            },
            buttons() {
                if (this.formData.examType == 'scoreQuestion' || this.formData.examType == "scoreGroupQuestion") {
                    return [{
                        code: 'add', name: '新增', commond: 'addRow', data: _ => {
                            return {optionCode: this.options.length + 1, optionName: `${this.options.length + 1}分`}
                        }
                    }]
                } else {
                    return [{code: 'add', name: '新增', commond: 'addRow'}]
                }

            },
            gridRules() {
                if (this.formData.examType == 'scoreQuestion' || this.formData.examType == "scoreGroupQuestion") {
                    return {
                        optionName: [{required: true, message: '选项名称必须输入'}]
                    }
                } else {
                    return {
                        optionCode: [{required: true, message: '选项编码必须输入'}, {repeatable: false, message: '选项编码不能重复'}],
                        optionName: [{required: true, message: '选项名称必须输入'}, {repeatable: false, message: '选项名称不能重复'}]
                    }
                }

            },
            operations() {
                if (this.formData.examType == 'scoreQuestion' || this.formData.examType == "scoreGroupQuestion") {
                    return [{
                        code: 'delete',
                        name: '删除',
                        commond: 'deleteRow',
                        isShow: (row, index) => {
                            return index == this.options.length - 1
                        }
                    }]
                } else {
                    return [{code: 'delete', name: '删除', commond: 'deleteRow'}, {
                        code: 'moveup',
                        name: '上移',
                        commond: 'moveup'
                    }, {
                        code: 'movedown', name: '下移', commond: 'movedown'
                    }]
                }


            }
        }
    }
</script>

<style scoped>

</style>