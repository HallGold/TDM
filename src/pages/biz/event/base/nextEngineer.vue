<template>
<!-- data-url="/permission/user/users_by_condition?cascade=true"    label-prop="deptShortName" -->
    <ice-pop-selector
            label-prop="deptShortName"
            value-prop="deptCode"
            parent-prop="deptCode"
            data-url="/pro/ProBaseMaintainMember/list"
            textProp="username"
            :codeProp="valueProp"
            :selections="selections"
            ref="select"
            :height="400"
            dialogWidth="400"
            :gridIndex="false"
            :query="query"
            :columns="columns"
            v-on="$listeners"
            dialog-width="1200px"
            v-bind="$attrs"
            v-model="innerValue">
        <span slot="tag" slot-scope="scope">
            <span :title="scope.item.username +'('+(scope.item.deptShortName==scope.item.orgShortName?scope.item.orgShortName:(scope.item.orgShortName+'-'+scope.item.deptShortName))+')'"><!--(scope.item.orgShortName+'-'+scope.item.deptShortName)-->
                {{scope.item.username}} ({{scope.item.deptShortName==scope.item.orgShortName?scope.item.orgShortName:(scope.item.orgShortName+'-'+scope.item.deptShortName)}})
            </span>
        </span>
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "./../../../../components/common/base/IcePopSelector";

    export default {
        name: "nextEngineer",
        model: {
            prop: 'value',
            event: 'IcePersionSelectorchange'
        },
        props: {
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
                dialogWidth:"",
                innerValue: '',
                selections: [],

                query: [
                    {type: 'input', label: '姓名', code: 'USERNAME', value: '', exp: 'like'},
                    {type: 'input', label: '单位', code: 'UNITNAME', value: '', exp: 'like'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '工程师', code: 'username', width: 120},
                    {label: '单位', code: 'unitname', width: 230},
                    /*{label: '联系电话', code: 'phone', width: 100},
                    {label: '部门', code: 'deptShortName', width: 120},*/
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
                    this.$axios.get("/permission/user/get_users", {params: {userCodes: codes}})
                        .then(result => {
                            if (result.data) {
                                let selections = result.data.map(item => {
                                    return {
                                        unitname: item.unitname,
                                        username: item.username,
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
                this.$emit("IcePersionSelectorchange", this.innerValue);
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


<style scoped>

</style>
