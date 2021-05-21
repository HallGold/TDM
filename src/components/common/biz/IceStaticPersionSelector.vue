<template>
    <ice-pop-selector
            :grid-data="gridData"
            textProp="name"
            :codeProp="valueProp"
            :selections="selections"
            ref="select"
            :height="600"
            :gridIndex="false"
            :query="query"
            :pagination="false"
            :columns="columns"
            v-on="$listeners"
            dialog-width="1000px"
            v-bind="$attrs"
            v-model="innerValue">
        <span slot="tag" slot-scope="scope">
            <span :title="scope.item.name +'('+(scope.item.deptShortName==scope.item.orgShortName?scope.item.orgShortName:(scope.item.orgShortName+'-'+scope.item.deptShortName))+')'"><!--(scope.item.orgShortName+'-'+scope.item.deptShortName)-->
                {{scope.item.name}} ({{scope.item.deptShortName==scope.item.orgShortName?scope.item.orgShortName:(scope.item.orgShortName+'-'+scope.item.deptShortName)}})
            </span>

        </span>
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../base/IcePopSelector";

    export default {
        name: "IceStaticPersionSelector",
        model: {
            prop: 'value',
            event: 'IceStaticPersionSelectorchange'
        },
        props: {
            gridData: {
                type: Array,
                default: () => []
            },
            value: String,
            valueProp: {
                type: String,
                default: 'code'
            },
            selectedPersion: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {

                innerValue: '',
                selections: [],

                query: [
                    {type: 'input', label: '姓名', code: 'name', value: '', exp: 'like'},
                    /* {type: 'input', label: '编码', code: 'code', value: '', exp: 'like'},*/
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '姓名', code: 'name', width: 250},
                    {label: '编码', code: 'code', width: 230, hidden: true},
                    {label: '联系电话', code: 'phone', width: 100},
                    {label: '部门', code: 'deptCode', width: 120, cusMapTypeCode: 'DEPT'},
                    /*{label: '岗位', code: 'gw', width: 120}*/
                    /*{label: '备注', code: 'remark', width: 320}*/]
            }
        },
        methods: {
            selectCannel() {
                this.$refs.select.selectCannel();
            },
            openDialog() {
                this.$refs.select.openDialog();
            },
            cleanColumnSelect() {
                this.$refs.select.cleanColumnSelect();
            },
            loadSectionsList() {
                if (this.selectedPersion && this.selectedPersion.length > 0) {
                    let codes = this.selectedPersion.map(item => {
                        if (typeof item == 'string') {
                            return item
                        } else {
                            return item.code
                        }
                    }).join(",");
                    //debugger
                    this.$axios.get("/permission/user/get_users", {params: {userCodes: codes}})
                        .then(result => {
                            if (result.data) {
                                let selections = result.data.map(item => {
                                    return {
                                        code: item.code,
                                        name: item.name,
                                        deptShortName: item.deptShortName,
                                        orgShortName: item.orgShortName
                                    }
                                })
                                this.selections = selections;
                                this.$nextTick(() => {
                                    this.$refs.select.reDoSelection();
                                })
                            }
                        })

                } else {
                    this.selections = [];
                }
            }
        },
        computed: {},
        watch: {
            value() {
                this.innerValue = this.value;
            },
            innerValue() {
                this.$emit("IceStaticPersionSelectorchange", this.innerValue);
            },
            selectedPersion() {
                this.loadSectionsList()
            }
        },
        created() {
            this.loadSectionsList()
        },
        mounted() {
            this.innerValue = this.value;
        },
        components: {IcePopSelector}
    }
</script>

<style lang="less" scoped>

</style>