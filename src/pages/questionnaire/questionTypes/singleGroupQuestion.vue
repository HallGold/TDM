<template>
    <div>
        <div style="margin-bottom: 10px" v-for="group in groups" :key="group.groupName">
            {{group.groupName}}:
            <!--<ice-label :name="group.groupName">-->
                <div   style="margin-top: 10px" class="radio-wrapper">
                    <el-radio-group :value="value[group.groupCode]" @input="value1=>change(value1,group.groupCode)">
                        <el-radio class="radio" :label="item.optionCode" v-for="item in options" :key="item.optionCode">
                            {{item.optionName}}
                        </el-radio>
                    </el-radio-group>

                </div>
            <!--</ice-label>-->
            <div v-if="userAddWay=='1'">
                <slot :group="group.groupCode"></slot>
            </div>
        </div>
        <div v-if="userAddWay=='0'">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import IceLabel from "../../../components/common/base/IceLabel";
    import groupQuestion from './groupQuestion'

    export default {
        name: "singleGroupQuestion",
        inheritAttrs: false,
        components: {IceLabel},
        mixins: [groupQuestion],
        props: {
            value: {
                type: Object,
                default: _ => {
                    return {};
                }
            },
            options: {
                type: Array,
                default: _ => []
            },
            addition: [String, Object]
        },
        methods: {
            change(value, code) {
                this.$set(this.value, code, value)
                this.$emit('change', this.value)
            },
            getResult() {
                return {
                    answerCode: null,
                    answerText: null,
                    addition: this.userAddWay == '1' ? null : this.addition,
                    quesUserAnswerGroupDetails: this.groups.map(group => {
                        const selected = this.options.find(item => item.optionCode == this.value[group.groupCode])
                        return {
                            examGroupId: group.oid,
                            groupCode: group.groupCode,
                            groupName: group.groupName,
                            answerCode: this.value[group.groupCode],
                            answerText: selected ? selected.optionName : '',
                            addition: this.userAddWay == '1' ? (this.addition ? this.addition[group.groupCode] : null) : null
                        }
                    })
                }
            },
            validate() {
                if (!this.value) {
                    return false
                }
                for (let i = 0; i < this.groups.length; i++) {
                    const group = this.groups[i];
                    if (!this.value[group.groupCode]) {
                        return false
                    }
                }
                return true
            }
        }
    }
</script>

<style scoped>
    .radio-wrapper {
        box-sizing: border-box;
        padding-left: 10px;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>
<style scoped>
    .radio-wrapper .el-radio {
        /* width: 100px;*/
    }
    .radio {
        margin:10px 0 0 20px;
        line-height: 20px !important;
        width: 90% !important;
        word-wrap: break-word !important;
        word-break: break-all !important;
        overflow: hidden !important;
        display:flex;
        white-space:normal;
    }
</style>