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
            :selections="selections"
            ref="select"
            :height="600"
            :gridIndex="false"
            :query="query"
            :columns="columns"
            :pagination="false"
            @dialog-change="$nextTick(()=>{loadSelectionDepts()})"
            v-on="$listeners"
            v-bind="$attrs"
            v-model="innerValue">
        <!--<text>111</text>-->
        <span slot="tag" slot-scope="scope">
                {{scope.item.deptName}}
        </span>
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../base/IcePopSelector";

    export default {
        name: "IceDeptSelector",
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
                selections:[],

                innerValue: '',

                   query:[],
                // query: [
                //     {type: 'input', label: '部门名称', code: 'deptShortName', value: '', exp: 'like'},
                //     {type: 'input', label: '部门编码', code: 'deptCode', value: '', exp: 'like'},
                // ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '部门名称', code: 'deptShortName', width: 220},
                    {label: '部门编码', code: 'deptCode', width: 120},
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
            loadSelectionDepts() {
                if (this.selectedDept && this.selectedDept.length > 0) {
                    let codes = this.selectedDept.map(item => {
                        if (typeof item == 'string') {
                            return item
                        } else {
                            return item.code
                        }
                    }).join(",");
                    this.$axios.get("/permission/frame_org/get_dept_list", {params: {deptCodes: codes}})
                        .then(result => {
                            if (result.data) {
                                this.selections = result.data;
                            }
                        })

                } else {
                    this.selections = [];

                }

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
