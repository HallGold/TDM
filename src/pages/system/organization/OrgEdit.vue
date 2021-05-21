<template>
    <el-dialog
            custom-class="ice-dialog"
            title="编辑"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            @close="close"
            width="60%"
            left>
        <el-tabs type="border-card">
            <el-tab-pane label="基础属性">
                <el-form :model="formData" :rules="detailRules" label-position="right" class="conditon-bar"
                         ref="form" style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="机构类型" label-width="82px" required>
                                <el-select v-model="formData.typeCode" placeholder="请选择机构类型"
                                           @change="typeCodeChangeHandler">
                                    <el-option-group
                                            v-for="group in orgTypeList"
                                            :key="group.name"
                                            :label="group.name">
                                        <hr>
                                        <el-option
                                                v-for="item in group.list"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.code">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="上级部门" label-width="82px">
                                <el-input placeholder="上级部门" v-model="formData.parentName" disabled readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="部门层级" label-width="80px">
                                <el-input placeholder="部门层级" v-model="formData.deptLevel" disabled readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="名称" label-width="82px" prop="deptName">
                                <el-input placeholder="名称" v-model="formData.deptName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="编码" label-width="82px" prop="inputDeptCode">
                                <el-input placeholder="编码" v-model="formData.inputDeptCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="排序" label-width="82px" prop="sequencing">
                                <el-input placeholder="排序" v-model="formData.sequencing" maxlength="7"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="法人机构" label-width="82px">
                                <el-radio-group v-model="formData.corporation">
                                    <el-radio v-for="item in objectValueToArray(YES_NO_ENUM.properties).reverse()"
                                              :label="item.code" :key="item.code">
                                        {{item.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="虚拟部门" label-width="82px">
                                <el-radio-group v-model="formData.viral">
                                    <el-radio v-for="item in objectValueToArray(YES_NO_ENUM.properties).reverse()"
                                              :label="item.code" :key="item.code">
                                        {{item.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="启用状态" label-width="82px" prop="enabled">
                                <el-radio-group v-model="formData.enabled">
                                    <el-radio v-for="item in objectValueToArray(ENABLED_ENUM.properties).reverse()"
                                              :label="item.code" :key="item.code">
                                        {{item.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="扩展属性">
                <el-form :model="extendFormData" :rules="detailRules" label-position="right" class="conditon-bar"
                         ref="extendForm" style="margin-top: 20px"></el-form>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="close">返回</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: "OrgEdit",
        mixins: [OrgComm],
        data() {
            return {
                dialogVisible: false,
                formData: {
                    deptName: ``,
                    oid: ``,
                    typeCode: ``,
                    parentName: ``,
                    inputDeptCode: '',
                    deptCode: ``,
                    deptLevel: 1,
                    sequencing: `0`,
                    corporation: 0,
                    viral: 0,
                    enabled: 1
                },
                extendFormData: {},
                orgTypeList: [],
                detailRules: {
                    typeCode: [{required: true, message: '请选择类型', trigger: 'blur'}],
                    deptName: [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    inputDeptCode: [
                        {required: true, whitespace: true, message: '请输入编码', trigger: 'blur'},
                        {min: 1, max: 16, message: `编码长度在1-16之间`, trigger: 'blur'},
                        {validator: isLetterAndNumber, trigger: 'blur'}
                    ],
                    sequencing: [{
                        required: false,
                        whitespace: true,
                        type: String,
                        pattern: /^[0-9]{0,7}$/,
                        message: '请输入数字',
                        min: 1,
                        max: 7
                    }]
                },
            }
        },
        methods: {
            calculateTypeCodeControl() {
                if (!!formData.oid) {
                    //新增不设置禁用
                } else {

                }
            },
            typeCodeChangeHandler(key) {
                if (!this.isOrgType(key)) {
                    //非机构级，强制将法人机构设置为否
                    this.formData.corporation = this.YES_NO_ENUM.NO;
                    //重新计算部门层级
                    if (!!this.formData.parent) {
                        this.formData.deptLevel = this.formData.parent.deptLevel + 1;
                    }
                } else {
                    //机构级，部门层级设置为1
                    this.formData.deptLevel = 1;
                }
            },
            isOrgType(key) {
                //判断value是否机构级
                let _list = null;
                for (let i in this.orgTypeList) {
                    let _cur = this.orgTypeList[i];
                    if (_cur.code == this.ORG_TYPE_ENUM.ORG) {
                        _list = _cur.list;
                        break;
                    }
                }
                //是否机构级
                let flag = false;
                if (!!_list) {//遍历机构级列表查找是否在其中
                    for (let i in _list) {
                        if (_list[i].code == key) {
                            flag = true;
                            break;
                        }
                    }
                }
                return flag;
            },
            open(row) {
                let _this = this;
                if (!!row) {
                    Object.assign(this.formData, row);
                    this.initControls(row, () => {
                        if (!!row.oid) {
                            //编辑
                            _this.loadData(row.deptCode).then(() => {
                                if (!!row.parent) {
                                    this.formData.parent = row.parent;
                                }
                            });
                        } else {
                            //新增
                            // Object.assign(_this.formData, row);
                        }
                        _this.dialogVisible = true;
                    });
                } else {
                    this.$message.error("页面参数为空!")
                }
            },
            close() {
                //释放内存
                this.formData = {
                    deptName: ``,
                    oid: ``,
                    typeCode: ``,
                    parentName: ``,
                    inputDeptCode: '',
                    deptCode: ``,
                    enabled: false,
                    deptLevel: 1,
                    sequencing: `0`,
                    corporation: 0,
                    viral: 0,
                    enabled: 1
                };
                this.extendFormData = {};
                this.orgTypeList = [];
                this.dialogVisible = false;
            },
            save() {
                let _this = this;
                //todo:临时代码
                this.formData.deptCode = this.formData.inputDeptCode;
                //避免嵌套parent解析
                let _parent = null;
                if (!!this.formData.parent) {
                    _parent = Object.assign({}, this.formData.parent);
                    this.formData.parent = {};
                }
                this.axios(this.ACTIONS_ENUM.ORG.SAVE_SINGLE, {
                    departmentInfoVo: this.formData,
                    departmentInfoExpandVo: this.extendFormData
                }, [res => {
                    if (!!_parent) {
                        Object.assign(_this.formData.parent, _parent);
                    }
                    this.$emit("beforeClose", Object.assign(_this.formData, res.data));
                }]);
            },
            initControls(record, handler) {
                Promise.all([this.loadOrgTypeList(record)]).then(res => {
                    if (typeof handler == "function") {
                        handler();
                    }
                });
            },
            loadOrgTypeList(record) {
                //根据数据区分加载
                let _this = this;
                return new Promise((resolve, reject) => {
                    let _URL = this.ACTIONS_ENUM.ORG_TYPE.LOAD_LIST;
                    let _param = null;
                    if (_this.isFirstLevelDept(_this.formData.parentCode)) {
                        //第一级单位，只加载机构级类型
                        _param = {enabled: this.ENABLED_ENUM.ENABLED, orgType: this.ORG_TYPE_ENUM.ORG};
                    } else {
                        if (!!record.oid) {
                            //编辑
                            _param = {enabled: this.ENABLED_ENUM.ENABLED};
                        }
                    }
                    this.axios(_URL, _param, [res => {
                        _this.assembleOrgTypeList(res.data);
                        resolve(res);
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            assembleOrgTypeList(list) {
                //组装orgTypeList，用于下拉(拆分成机构级和部门级)
                let _orgList = {
                        name: this.ORG_TYPE_ENUM.properties[this.ORG_TYPE_ENUM.ORG].name,
                        code: this.ORG_TYPE_ENUM.ORG,
                        list: []
                    },
                    _deptList = {
                        name: this.ORG_TYPE_ENUM.properties[this.ORG_TYPE_ENUM.DEPT].name,
                        code: this.ORG_TYPE_ENUM.DEPT,
                        list: []
                    };
                for (let i in list) {
                    let _obj = list[i];
                    if (_obj.orgType == this.ORG_TYPE_ENUM.ORG) {
                        //机构级
                        _orgList.list.push(_obj);
                    } else {
                        //部门级
                        if (this.formData.parentCode != this.ROOT_DEPT_CODE) {
                            _deptList.list.push(_obj);
                        }
                    }
                }
                if (!!this.formData.oid) {
                    //附加判断，编辑情况只需在同类型切换
                    if (this.isOrgType(this.formData.orgType)) {
                        _orgList.list = [];
                    } else {
                        _deptList.list = [];
                    }
                }
                if (_orgList.list.length > 0) {
                    this.orgTypeList.push(_orgList);
                }
                if (_deptList.list.length > 0) {
                    this.orgTypeList.push(_deptList);
                }
                if (this.orgTypeList.length == 0) {
                    this.$message.error("请先维护机构类型!")
                }
            },
            loadData(deptCode) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.ORG.LOAD_SINGLE, {deptCode: deptCode}, [res => {
                        Object.assign(_this.formData, res.data.departmentInfoVo);
                        Object.assign(_this.extendFormData, res.data.departmentInfoExpandVo);
                        resolve();
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            }
        },
    }
</script>

<style scoped>

</style>