<template>
    <div>
        <el-input-number :class="{'filter-input':true,'filter-input-single':filterOption.type!='numberRange'}"
                         v-model="data.input1"
                         @keydown.enter.native="confirmFilter"
                         @input="changeOptionEvent"
                         v-bind="filterOption.props"></el-input-number>
        <div style="display: inline-block" v-if="filterOption.type=='numberRange'">&nbsp;至&nbsp;</div>
        <el-input-number class="filter-input"
                         v-if="filterOption.type=='numberRange'"
                         v-model="data.input2"
                         @keydown.enter.native="confirmFilter"
                         @input="changeOptionEvent"
                         v-bind="filterOption.props"></el-input-number>
    </div>
</template>

<script>
    import XEUtils from "xe-utils";

    export const defaultConfig = {
        type: 'numberRange',//number  单数字查询   numberRange  数字范围查询
        exp: '=',//关系符  仅在单数字查询中使用    = >  >=  <  <=
        props: {
            placeholder: '请输入',
            controls: false,
            clearable: true
        }
    }

    export default {
        name: "IceFilterNumber",
        props: {
            params: Object,
            context: Object,
            renderOpts: Object
        },
        data() {
            return {
                column: null,
                option: [],
                filterOption: {},
                data: {
                    input1: '',
                    input2: ''
                }
            }
        },
        methods: {
            changeOptionEvent() {
                const {option} = this
                const checked = !XEUtils.isEmpty(this.data)
                this.context.changeOption(null, checked, option[0])
            },
            confirmFilter() {
                this.context.confirmFilter()
            }
        },
        created() {
            // filters 可以配置多个，实际只用一个就可以满足需求了
            // filters 可以配置多个，实际只用一个就可以满足需求了
            const {column} = this.params
            this.column = column
            this.option = column.filters
            this.data = this.option[0].data
            //用于在重置之后还原数据，修复bug
            this.option[0]._data = {
                input1: '',
                input2: ''
            }
            this.filterOption = Object.assign({}, defaultConfig, this.renderOpts)
            this.filterOption.props = Object.assign({}, defaultConfig.props, this.renderOpts.props)
        },
        components: {}
    }

</script>


<style scoped>
    .filter-input {
        display: inline-block;
        width: 150px;
    }

    .filter-input-single {
        width: 200px;
    }
</style>
