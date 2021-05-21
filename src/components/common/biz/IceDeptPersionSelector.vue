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
            ref="select"
            :height="600"
            :gridIndex="false"
            :query="query"
            :columns="columns"
            v-bind="$attrs"
            v-model="innerValue"
            @dialog-change="$nextTick(()=>{loadSelectionDepts()})"
            :show-tree-checkbox="true"
            dialog-width="1400px"
            title="请选择部门或者人员"
            select-list-width="400px"
            :button-disabled="deptSelections.length<=0"
            @node-check="nodeCheck"
            @select-confirm="selectConfirm">
        <div slot="selectedList" slot-scope="scope" style="height: 100%">
            <div style="display: flex;height: 100%">
                <div style="border-right: 2px solid #f6f6f6;width: 199px;display: flex;flex-direction: column">
                    <div class="title">已选部门列表</div>
                    <div style="flex-grow: 1;position: relative">
                        <div class="ice-full-absolute">
                            <vue-scroll :ops="{bar:{background:'#333',opacity:0.2}}">
                                <div class="tags-wrapper">
                                    <div v-for="tag in deptSelections" :key="tag.deptCode" style="margin: 4px">
                                        <el-tag style="background: #fffeee;" closable @close="closeDeptTag(tag)">
                                        <span class="text">
                                              <!--  {{tag['deptShortName']==tag['orgShortName']?tag['orgShortName']:(tag['orgShortName']+'-'+tag['deptShortName'])}}-->
                                            {{tag['deptShortName']}}
                                        </span>
                                        </el-tag>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                    </div>

                </div>
                <div style="width: 199px;display: flex;flex-direction: column">
                    <div class="title">已选人员列表</div>
                    <div style="flex-grow: 1;position: relative">
                        <div class="ice-full-absolute">
                            <vue-scroll :ops="{bar:{background:'#333',opacity:0.2}}">
                                <div class="tags-wrapper">
                                    <div v-for="tag in scope.selectedItems" :key="tag.value" style="margin: 4px">
                                        <el-tag closable @close="$refs.select.closeTag(tag[valueProp])"
                                                style="background: #fffeee;">
                                        <span class="text"
                                              :title="tag['name']+' ('+tag['deptShortName']==tag['orgShortName']?tag['orgShortName']:(tag['orgShortName']+'-'+tag['deptShortName'])+')'">
                                                {{tag['name']}} ({{tag['deptShortName']==tag['orgShortName']?tag['orgShortName']:(tag['orgShortName']+'-'+tag['deptShortName'])}})
                                        </span>
                                        </el-tag>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../base/IcePopSelector";
    import VueScroll from 'vuescroll'

    export default {
        name: "IceDeptPersionSelector",
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
            },
            selectedDept: {
                type: Array,
                default: () => []
            },
            loadDeptCode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                deptSelections: [],
                innerValue: '',
                selections: [],
                query: [
                    {type: 'static', code: 'enabled', value: '1', exp: '='},
                    {type: 'input', label: '姓名', code: 'name', value: '', exp: 'like'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '姓名', code: 'name', width: 250},
                    {label: '编码', code: 'code', width: 250, hidden: true},
                    {label: '联系电话', code: 'phone', width: 120},
                    {label: '部门', code: 'deptShortName', width: 120},
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
                if(this.selectedDept.length === 0){
                    if(this.selectedDept.length === 0){
                        this.$nextTick(() => {
                            this.$refs.select.resetChecked();
                        })
                    }
                }

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
                            }
                        })

                } else {
                    this.selections = [];
                }
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
                    //debugger
                    this.$axios.get("/permission/frame_org/get_dept_list", {params: {deptCodes: codes}})
                        .then(result => {
                            if (result.data) {
                                /*let deptSelections = result.data.map(item => {
                                    return {
                                        code: item.code, name: `${item.name(item.deptShortName)}`
                                    }
                                })*/
                                this.deptSelections = result.data;
                                this.$nextTick(() => {
                                    this.$refs.select.setCheckedKeys(this.deptSelections.map(item => item.oid));
                                })

                            }
                        })

                } else {
                    this.deptSelections = [];

                }

            },
            nodeCheck(changeNode, nodeStatus) {
                //debugger
                let checkedNodes = this.$refs.select.getCheckedNodes();
                console.log(checkedNodes)
                let flagDeptCode = "-1";
                let selected = [];
                checkedNodes.forEach(item => {
                    let deptLevCode = item.deptLevCode;
                    if (!deptLevCode.startsWith(flagDeptCode)) {
                        flagDeptCode = deptLevCode;
                        selected.push(item)
                    }
                })
                this.deptSelections = selected;
            },
            selectConfirm(items, texts, values, extendProp) {
                /*getCheckedNodes;*/
                this.$emit('select-confirm', this.deptSelections, items, extendProp)
            },
            closeDeptTag(dept) {
                this.$refs.select.setChecked(dept, false, true);
                this.$nextTick(() => {
                    this.nodeCheck()
                })
            }
        },
        computed: {
            loadUrl() {
                if (this.loadDeptCode) {
                    return `/permission/frame_org/load_table_tree?loadDisabled=false&deptCode=${this.loadDeptCode}`;
                }
                return `/permission/frame_org/load_table_tree?loadDisabled=false`;
            }
        },
        watch: {
            value() {
                this.innerValue = this.value;

            },
            innerValue() {
                this.$emit("IcePersionSelectorchange", this.innerValue);
                if (this.innerValue) {
                    this.$nextTick(() => {
                        this.loadSelectionDepts();
                    })
                }
            },
            selectedPersion() {
                this.loadSectionsList()
            },
            selectedDept() {
                this.loadSelectionDepts()
            }
        },
        created() {
            this.loadSectionsList();

        },
        mounted() {
            this.innerValue = this.value;


        },
        components: {IcePopSelector, VueScroll}
    }

</script>


<style scoped>
    .title {
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 5px;
        box-sizing: border-box;
        border-bottom: 1px solid #f6f6f6;
    }
</style>
