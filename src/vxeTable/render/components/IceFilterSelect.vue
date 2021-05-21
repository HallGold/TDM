<template>
    <ice-select class="filter-input"
                v-bind="filterOption.props"
                value-model="string"
                v-model="option[0].data"
                @changevalue="changeOptionEvent">
    </ice-select>
</template>

<script>
    import XEUtils from "xe-utils";

    export const defaultConfig = {

        props: {
            placeholder: '请选择',
            clearable: true,
            filterable: true,
            collapseTags: true,
            multiple: false,
        }
    }

    export default {
        name: "IceFilterSelect",
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
            }
        },
        methods: {
            changeOptionEvent() {
                const {option} = this
                const checked = !(XEUtils.eqNull(this.option[0].data) || this.option[0].data === '')
                this.context.changeOption(null, checked, option[0])
                if (!this.filterOption.props.multiple) {
                    this.confirmFilter();
                }
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
            this.option[0]._data = ""
            this.filterOption = Object.assign({}, defaultConfig, this.renderOpts)
            this.filterOption.props = Object.assign({}, defaultConfig.props, this.renderOpts.props)
            this.filterOption.props.multiple = this.filterOption.multiple
        },
        components: {}
    }

</script>


<style scoped>
    .filter-input {
        display: inline-block;
        width: 170px;
    }
</style>
