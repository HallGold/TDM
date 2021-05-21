<template>
    <el-container>
        <el-container>
            <el-aside>
                <org-tree :loadDisabledDept="false" :nodeClick="treeClickHandler"
                          :after-init="treeInitCallback"></org-tree>
            </el-aside>
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
                <div class="user-table-div">
                    <el-table ref="userTable"
                              height="440px"
                              :highlight-current-row="true"
                              max-height="440px"
                              @row-click="handlerUserClick"
                              @select="handleSelection"
                              @select-all="handlerSelectionAll"
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
                                label="姓名"
                                width="150">
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
        <el-footer style="text-align: center;padding-top: 3px;">
            <slot name="footer">
                <el-button type="primary" @click="enter">确定</el-button>
                <el-button type="info" @click="close">返回</el-button>
            </slot>
        </el-footer>
    </el-container>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import OrgTree from "@/pages/system/organization/OrgTree"
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";

    export default {
        name: "UserSelect",
        mixins: [OrgComm],
        components: {OrgTree, IceQueryGrid},
        props: {
            multiple: {
                //多选
                type: Boolean,
                default: false
            },
            users: {
                //回选的用户
                type: Array,
                default: null,
            }
        },
        data() {
            return {
                curNode: null,
                gridData: [],
                columns: [],
                multipleSelection: [],
                totalSelection: {},
                query: [
                    {type: 'input', label: '姓名', code: 'name', model: ``, placeholder: `输入姓名搜索`},
                ],
            };
        }, methods: {
            handlerUserClick(row, column, event) {
                if (!this.multiple) {
                    //单选时处理
                    this.multipleSelection = row;
                }
            },
            handleSelection(selection, row) {
                this.multipleSelection = selection;
            },
            initSelection() {
                this.totalSelection = {};
                //将users数组转成部门 + 用户代码的二维数组
                if (!!this.users) {
                    if (Array.isArray(this.users)) {
                        for (let i in this.users) {
                            let _user = this.users[i];
                            if ((!!_user.code || !!_user.userCode) && !!_user.deptCode) {
                                //容错处理
                                let _userCode = null;
                                if (!!_user.code) {
                                    _userCode = _user.code;
                                    _user.userCode = _userCode;
                                } else {
                                    _userCode = _user.userCode;
                                    _user.code = _userCode;
                                }
                                if (!this.totalSelection[_user.deptCode]) {
                                    this.totalSelection[_user.deptCode] = [];
                                }
                                this.totalSelection[_user.deptCode][_userCode] = _user;
                                this.totalSelection[_user.deptCode].length++;
                            }
                        }
                    }
                }
            },
            treeInitCallback(node) {
                //树加载完成后的回调处理
                if (!!node) {
                    this.curNode = node;
                    this.loadUsers(node.deptCode).then(res => {
                        this.assembleTableData(res);
                    });
                }
            },
            assembleTotalSelection(deptCode) {
                //根据deptCode设置
                if (!!deptCode) {
                    this.totalSelection[deptCode] = [];
                    this.totalSelection[deptCode].length = this.multipleSelection.length;
                    for (let i in this.multipleSelection) {
                        let _user = this.multipleSelection[i];
                        let _userCode = _user.code;
                        this.totalSelection[deptCode][_userCode] = _user;
                    }
                }
                return this.totalSelection;
            },
            handlerSelectionAll(selection) {
                this.handleSelection(selection);
            },
            treeClickHandler(node) {
                if (node != this.curNode) {
                    //逻辑有bug，要重写
                    this.assembleTotalSelection(this.curNode.deptCode);
                    //将当前选中的放入totalSelection
                    let deptCode = node.deptCode;
                    this.curNode = node;
                    let _this = this;
                    this.loadUsers(deptCode).then(res => {
                        _this.assembleTableData(res);
                    });
                }
            },
            assembleTableData(_data) {
                this.multipleSelection = [];
                let userTable = this.$refs.userTable;
                this.gridData = _data.data.records;
                userTable.total = this.gridData.length;
                //设置选中
                if (userTable.total > 0) {
                    let _list = this.totalSelection[this.gridData[0].deptCode];
                    if (!!_list && _list.length > 0) {
                        for (let i in this.gridData) {
                            let _user = this.gridData[i];
                            if (_list[_user.code]) {
                                this.$nextTick(() => {
                                    userTable.toggleRowSelection(_user, true);
                                    this.multipleSelection.push(_user);
                                    this.totalSelection[this.gridData[0].deptCode][_user.code] = _user;
                                });
                            }
                        }
                    }
                }
            },
            loadUsers(deptCode) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.loading = true;
                    _this.axios(_this.ACTIONS_ENUM.USER.LOAD_CONDITION_LIST, {
                        current: 1,
                        deptCode: deptCode,
                        size: 9999
                    }, [res => {
                        _this.loading = false;
                        //设置回选
                        resolve(res);
                    }, res => {
                        this.loading = false;
                        reject(res);
                    }, res => {
                        this.loading = false;
                        reject(res);
                    }], false);
                });
            },
            getResult() {
                let _value = null;
                if (this.multiple) {
                    //多选处理
                    _value = Object.assign({}, this.assembleTotalSelection(this.curNode.deptCode));
                } else {
                    //单选处理
                    _value = Object.assign({}, this.multipleSelection);
                }
                this.destroy();
                return _value;
            },
            destroy() {
                this.totalSelection = {};
                this.curNode = null;
                this.columns = [];
                this.gridData = [];
                this.multipleSelection = [];
            },
            initControls() {
                this.curNode = null;
                this.gridData = [];
                this.columns = [];
                this.multipleSelection = [];
                this.totalSelection = {};
                this.initSelection();
            },
            enter() {

            },
            close() {

            },
        },
        mounted() {
            this.initControls();
        }
    }
</script>
