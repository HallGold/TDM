<template>

    <ice-pop-selector
            :load-url="`/permission/frame_org/load_tree?loadDisabled=false${qDeptCode?'&deptCode='+qDeptCode:''}`"
            label-prop="deptShortName"
            value-prop="oid"
            :lazy="false"
            parent-prop="deptId"
            data-url="/permission/user/users_by_condition?cascade=true"
            textProp="name"
            :codeProp="valueProp"
            :selections="selections"
            ref="select"
            :height="500"
            :gridIndex="false"
            :query="query"
            :columns="columns"
            v-on="$listeners"
            dialog-width="1200px"
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
        name: "IcePersionByDeptSelector",
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
            allDept: Boolean,
            deptCode: String,
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
                    {label: '密级', code: 'securityLevel',mapTypeCode: 'OR_SECRET_LEVEL',width: 75},
                    {label: '单位', code: 'orgShortName', width: 180},
                    {label: '部门', code: 'deptShortName'},
                    {label: '工号', code: 'workCard', width: 100},
                    {label: '联系电话', code: 'phone', width: 110},
                ]
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
        computed: {
            qDeptCode() {
                if (this.allDept) {
                    return '90'
                }
                if (this.deptCode) {
                    return this.deptCode
                }
            },
        },
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
