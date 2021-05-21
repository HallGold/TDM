<template>
    <div class="content-filled">
        <ice-tree-grid load-url="/permission/frame_org/load_table_tree?loadDisabled=true"
                       label-prop="deptName"
                       value-prop="deptCode"
                       :lazy="false"
                       parent-prop="deptCode"
                       data-url="/permission/frame_org/load_table_next_children?loadDisabled=true"
                       :pagination="false"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       ref="treeGrid"
                       @node-click="dataTree"
                       :operations-width="140">
        </ice-tree-grid>
        <ice-dialog v-dialogDrag :title="title" center :visible.sync="detailDialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <div class="grid-container">
                <el-form :model="detailDataForm" :rules="detailRules" label-position="right" class="conditon-bar"
                         ref="detailForm">
                    <ice-grid-layout name="部门信息" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="部门名称:" label-width="130px" prop="deptName">
                                <el-input placeholder="部门名称" v-model="detailDataForm.deptName"
                                          maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门负责岗位编码:" label-width="130px" prop="deptDutyCode">
                                <el-input placeholder="部门负责岗位编码"
                                          @keyup.native="codeItem"
                                          v-model="detailDataForm.deptDutyCode"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="部门简称:" label-width="130px" prop="deptShortName">
                                <el-input placeholder="只能输入最多8个字" v-model="detailDataForm.deptShortName"
                                          maxlength="8"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="OU:" label-width="130px" prop="ou">
                                <el-input placeholder="请输入最多8位英文字母" v-model="detailDataForm.ou"
                                          maxlength="8"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="机构类型:" label-width="130px" prop="typeCode">
                                <el-select placeholder="机构类型" v-model="detailDataForm.typeCode"
                                           @change="changeCorporation">
                                    <el-option v-for="item in optionType"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否虚拟机构:" label-width="130px" prop="viral">
                                <el-select placeholder="是否虚拟机构" v-model="detailDataForm.viral">
                                    <el-option label="是" key="1" value="1"></el-option>
                                    <el-option label="否" key="0" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="是否法人机构:" label-width="130px" prop="corporation">
                                <el-select placeholder="是否法人机构" v-model="detailDataForm.corporation"
                                           :disabled="editList">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="录入的部门编码:" label-width="130px" prop="inputDeptCode">
                                <el-input placeholder="只能输入3位"
                                          v-model="detailDataForm.inputDeptCode"
                                          @keyup.native="codeItem"
                                          :disabled="editList"
                                          maxlength="3">
                                    <template slot="prepend">{{detailDataForm.parentCode}}</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="启用状态:" label-width="130px" prop="enabled">
                                <el-select placeholder="启用状态" v-model="detailDataForm.enabled">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序:" label-width="130px" prop="sequencing">
                                <el-input placeholder="只能输入1至7位数字哦"
                                          v-model="detailDataForm.sequencing"
                                          maxlength="7"
                                          @keyup.native="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </ice-grid-layout>
                </el-form>

            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button @click="extendList" size="medium" icon="el-icon-edit">部门扩展信息</el-button>
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                <el-button type="info" size="medium" @click="closeDetailDialog">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="departmentDialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false" :before-close="closeItemA">
            <div class="grid-container">
                <el-form :model="departmentdetailDataForm" label-position="right" class="conditon-bar"
                         ref="detailFormA">
                    <ice-grid-layout name="部门扩展信息" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="国家:" label-width="130px" prop=".country">
                                <el-input placeholder="国家" v-model="departmentdetailDataForm.country"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="国家编码:" label-width="130px" prop="countryCode">
                                <el-input placeholder="国家编码"
                                          @keyup.native="codeItem"
                                          v-model="departmentdetailDataForm.countryCode"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="部门:" label-width="130px" prop="deptName">
                                <el-input placeholder="部门" v-model="detailDataForm.deptName" :disabled="true"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="详细地址:" label-width="130px" prop="detailedAddress">
                                <el-input placeholder="详细地址" v-model="departmentdetailDataForm.detailedAddress"
                                          maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="电子邮件:" label-width="130px" prop="email">
                                <el-input placeholder="电子邮件" v-model="departmentdetailDataForm.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="传真:" label-width="130px" prop="fax">
                                <el-input placeholder="传真" v-model="departmentdetailDataForm.fax"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="一级行政区域名称:" label-width="130px" prop="level1Name">
                                <el-input placeholder="一级行政区域名称" v-model="departmentdetailDataForm.level1Name"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一级行政区域类型:" label-width="130px" prop="level1TypeCode">
                                <el-input placeholder="一级行政区域类型" v-model="departmentdetailDataForm.level1TypeCode"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="二级行政区域名称:" label-width="130px" prop="level2Name">
                                <el-input placeholder="二级行政区域名称" v-model="departmentdetailDataForm.level2Name"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="二级行政区域类型:" label-width="130px" prop="level2TypeCode">
                                <el-input placeholder="二级行政区域类型" v-model="departmentdetailDataForm.level2TypeCode"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="三级行政区域名称:" label-width="130px" prop="level3Name">
                                <el-input placeholder="三级行政区域名称" v-model="departmentdetailDataForm.level3Name"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="三级行政区域类型:" label-width="130px" prop="level3TypeCode">
                                <el-input placeholder="三级行政区域类型" v-model="departmentdetailDataForm.level3TypeCode"
                                          maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="联系电话:" label-width="130px" prop="tel">
                                <el-input placeholder="联系电话" v-model="departmentdetailDataForm.tel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="departmentsave">确定</el-button>
                <el-button type="info" size="medium" @click="departmentcloseDetailDialog">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "OrganizationList",
        data() {
            return {
                query: [
                    {type: 'static', code: "loadDisabled", exp: "=", value: true},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '部门名称', code: 'deptName', width: 250,align:'left'},
                    {label: '录入的部门编码', code: 'inputDeptCode', width: 130},
                    {label: '机构类型', code: 'typeName', width: 150},
                    {
                        label: '是否虚拟机构', code: 'viral', width: 120, renderCell(h, data) {
                            return (data.row.viral == 1 ? "是" : (data.row.viral == 0 ? "否" : ""))
                        }
                    },
                    {
                        label: '是否法人机构', code: 'corporation', width: 120, renderCell(h, data) {
                            return (data.row.corporation == 1 ? "是" : (data.row.corporation == 0 ? "否" : ""))
                        }
                    },
                    /*{label: '单位OU', code: 'ou', width: 120},*/
                    {label: '部门编码', code: 'deptCode', hidden: true},
                    {label: '所属单位编码', code: 'orgCode', hidden: true},
                    {
                        label: '启用状态', code: 'enabled', width: 90, renderCell(h, data) {
                            return (data.row.enabled == 1 ? "是" : (data.row.enabled == 0 ? "否" : ""))
                        }
                    },
                ],
                operations: [
                    {name: '编辑', callback: this.modifyDetail},
                    {name: '删除', callback: this.deleteItem},
                    /*{name: '新增', callback: this.addItem},*/
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
                detailDialogVisible: false,
                departmentDialogVisible: false,

                detailDataForm: {
                    parentCode: '',
                    deptCode: '',
                    deptLevCode: '',
                    oid: ''
                },            /*机构基础信息对象*/
                departmentdetailDataForm: {},  /*扩展应用对象*/
                detailRules: {
                    deptCode: [{
                        required: true,
                        whitespace: true,
                        message: '请输入部门编码',
                        trigger: 'blur',
                        repeatable: false
                    }],
                    deptName: [{required: true, whitespace: true, message: '请输入部门名称', trigger: 'blur'}],
                    inputDeptCode: [{required: true, whitespace: true, message: '请输入录入的部门编码', trigger: 'blur'}],
                    corporation: [{required: true, whitespace: true, message: '请输入是否为法人机构', trigger: 'blur'}],
                    typeCode: [{required: true, whitespace: true, message: '请输入组织机构类型', trigger: 'blur'}],
                    ou:[{pattern:/^[a-z,A-Z]{1,8}$/,whitespace: true, message: '请输入英文字母', trigger: 'blur'}]
                },
                title: '',
                r: '',          /*用于表示左边树节点点击后获取到的数据，此数据用来做右边展示的父节点*/
                optionType: [],
                editList: false,
                dataDeptLevcode: '',                     /*录入的部门编码前缀显示*/
                typeCodeItem: '',                         /*根据当前节点来判断它是第几级*/
                corporationItem: [],                     /*根据所选机构类型来动态判定是否为法人机构*/
            }
        },
        methods: {
            closeItem() {
                this.$refs.detailForm.clearValidate();
                this.detailDialogVisible = false;
            },
            closeItemA() {
                this.$refs.detailFormA.clearValidate();
                this.departmentDialogVisible = false;
            },
            changeCorporation() {
                this.corporationItem.forEach(item => {
                    if (this.detailDataForm.typeCode == item.name) {
                        this.detailDataForm.corporation = item.value + '';
                    }
                })
            },
            /**效验排序只能输入数字*/
            number() {
                this.detailDataForm.sequencing = this.detailDataForm.sequencing.replace(/[^\.\d]/g, '');
                this.detailDataForm.sequencing = this.detailDataForm.sequencing.replace('.', '');
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem() {
                if (this.departmentdetailDataForm.countryCode) {
                    this.departmentdetailDataForm.countryCode = this.departmentdetailDataForm.countryCode.replace(/[^\w||_]+$/, '');
                }
                if (this.detailDataForm.inputDeptCode) {
                    this.detailDataForm.inputDeptCode = this.detailDataForm.inputDeptCode.replace(/[^\w||_]+$/, '');
                }
                if (this.detailDataForm.deptDutyCode) {
                    this.detailDataForm.deptDutyCode = this.detailDataForm.deptDutyCode.replace(/[^\w||_]+$/, '');
                }
            },
            /**获取左边树的点击事件的值*/
            dataTree(row, data) {
                this.dataDeptLevcode = data.data.dataDeptLevcode;
                this.typeCodeItem = data.data.typeCode;
                this.deptId = data.data.oid;
                this.deptLevCode = data.data.deptLevCode;
                this.deptCode = data.data.deptCode;
                // this.r = row;
            },
            /**机构类型的选择----动态加载机构类型维护里的类型*/
            init() {
                this.$axios.get("/permission/department_type/select_list").then(success => {
                    for (let i = 0; i < success.data.length; i++) {
                        let obj = {};
                        let obj1 = {};
                        obj.label = success.data[i].name;
                        obj.value = success.data[i].code;
                        obj1.name = success.data[i].code;
                        obj1.value = success.data[i].orgType;
                        this.optionType.push(obj);
                        this.corporationItem.push(obj1);
                    }
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                });
            },
            /**新增机构*/
            addItem() {
                if (this.deptCode) {
                    this.detailDataForm.parentCode = this.deptCode;
                    this.detailDataForm.parentId = this.deptId;
                    this.title = '新增组织机构';
                    let obj = 0;
                    this.optionType.forEach((item, index) => {
                        if (item.value == this.typeCodeItem) {
                            if (index != this.optionType.length - 1) {
                                obj = index + 1;
                            } else {
                                obj = index;
                            }
                        }
                    });
                    let obj1 = this.optionType[obj].value;
                    let obj2 = '';
                    this.corporationItem.forEach(item => {
                        if (obj1 == item.name) {
                            obj2 = item.value + '';
                        }
                    });
                    this.detailDataForm = {
                        viral: "0",
                        enabled: '1',
                        corporation: obj2,
                        typeCode: this.optionType[obj].value
                    };
                    this.departmentdetailDataForm = {};
                    this.detailDialogVisible = true;
                    this.detailDataForm.parentCode = this.deptCode;
                    this.detailDataForm.parentId = this.deptId;
                    this.editList = false;
                } else {
                    this.$confirm('请选择要添加的层级', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.closeDialog();
                    })
                }
            },
            closeDialog() {
                this.$refs.detailForm.clearValidate();
                this.detailDialogVisible = false;
            },
            /**新增机构下的保存操作*/
            save() {
                let obj = false;
                /*  this.$refs.detailFormA.validate((valid)=>{
                      if(valid){
                          obj = true;
                      }else{
                          obj = false;
                          return false;
                      }
                  });*/
                this.$refs.detailForm.validate((valid) => {
                    if (!valid && !obj) {
                        // console.log('error submit!!');
                        return false;
                    }
                    if (this.editList) {
                        //  debugger
                        //  alert(JSON.stringify(this.detailDataForm))
                        // this.detailDataForm.enabled = (this.detailDataForm.enabled == "是" ? 1 : (this.detailDataForm.enabled == "否" ? 0 : this.detailDataForm.enabled));
                        // this.detailDataForm.corporation = (this.detailDataForm.corporation == "是" ? 1 : (this.detailDataForm.corporation == "否" ? 0 : this.detailDataForm.corporation));
                        // this.detailDataForm.viral = (this.detailDataForm.viral == "是" ? 1 : (this.detailDataForm.viral == "否" ? 0 : this.detailDataForm.viral));
                    }
                    this.$axios.post("/permission/frame_org/save", {
                        "departmentInfoVo": this.detailDataForm,
                        "departmentInfoExpandVo": this.departmentdetailDataForm
                    })
                        .then(success => {
                            this.$message.success("保存成功");
                            // console.log('success.data : %o', success.data)
                            if (!this.editList) {
                                this.$refs.treeGrid.addNode(success.data);
                            } else {
                                this.$refs.treeGrid.updateNode(success.data);
                            }
                            this.closeDialog();
                            this.$refs.treeGrid.$refs.queryGrid.refresh();
                        }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '操作出错了'
                        })
                    });
                });

            },
            closeDetailDialog() {
                this.detailDialogVisible = false;
            },
            /**右边列表操作下的维护按钮*/
            modifyDetail(row) {
                this.$axios.get("/permission/frame_org/get_by_code", {"params": {"deptCode": row.deptCode}})
                    .then(success => {
                        this.$nextTick(() => {
                            this.title = '组织机构维护';
                            this.editList = true;
                            this.detailDialogVisible = true;
                            this.detailDataForm = success.data.departmentInfoVo;
                            this.detailDataForm.enabled = this.detailDataForm.enabled == 1 ? "1" : "0";
                            this.detailDataForm.corporation = this.detailDataForm.corporation == 1 ? "1" : "0";
                            this.detailDataForm.viral = this.detailDataForm.viral == 1 ? "1" : "0"
                            if (success.data.departmentInfoExpandVo) {
                                this.departmentdetailDataForm = success.data.departmentInfoExpandVo;
                            } else {
                                this.departmentdetailDataForm = {}
                            }

                        });

                    }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                });
            },
            /**右边列表操作下的删除按钮*/
            deleteItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/frame_org/delete", {"params": {"deptCode": row.deptCode}}).then(success => {
                        this.$message.success("删除成功");

                        this.$nextTick(() => {
                            this.$refs.treeGrid.rmoveNode(row.deptCode);
                            this.$refs.treeGrid.$refs.queryGrid.refresh();
                        })

                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '操作出错了'
                        })
                    });
                });
            },
            /**扩展应用弹窗的触发按钮*/
            extendList() {
                this.departmentDialogVisible = true;
            },
            /**扩展应用下的保存*/
            departmentsave() {
                this.$refs.detailFormA.clearValidate();
                this.departmentDialogVisible = false;
            },
            /**扩展应用下的取消*/
            departmentcloseDetailDialog() {
                this.$refs.detailFormA.clearValidate();
                this.departmentDialogVisible = false;
            }

        },
        computed: {},
        watch: {},
        mounted() {
            this.init();
        },
        components: {IceGridLayout, IceTreeGrid}
    }

</script>


<style scoped>

</style>
