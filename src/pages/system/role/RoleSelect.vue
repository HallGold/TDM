<template>
    <el-container>
        <el-main>
            <span v-for="(item,index) in query"
                  :key="item.code">
                    <el-input v-if="item.type=='input'" v-model="item.model" style="width:200px"
                              :placeholder="item.placeholder"/>
                    <el-select v-if="item.type=='select'" v-model="item.model" :placeholder="item.placeholder">
                        <el-option v-for="(option,index) in item.list"
                                   :key="typeof option.value == `function`?option.value():option.value"
                                   :label="typeof option.label == `function`?option.label():option.label"
                                   :value="typeof option.value == `function`?option.value():option.value"></el-option>
                    </el-select>
            </span>
            <el-table
                    height="440px"
                    max-height="440px"
                    :highlight-current-row="true"
                    @row-click="handlerRowClick"
                    @select="handleRowSelection"
                    @select-all="handlerSelectionAll"
                    ref="iceGrid"
                    :data="gridData.filter(data => {
                                for(let q in query){
                                    let obj = query[q];
                                    let value = data[obj.code];//字段值
                                    let q_value = obj.model;
                                    if(!q_value && typeof q_value == `string`){
                                        continue;
                                    }
                                    if(typeof value == `string`){
                                        if(value.toLowerCase().includes(q_value.toLowerCase())){
                                        }else{
                                            return false;
                                        }
                                    }else if(typeof value == `number`){
                                        if(value == q_value){

                                        }else{
                                            return false;
                                        }
                                    }
                                }
                                return true;
                            })">
                <el-table-column v-if="multiple"
                                 type="selection"
                                 width="50">
                </el-table-column>
                <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="角色名"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="desp"
                        label="描述"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注"
                        width="180">
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";

    export default {
        mixins: [OrgComm],
        components: {},
        name: "RoleSelect",
        props: {
            multiple: {
                //多选
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                gridData: [],
                query: [{type: 'input', label: '角色', code: 'name', model: ``, placeholder: `输入角色名称搜索`},],
                multipleSelection: [],
            };
        },
        methods: {
            handlerRowClick(row, column, event) {
                if (!this.multiple) {
                    //单选时处理
                    this.multipleSelection = row;
                }
            },
            handleRowSelection(selection, row) {
                this.multipleSelection = selection;
            },
            handlerSelectionAll(selection) {
                this.handleRowSelection(selection);
            },
            loadData() {
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.ROLE.LOAD_ORG_ENABLED_ROLES, {}, [res => {
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }])
                });
            },
            getResult() {
                let _value = Object.assign({}, this.multipleSelection);
                this.destroy();
                return _value;
            },
            destroy() {
                this.gridData = [];
                this.multipleSelection = [];
            },
            initControls() {
                this.loadData().then(res => {
                    this.gridData = res.data;
                });
            },
        },
        mounted() {
            this.initControls();
        }
    }
</script>
