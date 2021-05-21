<template>
    <ice-pop-selector
            :codeProp="valueProp"
            :columns="columns"
            :gridIndex="false"
            :height="600"
            :lazy="false"
            :load-url="loadUrl"
            :pagination="false"
            :query="query"
            :selections="selectedOrg"
            data-url="/permission/frame_org/outer/load_org_tenant"
            label-prop="deptName"
            parent-prop="deptCode"
            ref="select"
            textProp="deptShortName"
            v-bind="$attrs"
            v-model="innerValue"
            v-on="$listeners"
            value-prop="deptCode">
        <!--<text>111</text>-->
        <span slot="tag" slot-scope="scope">
                {{scope.item.deptShortName}}
        </span>
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../base/IcePopSelector";

    export default {
        name: "IceOrgSelector",
        model: {
            prop: 'value',
            event: 'IceOrgSelectorchange'
        },
        props: {
            value: String,
            valueProp: {
                type: String,
                default: 'orgCode'
            },
            allOrg: Boolean,
            orgCode: String,
            selectedOrg: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                innerValue: '',
                query: [],
                // query: [
                //     {type: 'input', label: '部门名称', code: 'deptShortName', value: '', exp: 'like'},
                //     {type: 'input', label: '部门编码', code: 'deptCode', value: '', exp: 'like'},
                // ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '单位名称', code: 'deptName', width: 220},
                    {label: '单位编码', code: 'deptCode', width: 120},
                    /*{label: '联系电话', code: 'phone', width: 120},
                    {label: '部门', code: 'deptCode', width: 120},*/
                    /*{label: '岗位', code: 'gw', width: 120}*/
                    /*{label: '备注', code: 'remark', width: 320}*/]
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
                // load_tenant
                return '/permission/frame_org/load_tenant';
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
                this.$emit("IceOrgSelectorchange", this.innerValue);
            },
        },
        mounted() {
        },
        components: {IcePopSelector}
    }

</script>


<style scoped>

</style>
