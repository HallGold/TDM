<template>
    <ice-pop-selector
            :load-url="loadUrl"
            label-prop="deptName"
            value-prop="deptCode"
            :lazy="false"
            parent-prop="deptCode"
            data-url="/permission/frame_org/load_table_next_children?loadDisabled=false&hasSelf=true"
            textProp="deptShortName"
            :codeProp="valueProp"
            :selections="selectedDept"
            ref="select"
            :height="600"
            :gridIndex="false"
            :query="query"
            :columns="columns"
            :pagination="false"
            v-on="$listeners"
            v-bind="$attrs"
            v-model="innerValue">
        <span slot="tag" slot-scope="scope">
                {{scope.item.deptShortName}}
        </span>
    </ice-pop-selector>
</template>

<script>

    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    export default {
        name: "selectDept",
        model: {
            prop: 'value',
            event: 'IceDeptSelectorchange'
        },
        props: {
            value: String,
            valueProp: {
                type: String,
                default: 'deptCode'
            },
            allDept: Boolean,
            deptCode: String,
            selectedDept: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                arr:[],
                innerValue: '',
                query:[],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '部门名称', code: 'deptShortName', width: 220},
                    {label: '部门编码', code: 'deptCode', width: 120},
                ]
            }
        },
        methods: {
            openDialog() {
                this.$refs.select.openDialog();
            },
            cleanColumnSelect() {
                this.$refs.select.cleanColumnSelect();
            },
        },
        computed: {
            loadUrl() {
                if (this.allDept) {
                    return `/permission/frame_org/load_tree?loadDisabled=false&deptCode=90`
                }
                if (this.deptCode) {
                    return `/permission/frame_org/load_tree?loadDisabled=false&deptCode=${this.deptCode}`
                }
                return '/permission/frame_org/load_table_tree?loadDisabled=false'
            }
        },
        watch: {
            value: {
                handler(value) {
                    this.innerValue = value;
                },
                immediate: true
            },
            innerValue() {
                this.$emit("IceDeptSelectorchange", this.innerValue);
            },
        },
        mounted() {
        },
        components: {IcePopSelector}
    }

</script>


<style scoped>

</style>
