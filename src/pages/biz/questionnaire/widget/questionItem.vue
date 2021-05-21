<template>
    <div class="question">
        <div class="qs-content">
            <span>{{index}}、</span>
            <span class="item-title">{{title}}
                <span style="color: red;font-size: 10px" v-if="required=='1'">&nbsp;&nbsp;[必填]</span>
            </span>
            <div class="desc" v-if="desc">//{{desc}}</div>
            <component class="op-content question-exam"
                       v-bind:is="type"
                       :value="value"
                       @change="change"
                       @additionChange="additionInput"
                       :addition="addition"
                       v-bind="$attrs"
                       ref="question">

                <div slot-scope="{group}" class="userAddition"
                     v-if="needUserAdd=='1'&&(additionStatus||additionGroupStatus[group])">
                    <div class="additionLabel"><span style="color: red;" v-if="additionRequired=='1'">*</span>{{userAdditionLabel}}：
                    </div>
                    <question-addition-input class="input error" :placeholder="userAdditionTips"
                                             :value="addition?(group?addition[group]:addition):''"
                                             @input="value=>additionInput(value,group)">
                    </question-addition-input>
                </div>

            </component>
        </div>

    </div>
</template>

<script>
    import questionTypes from '../questionTypes'
    import QuestionAdditionInput from "./questionAdditionInput";

    export default {
        name: "questionItem",
        inheritAttrs: false,
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            index: [Number, String],
            title: String,
            desc: String,
            type: String,
            value: [Number, String, Array, Object],
            required: String,
            needUserAdd: String,
            additionRequired: String,
            userAdditionLabel: String,
            userAdditionTips: String,
            additionCondition: String,
            additionConditionValue: String,
            addition: [String, Object]
        },
        data() {
            return {
                questionType: '',
                additionStatus: false,
                additionGroupStatus: {},
                additionValue: "",
            }
        },
        methods: {
            change(value) {
                this.$emit('change', value);

                //获取题目所有结果，如果多个用，分割
                let computeValue = "";

                if (this.type.indexOf("Group") != -1) {//分组
                    let arr = [];
                    for (let group in value) {

                        if (value[group] instanceof Array) {
                            arr.push(...value[group])
                        } else {
                            arr.push(value[group])
                        }
                    }
                    computeValue = arr.join(",");

                } else {//非分组

                    if (value instanceof Array) {
                        computeValue = value.join(",")
                    } else {
                        computeValue = value;
                    }
                }


                if (this.type.indexOf("Group") != -1 && this.$attrs.userAddWay == '1') {//分组且分组追加方式
                    let arrObj = {};
                    for (let group in value) {
                        arrObj[group] = [];
                    }
                    for (let group in value) {
                        if (value[group] instanceof Array) {
                            arrObj[group].push(...value[group]);
                        } else {
                            arrObj[group].push(value[group]);
                        }
                    }
                    for (let group in arrObj) {
                        this.$set(this.additionGroupStatus, group, this.additionCompute(arrObj[group].join(",")))
                    }


                } else {
                    this.additionStatus = this.additionCompute(computeValue)
                }


            },

            //表达式计算规则
            additionCompute(value) {
                if (!value) {
                    return false
                }
                value = value + "";
                if (this.additionCondition == 'all') {
                    return true;
                } else if (this.additionCondition == '=') {
                    if (value == this.additionConditionValue) {
                        return true
                    }
                } else if (this.additionCondition == '<>') {
                    if (value != this.additionConditionValue) {
                        return true
                    }
                } else if (this.additionCondition == 'in') {
                    if (this.additionConditionValue.indexOf(value) != -1) {
                        return true;
                    }
                    if (value.indexOf(this.additionConditionValue) != -1) {
                        return true;
                    }
                } else if (this.additionCondition == 'notin') {
                    let bool = false;
                    let arr = this.additionConditionValue.split(",");
                    for (let i = 0; i < arr.length; i++) {
                        if (value.indexOf(arr[i]) != -1) {
                            bool = false;
                            break;
                        } else {
                            bool = true;
                        }
                    }
                    return bool;
                }
                return false;
            },

            additionInput(value, group) {
                this.additionValue = value;
                if (group) {
                    let addition;
                    if (this.addition) {
                        addition = this.addition
                    } else {
                        addition = {}
                    }
                    this.$set(addition, group, value)
                    this.$emit('update:addition', addition);
                } else {
                    this.$emit('update:addition', value);
                }

            }
            ,
            showAddition(group) {
                let value;
                if (group) {//分组的
                    if (!this.value) {
                        value = ""
                    } else {
                        if (this.$attrs.userAddWay == '0') {//整体追加
                            let vv = [];
                            for (let key in this.value) {
                                if (this.value[key] instanceof Array) {
                                    vv.push(...this.value[key])
                                } else {
                                    vv.push(this.value[key])
                                }

                            }
                            value = vv.join(",")
                        } else {//非整体
                            let vv = [];
                            if (this.value[group] instanceof Array) {
                                vv.push(...this.value[group])
                            } else {
                                vv.push(this.value[group])
                            }
                            value = vv.join(",")
                        }


                    }

                } else {
                    let vv = [];
                    if (this.value instanceof Array) {
                        vv.push(...this.value)
                    } else {
                        vv.push(this.value)
                    }
                    value = vv.join(",")

                }

                return false
            }
            ,
            getResult() {
                if (this.$refs.question) {
                    const result = this.$refs.question.getResult()
                    if (result) {
                        return result
                    }

                }
                return {};
            }
            ,
            //校验数据
            validate() {
                /*if(this.index==22){
                    debugger
                }*/
                let result = true;
                if (this.required != '1') {
                    result = true
                } else {
                    result = this.$refs.question.validate()
                }

                let addition = true;
                if (result) {
                    if (this.needUserAdd == '1' && this.additionRequired == '1') {

                        if (this.type.indexOf("Group") && this.$attrs.userAddWay == '1') {
                            const groups = this.$attrs.groups;

                            for (let i = 0; i < groups.length; i++) {
                                const group = groups[i]
                                if (this.additionGroupStatus[group.groupCode]) {//必须填写附加信息
                                    if (!this.addition || !this.addition[group.groupCode]) {
                                        addition = false
                                        break;
                                    }
                                }
                            }

                        } else {
                            if (this.additionStatus && !this.addition) {
                                addition = false
                            } else {
                                addition = true;
                            }
                        }

                    }
                }
                return {result, addition}
            }
        },
        watch: {
            value: {
                handler(newValue, oldValue) {
                    if (newValue !== oldValue && newValue) {
                        this.change(newValue)
                    }
                }
                ,
                immediate: true
            }
        }
        ,
        components: {
            QuestionAdditionInput,
            ...
                questionTypes
        }
    }
</script>

<style lang="less" scoped>
    .question {
        padding: 10px;
        display: flex;

        .qs-content {
            flex-grow: 1;

            .op-content {
                padding: 25px 0;
            }
        }

        .item-title {
            font-size: 16px;


        }

        .desc {
            color: #999;
        }
    }


</style>
<style lang="less">

    /* .op-content.question-exam {
         .el-radio {
             padding-bottom: 16px;
         }

         .el-checkbox {
             padding-bottom: 16px;
         }
     }*/

    .userAddition {

        display: flex;
        padding-top: 12px;
        padding-bottom: 20px;


        .additionLabel {
            flex-grow: 0;
            line-height: 32px;
            max-width: 250px;
        }

        .input {
            flex-grow: 1;
            box-sizing: border-box;
            padding-left: 10px;
            width: auto;
            max-width: 800px;

            input {
                border-top: none;
                border-left: none;
                border-right: none;
                border-radius: 0;
            }
        }

        .input.error input {
            //  border-color: red;
        }
    }
</style>