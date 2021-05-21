<template>
    <el-container>
        <el-aside width="250px" class="asidelayout">
            <!--<el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>-->
            <ice-tree load-url="/pms/QisBfhx/queryTree"
                      label-prop="name"
                      value-prop="oid"
                      ref="tree"
                      @node-click="rwmbClick"
                      style="height: 750px; width: 250px;">
            </ice-tree>
        </el-aside>
        <el-main>
            <ice-query-grid
                    data-url="/pms/QisBfhx/list"
                    :operations-width="200"
                    :columns="columns"
                    :buttons="buttons"
                    :query="query"
                    :operations="operations"
                    :beforeBindData="beforeBindData"
                    ref="grid">
            </ice-query-grid>
        </el-main>
        <ice-dialog :title="title" :visible.sync="visible" width="1200px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="意见登记" name="first">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                                    <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                        <el-button v-if="!sectDisabled" slot="append" icon="el-icon-search"
                                                   @click="showSectJh"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编辑部门" label-width="140px" prop="oidDepRel">
                                    <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                              placeholder="请选择"
                                    >
                                        <el-button v-if="!sectDisabled"  slot="append" icon="el-icon-search"
                                                   @click="showSectBm"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="不符合项来源" label-width="140px" prop="lycode">
                                    <!--<el-input v-model="formModel.lycode"></el-input>-->
                                    <ice-select v-model="formModel.lycode" map-type-code="LYCODE"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="受审部门" label-width="140px" prop="sshbm">
                                    <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                       v-model="formModel.sshbm"
                                                       @select-confirm="selectDept">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="陪同人员" prop="ptry" label-width="140px">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          :dept-code="formModel.sshbmcode"
                                                          v-model="formModel.ptry">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" prop="dataSecretLevcode" label-width="140px">
                                    <ice-select v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="不符合程度" prop="bfhcd" label-width="140px">
                                    <ice-select v-model="formModel.bfhcd" map-type-code="BFHCD"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="不符合对应的审核准则和条款号" prop="" label-width="140px">
                                    GJB9001A-2001<el-input v-model="formModel.gjb" maxlength="100" show-word-limit></el-input>
                                    <span>GB/T28001-2001<el-input v-model="formModel.gb" maxlength="100" show-word-limit></el-input></span>
                                    <span>手册条款号<el-input v-model="formModel.sctkh" maxlength="100" show-word-limit></el-input></span>
                                    <span>程序文件条款号<el-input v-model="formModel.cxwjtkh" maxlength="100" show-word-limit></el-input></span>
                                    <span>其他<el-input v-model="formModel.qttkh" maxlength="100" show-word-limit></el-input></span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="不符合事实描述" name="second">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="审核员" prop="shy" label-width="100px">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          v-model="formModel.shy"></ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="审核日期" prop="shyrq" label-width="100px">
                                    <el-date-picker v-model="formModel.shyrq" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="审核组长" prop="shzz" label-width="100px">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          v-model="formModel.shzz"></ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="审核日期" prop="shzzrq" label-width="100px">
                                    <el-date-picker v-model="formModel.shzzrq" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="受审核部门代表" prop="sshbmdb" label-width="100px">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          v-model="formModel.sshbmdb"></ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="受审日期" prop="sshbmdbrq" label-width="100px">
                                    <el-date-picker v-model="formModel.sshbmdbrq" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="不符合事实描述" prop="bfhssms" label-width="100px">
                                    <el-input type="textarea" v-model="formModel.bfhssms" maxlength="650" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="验证结果" name="third">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="不符合事实是否纠正" prop="isJz" label-width="240px">
                                    <el-select v-model="formModel.isJz">
                                        <el-option value="0" label="否"></el-option>
                                        <el-option value="1" label="是"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="不符合的原因分析是否正确" prop="isZq" label-width="240px">
                                    <el-select v-model="formModel.isZq">
                                        <el-option value="0" label="否"></el-option>
                                        <el-option value="1" label="是"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否针对原因制定纠正措施" prop="isZdcs" label-width="240px">
                                    <el-select v-model="formModel.isZdcs">
                                        <el-option value="0" label="否"></el-option>
                                        <el-option value="1" label="是"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="纠正措施是否完成" prop="isWcjzcs" label-width="240px">
                                    <el-select v-model="formModel.isWcjzcs">
                                        <el-option value="0" label="否"></el-option>
                                        <el-option value="1" label="是"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="其他" prop="qtyzjg" label-width="240px">
                                    <el-input type="textarea" v-model="formModel.qtyzjg" maxlength="330" show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="验证人员" prop="yzr" label-width="240px">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          v-model="formModel.yzr"></ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="验证日期" prop="yzrq" label-width="240px">
                                    <el-date-picker v-model="formModel.yzrq" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button type="info" @click="visible=false">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="纠正措施" :visible.sync="visibleJzcs" width="1000px">
            <el-form :model="formModelJzcs" :rules="rulesJzcs" ref="formJzcs" v-loading="loadingJzcs">
                <el-col :span="24">
                    <el-form-item label="不符合项事实摘要" label-width="140px" prop="bfhxsszy">
                        <el-input type="textarea" v-model="formModelJzcs.bfhxsszy"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="纠正情况" label-width="140px" prop="jzqk">
                        <el-input type="textarea" v-model="formModelJzcs.jzqk"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="原因分析" label-width="140px" prop="yyfx">
                        <el-input type="textarea" v-model="formModelJzcs.yyfx"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="纠正措施" label-width="140px" prop="jxcs">
                        <el-input type="textarea" v-model="formModelJzcs.jxcs"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="举一反三检查情况" label-width="140px" prop="jcqk">
                        <el-input type="textarea" v-model="formModelJzcs.jcqk"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="受审核方纠正措施有效性的验证" label-width="140px" prop="sshfyz">
                        <el-input type="textarea" v-model="formModelJzcs.sshfyz"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="验证人" label-width="140px" prop="yzr">
                        <ice-persion-selector mode="onlySelect" chooseItem="single"
                                              v-model="formModelJzcs.yzr"></ice-persion-selector>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="日期" label-width="140px" prop="yzrq">
                        <el-date-picker v-model="formModelJzcs.yzrq" type="date"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                        <ice-select v-model="formModelJzcs.dataSecretLevcode"
                                    :control-mj="[jjcs.dataSecretLevcode]"
                                    map-type-code="DATA_SECRET_LEVEL"
                                    filterable placeholder="请选择">
                        </ice-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirmJzcs">保存</el-button>
                <el-button type="info" @click="visibleJzcs=false">关闭</el-button>
            </div>
        </ice-dialog>
        <jh-common :jhType="jhType"  ref="jhcommon" :jhOid="formModel.oidZljh?formModel.oidZljh:''" @jhConfirm="jhConfirm" @bmConfirm="bmConfirm"></jh-common>
    </el-container>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector"
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceTree from "../../../components/common/base/IceTree";
    import mixins from '../components/mixins'
    import jhCommon from '../components/jhCommon'
    import {ZLJHZT} from '../../../utils/constant'


    export default {
        name: "bfhx",
        mixins: [mixins],
        data() {
            return {
                // 获取计划状态常量
                jhType: ZLJHZT.CXGJ,
                dataId:'',
                activeName: 'first',
                bghxLy: '',
                title: '',
                loading: 'false',
                loadingJzcs: 'false',
                visible: false,
                visibleJzcs: false,
                lycodeSelect: '',
                formModel: {
                    oid:'',
                    lycode: '',
                    oidLy: '',
                    sshbm: '',
                    sshbmcode: '',
                    ptry: '',
                    ptrycode: '',
                    dataSecretLevcode: '',
                    bfhcd: '',
                    gjb: '',
                    gb: '',
                    sctkh: '',
                    cxwjtkh: '',
                    qttkh: '',
                    bfhssms: '',
                    shy: '',
                    shyrq: '',
                    shzz: '',
                    shzzrq: '',
                    sshbmdb: '',
                    sshbmdbrq: '',
                    isJz: '',
                    isZq: '',
                    isZdcs: '',
                    isWcjzcs: '',
                    qtyzjg: '',
                    yzr: '',
                    yzrq: '',
                },
                formModelJzcs: {
                    oid:'',
                    oidBfhx: '',
                    bfhxsszy: '',
                    dataSecretLevcode: '2',
                    jzqk: '',
                    yyfx: '',
                    jxcs: '',
                    jcqk: '',
                    sshfyz: '',
                    yzr: '',
                    yzrq: '',
                },
                query: [
                    {type: 'input', code: 'bfhxcode', label: '编号', value: ""},
                    {type: 'input', code: 'sshbm', label: '受审核部门', value: ""},
                    {type: 'input', code: 'ptry', label: '陪同人员', value: ""},
                    {type: 'input', code: 'shy', label: '审核员', value: ""},
                    {type: 'input', code: 'shzz', label: '审核组长', value: ""},
                    {type: 'input', code: 'yzr', label: '验证人员', value: ""},
                    {type: 'input', code: 'sshbmdb', label: '受审核部门代表', value: ""},
                    {type: 'static', code: 'lycode', exp: '=', value: ''},
                    {type: 'static', code: 'createDate', exp: '>=', value: ''},
                    {type: 'static', code: 'createDate', exp: '<=', value: ''},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'lycode', hidden: true},
                    {code: 'bfhcd', hidden: true},
                    {code: 'gjb', hidden: true},
                    {code: 'gb', hidden: true},
                    {code: 'sctkh', hidden: true},
                    {code: 'cxwjtkh', hidden: true},
                    {code: 'qttkh', hidden: true},
                    {code: 'bfhssms', hidden: true},
                    {code: 'shyrq', hidden: true},
                    {code: 'shzzrq', hidden: true},
                    {code: 'sshbmdbrq', hidden: true},
                    {code: 'isJz', hidden: true},
                    {code: 'isZq', hidden: true},
                    {code: 'isZdcs', hidden: true},
                    {code: 'isWcjzcs', hidden: true},
                    {code: 'qtyzjg', hidden: true},
                    {code: 'yzrq', hidden: true},
                    {label: '编号', code: 'bfhxcode', width: 140, sortable: true},
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '受审核部门', code: 'sshbm', width: 200, sortable: true},
                    {label: '陪同人员', code: 'ptry', width: 100, sortable: true},
                    {label: '审核员', code: 'shy', width: 160, sortable: true},
                    {label: '审核组长', code: 'shzz', width: 180, sortable: true},
                    {label: '受审核部门代表', code: 'sshbmdb', width: 140, sortable: true},
                    {label: '验证人员', code: 'yzr', width: 140, sortable: true},
                    {label: '密级', code: 'dataSecretLevcode', width: 60, mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '质量计划', code: 'oidZljh', width: 100, hidden: true},
                    {label: '部门', code: 'oidDepRel', width: 100, hidden: true},
                    {label: '部门名字', code: 'depRelName', width: 100},
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        type: 'success',
                        callback: this.refreshGrid
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem, disabled: () => {
                            return this.isExist || (this.jhdata.isDetail ? true : false)
                        }},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BXZ"},
                    {name: '纠正措施', callback: this.jzcs, ctrlCode: "BXZ"},
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            return row.zljhCode ? false : true
                        }
                    },
                ],
                rules: {
                    lycode: [
                        {required: true, message: '请选择不符合项来源', trigger: 'change'}
                    ],
                    sshbm: [
                        {required: true, message: '请选择受审核部门', trigger: 'change'}
                    ],
                    ptry: [
                        {required: true, message: '请选择陪同人员', trigger: 'change'}
                    ],
                    bghcd: [
                        {required: true, message: '请选择不符合程度', trigger: 'change'}
                    ],
                    dataSecretLevcode: [{required: true, message: '请选择密级', trigger: 'change'}],
                },
                rulesJzcs: {
                    bfhxsszy: [
                        {required: true, whitespace: true, message: '请填写不符合项事实摘要', trigger: 'blur'}
                    ],
                    jzqk: [
                        {required: true, whitespace: true, message: '请填写纠正情况', trigger: 'blur'}
                    ],
                    yyfx: [
                        {required: true, whitespace: true, message: '请填写原因分析', trigger: 'blur'}
                    ],
                    jxcs: [
                        {required: true, whitespace: true, message: '请填写纠正措施', trigger: 'blur'}
                    ],
                    jcqk: [
                        {required: true, whitespace: true, message: '请填写举一反三检查情况', trigger: 'blur'}
                    ],
                    sshfyz: [
                        {required: true, whitespace: true, message: '请填写受审核方纠正措施有效性的验证', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [{required: true, message: '请选择密级', trigger: 'change'}],
                },
                jjcs: []

            }
        },
        methods: {
            // 刷新
            refreshGrid () {
                this.$refs.grid.refresh();
            },
            selectDept(depts) {
                this.formModel.sshbmcode = depts[0].deptCode
                this.formModel.oidSshbm = depts[0].oid
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/QisBfhx/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                            })
                    }
                })

            },
            confirmJzcs() {
                this.$refs.formJzcs.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/QisBfhxJzcs/saveOrUpdate", this.formModelJzcs)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visibleJzcs = false;
                                this.$refs.grid.refresh();
                                this.$refs.tree.refresh();


                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loadingJzcs = false
                            })
                    }
                })

            },
            addItem() {
                /*if(!this.formModel.oidLy){
                    return this.$message.error("请先选择内审管理或者顾客意见")
                }*/
                this.title = '新增不符合项与持续改进';
                this.visible = true;
                this.loading = false;
                this.$nextTick(_ => {
                    this.formModel.gjb = ""
                    this.formModel.gb = ""
                    this.formModel.sctkh = ""
                    this.formModel.cxwjtkh = ""
                    this.formModel.qttkh = ""
                    this.$refs.form.resetFields();
                    this.fuzhiData();
                    //this.formModel.lycode = this.bghxLy
                })
            },
            edit(row) {
                this.title = '编辑不符合项与持续改进';
                this.visible = true;
                this.loading = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                })
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisBfhx/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划信息失败！")
                    })
            },
            jzcs(data) {
                this.visibleJzcs = true;
                this.loadingJzcs = false;
                this.jjcs = data;
                this.$axios.get("/pms/QisBfhxJzcs/getOne", {params: {oidBfhx: data.oid}})
                    .then(result => {
                        if (result.data){
                            this.formModelJzcs = result.data
                        }else{
                            this.formModelJzcs = {};
                            this.formModelJzcs.oidBfhx = data.oid
                        }
                    })
            },

            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisBfhx/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除成功")
                        })
                }).catch(_ => {

                })
            },
            rwmbClick(data,node) {
                console.log(data, node, 'treeData')
                /*this.$nextTick(_=>{
                    this.formModel.oidLy = data
                    this.dataId = data
                    this.bghxLy = node.data.nsbgname
                })*/
                if (this.jhdata.oid) {
                    this.query.map(c=>{
                        if (c.code=='lycode') {
                            c.value = '';
                        }
                        if (c.code=='createDate') {
                            c.value = '';
                        }
                    })
                    this.$refs.grid.refresh();
                    return;
                }
                this.$nextTick(_=>{
                    if (node.isLeaf) {

                        this.query.map(c=>{
                            if (c.code=='createDate'&&c.exp=='>=') {
                                c.value = data+'-01-01 00:00:00';

                            }
                            if (c.code=='createDate'&&c.exp=='<=') {
                                c.value = data+'-12-31 23:59:59';

                            }
                            if (c.code=='lycode') {
                                c.value = node.parent.data.code;
                            }
                        })
                    } else {
                        this.query.map(c=>{
                            if (c.code=='lycode') {
                                c.value = data;
                            }
                            if (c.code=='createDate') {
                                c.value = '';
                            }
                        })

                    }
                    this.$refs.grid.refresh();
                })
            },
        },
        watch:{
            dataId () {
                this.$refs.grid.refresh();
            }
        },
        components: {IceTree, IceGridLayout, IceQueryGrid, IceDeptSelector, IcePersionSelector, IceDialog, IceSelect, jhCommon}
    }
</script>

<style scoped>

</style>
