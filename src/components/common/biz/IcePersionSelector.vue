<template>

    <ice-pop-selector
            :load-url="loadUrl"
            label-prop="deptShortName"
            value-prop="oid"
            :lazy="false"
            parent-prop="deptId"
            data-url="/permission/user/users_by_condition?cascade=true"
            textProp="name"
            :codeProp="valueProp"
            :selections="selections"
            :isPersonSelect=true
            ref="select"
            :height="500"
            :gridIndex="false"
            :query="query"
            :columns="columns"
            :isLoadParentData="true"
            @pagClick="pagClick"
            :close-on-click-modal="closeOnClickModal"
            :loadParentData="loadParentData"
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
    import {mapGetters, mapMutations} from 'vuex'


    export default {
        name: "IcePersionSelector",
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
            },
            closeOnClickModal: {
                // 是否可以通过点击 modal 关闭 Dialog
                type: Boolean,
                default: true,
            },
            userCode: String,//用于过滤传过来的用户code
            // 控制不能选择人员的编码
            noSelectCodes: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {

                innerValue: '',
                selections: [],

                query: [
                    {code: 'enabled', value: 1, exp: '=', type: 'static'},
                    {type: 'input', label: '姓名', code: 'name', value: '', exp: 'like'},
                    /* {type: 'input', label: '编码', code: 'code', value: '', exp: 'like'},*/
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'code', hidden: true},
                    {code: 'partTimeWorker', hidden: true},
                    {label: '姓名', code: 'name'},
                    {
                        label: '是否兼职', code: 'partTimeWorker', width: 90, formatter: (row) => {
                            if (row.partTimeWorker == '0') {
                                return '是'
                            }
                            return '否'
                        }
                    },
                    //{label: '编码', code: 'code', width: 230, hidden: true},

                    {label: '密级', code: 'securityLevel', mapTypeCode: 'OR_SECRET_LEVEL'},
                    {label: '单位', code: 'orgShortName'},
                    {label: '部门', code: 'deptShortName'},
                    {label: '工号', code: 'workCard'},
                    {label: '联系电话', code: 'landlineTel'},
                    {label: '兼职说明', code: 'task'},
                ],
                list: [],
            }
        },
        methods: {
            ...mapMutations('constant', ['addUndoTypeCodes']),
            ...mapGetters('constant', ['getConstants']),
            pagClick(data) {//查列表的接口由于后台将query里面的static过滤掉了，用此方法过滤传过来的用户,
                if (this.userCode) {
                    this.list = data && data.length > 0 ? data.filter(item => item.code !== this.userCode) : data;
                } else {
                    this.list = data;
                }

                if (this.isCanSelectPerson) {
                    this.list = this.list && this.list.length > 0 ? this.list.filter(c => {
                        return this.crewCodes.indexOf(c.code) == -1;
                    }) : this.list;
                }
                if (this.noselectPersonCodes) {
                    this.list = this.list && this.list.length > 0 ? this.list.filter(c => {
                        return this.noselectPersonCodes.indexOf(c.code) == -1;
                    }) : this.list;
                }

            },
            loadParentData() {
                return this.list
            },
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
                if (this.selectedPersion && this.selectedPersion.length > 0 && this.selectedPersion instanceof Array) {
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
            },
            // 判定是否能够进行人员选择过滤
            isCanSelectPerson() {
                let urlparam = this.$route.path.split("/")[1];
                return (urlparam == 'pms' || urlparam == 'qis') ? true : false;
            },
            noselectPersonCodes() {
                return this.noSelectCodes.map(c => {
                    return c.code;
                })
            },
            crewCodes() {
                let data = this.getConstants()('GL_RY_CODE');
                if (data) {
                    return data;
                } else {
                    return [];
                }
            }
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
            this.loadSectionsList();

            console.log(this.noSelectCodes, 'noSelectCodes')
        },
        mounted() {
            this.innerValue = this.value;
            this.addUndoTypeCodes({appCode: 'PMS', typeCode: 'GL_RY_CODE'})

        },
        components: {IcePopSelector}
    }

</script>


<style scoped>

</style>
