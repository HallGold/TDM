<template>
    <div>
        <el-input :class="{'filter-input':true,'filter-input-single':filterOption.type!='textRange'}"
                  type="text"
                  v-model="data.input1"
                  @keydown.enter.native="confirmFilter"
                  @input="changeOptionEvent"
                  v-bind="filterOption.props"></el-input>
        <div style="display: inline-block" v-if="filterOption.type=='textRange'">&nbsp;至&nbsp;</div>
        <el-input class="filter-input"
                  v-if="filterOption.type=='textRange'"
                  type="text"
                  v-model="data.input2"
                  @keydown.enter.native="confirmFilter"
                  @input="changeOptionEvent"
                  v-bind="filterOption.props"></el-input>
    </div>
</template>

<script>
    import XEUtils from "xe-utils";

    export const defaultConfig = {
        type: 'text',//text  单文本查询   textRange  文本范围查询
        exp: 'like',//关系符  仅在单文本中使用    = >  >=  <  <=  like  leftLike   rightLike
        ignoreCase: false,  //是否忽略大小写
        props: {
            placeholder: '请输入查询条件',
            clearable: true
        }
    }

    export default {
        name: "IceFilterInput",
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
