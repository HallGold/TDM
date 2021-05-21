<template>
    <div>
        <ice-date-picker class="filter-input"
                         :style="{width:filterOption.type=='dateRange'?'170px':'200px'}"
                         v-model="data.input1"
                         max="scope:input2"
                         :scope="data"
                         @keydown.enter.native="confirmFilter"
                         @input="changeOptionEvent"
                         format="yyyy年MM月dd日"
                         v-bind="filterOption.props"></ice-date-picker>
        <div style="display: inline-block" v-if="filterOption.type=='dateRange'">&nbsp;至&nbsp;</div>
        <ice-date-picker class="filter-input"
                         style="width: 170px"
                         v-if="filterOption.type=='dateRange'"
                         v-model="data.input2"
                         min="scope:input1"
                         :scope="data"
                         @keydown.enter.native="confirmFilter"
                         @input="changeOptionEvent"
                         format="yyyy年MM月dd日"
                         v-bind="filterOption.props"></ice-date-picker>
    </div>
</template>

<script>
    import XEUtils from "xe-utils";

    export const defaultConfig = {
        type: 'dateRange',//date  单日期查询   dateRange  日期范围查询
        exp: '=',//关系符  仅在单日期查询中使用    = >  >=  <  <=
        props: {
            placeholder: '请选择',
            clearable: true
        }
    }

    export default {
        name: "IceFilterDate",
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
        width: 170px;
    }

    .filter-input-single {
        width: 200px;
    }
</style>
