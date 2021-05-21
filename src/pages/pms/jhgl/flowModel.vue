<template>
    <div class="form-content" @valited="">
        <ice-flow-form v-bind="$attrs" :SJID="SJID" name valiate ref="flow" :flowReady="flowReady"
                       :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData"
                       @callBackSuccess="callBackSuccess">
            <div slot-scope="flowScope" style="padding-bottom: 20px;">
                <el-main style="padding: 0px;background: #fff;">
                    <div class="step" style="margin-top: 10px;">
                        <el-steps :active="active" align-center finish-status="success" space="100%">
                            <el-step title="计划信息"></el-step>
                            <el-step title="选择任务"></el-step>
                        </el-steps>
                    </div>
                    <div class="elform">
                        <el-form v-show="showForm" :model="formModel" :rules="rules" ref="form" style="margin: 0 20px">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="计划名称" label-width="140px" prop="jhname">
                                        <el-input v-model="formModel.jhname"
                                                  :disabled="flowScope.formReadonly" maxlength="60"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="计划编码" label-width="140px" prop="jhcode">
                                        <el-input v-model="formModel.jhcode" readonly placeholder="自动生成"
                                                  disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="计划部门" label-width="140px" prop="deptName">
                                        <ice-dept-selector chooseItem="single"
                                                           :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                           v-model="formModel.deptName"
                                                           @select-confirm="selectDept">
                                        </ice-dept-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="负责人" label-width="140px" prop="jhfzr">
                                        <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                              chooseItem="single"
                                                              :dept-code="formModel.deptCode" v-model="formModel.jhfzr">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="计划类型" label-width="140px" prop="jhlx" map>
                                        <ice-select @changevalue="getCode" :disabled="flowScope.formReadonly"
                                                    v-model="formModel.jhlx"
                                                    map-type-code="JHLX10">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="年份" label-width="140px" prop="jhyear">
                                        <el-date-picker :disabled="flowScope.formReadonly" v-model="formModel.jhyear"
                                                        @change="handleYear"
                                                        type="year"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="计划开始日期" label-width="140px" prop="jhdateStart">
                                        <el-date-picker
                                                :disabled="flowScope.formReadonly"
                                                v-model="formModel.jhdateStart"
                                                :picker-options="pickerOptions(1)"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="计划结束日期" label-width="140px" prop="jhdateEnd">
                                        <el-date-picker
                                                :disabled="flowScope.formReadonly"
                                                v-model="formModel.jhdateEnd"
                                                :picker-options="pickerOptions(2)"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select :controlMjPar="maxChildMj" :disabled="flowScope.formReadonly"
                                                    v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="紧急程度" label-width="140px" prop="jjcd">
                                        <ice-select :disabled="flowScope.formReadonly" v-model="formModel.jjcd"
                                                    map-type-code="JJCD">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="计划目标" label-width="140px" prop="jhmb">
                                        <el-input :disabled="flowScope.formReadonly" type="textarea" height="200px"
                                                  placeholder="不超过650个字" maxlength="650"
                                                  show-word-limit v-model="formModel.jhmb"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" v-if="isChange||formModel.bgsm">
                                <el-col :span="24">
                                    <el-form-item label="变更说明" label-width="140px" prop="bgsm">
                                        <el-input :disabled="flowScope.formReadonly" type="textarea" height="200px"
                                                  placeholder="不超过330个字" maxlength="330"
                                                  show-word-limit v-model="formModel.bgsm"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                        </el-form>
                        <div>
                            <el-row v-show="show">
                                <el-col :span="5">
                                    <el-card class="box-card" style="overflow: auto;">
                                        <div slot="header">
                                            <div v-if="!flowScope.formReadonly">
                                                <el-input v-model="input" placeholder="过滤关键字"
                                                          type="text">
                                                    <template slot="prepend">项目库</template>
                                                    <el-button @click="getXm" slot="append"
                                                               icon="el-icon-search"></el-button>
                                                </el-input>
                                            </div>
                                            <span v-else>项目库</span>
                                        </div>
                                        <div class="xmNameitem" style="text-align: left"
                                             v-for="(xm, index) in xmlist"
                                             @click="xminfo(xm, index)" :title="xm.name"
                                             :class="{sectedXmname:xmid===xm.oid}">
                                            {{xm.name}}
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="14">
                                    <el-card class="box-card">
                                        <div slot="header">
                                            <span>任务列表</span>
                                        </div>
                                        <ice-query-grid
                                                data-url="/pms/PmsWbs/listForTcjh"
                                                :columns="columns"
                                                :chooseItem="flowScope.formReadonly?null:'multiple'"
                                                @selection-change="select"
                                                :gridAutoRefresh="false"
                                                :query="query"
                                                :checkAll="checkAll"
                                                codeProp="oid"
                                                :selectedCodes="rwInfo.map(c=>c.oid)"
                                                :isSelectable=true
                                                :allforbidden='flowScope.formReadonly'
                                                :sectData="sectData"
                                                @table-change="tableChange"
                                                :beforeBindData="beforeBindData"
                                                ref="grid">
                                        </ice-query-grid>
                                    </el-card>
                                </el-col>
                                <el-col :span="5">
                                    <el-card class="box-card" style="overflow: auto;">
                                        <div slot="header">
                                            <span>任务已选列表</span>
                                        </div>
                                        <el-tag :closable="!flowScope.formReadonly" style="text-align:left"
                                                :key="rw.oid" @close="close(rw, index)"
                                                v-for="(rw,index) in rwInfo">
                                            <span type="text" style="margin-right: 8px;color: #f30213;cursor: pointer;"
                                                  @click="details(rw)">详情</span>{{rw.name}}
                                        </el-tag>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div style=" top: 10px; left: 0; right: 0; bottom: 0; margin: auto;text-align: center">
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-arrow-left" @click="up" ctrlCode="BXZ"
                                       :disabled="active==0">上一步
                            </el-button>
                            <el-button :disabled="active==1" type="primary" @click="next" ctrlCode="BXZ">下一步<i
                                    class="el-icon-arrow-right el-icon--right"></i></el-button>
                        </el-button-group>
                    </div>
                </el-main>
            </div>
        </ice-flow-form>
        <WbsEdit ref="wbsGrid"></WbsEdit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTree from "../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import EditableTable from "../../../components/common/form/panels/tablePanel/EditableTable";
    import IcePersionByDeptSelector from "../../../components/common/biz/IcePersionByDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import JHGL from "./JHGL";
    import PmsProjectMsg from "../../../components/common/pms/PmsProjectMsg";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import moment from 'moment'
    import {defineRwStatusColor, SPZT, RWZT, JHZT} from "../../../utils/constant";

    import codeConfigRequest from '@/utils/codeConfigRequest'
    import WbsEdit from "../xmgl/wbsEdit";

    export default {
        name: 'JHGL_Add_FLOW',
        data() {
            return {
                formReadonly: false,
                oid: '',
                //flowReady的必要属性
                bizdata: {},
                bg: false,
                showForm: true,
                show: false,
                input: '',
                xmid: '',
                xmNameCode: [],
                active: 0,
                loading: false,
                sectData: [],
                formModel: {
                    oid: '',
                    jhname: '',
                    jhcode: '',
                    deptName: '',
                    jhfzr: '',
                    deptId: '',
                    deptCode: '',
                    jhyear: new Date().getFullYear().toString(),
                    jhmb: '',
                    jhlx: '',
                    jhzt: 'JHZT20',
                    sbzt: 'SBZT10',
                    spzt: 'SPZT10',
                    dataSecretLevcode: '',
                    jjcd: '',
                    jhjd: 0,
                    bgsm: '',
                    changed: false,
                    jhdateStart: new Date().getFullYear() + '-01-01',
                    jhdateEnd: new Date().getFullYear() + '-12-31'
                },
                query: [
                    {
                        type: 'static', code: 'rwzt', exp: 'in', value: RWZT.WXF
                    },
                    {
                        type: 'static', code: 'spzt', exp: '=', value: SPZT.YSP
                    },
                    {
                        type: 'static', code: 'dataSecretLevcode', exp: 'in', value: () => {
                            let secret = this.formModel.dataSecretLevcode;
                            let arr = [];
                            for (let i = 1; i <= secret; i++) {
                                arr.push(i);
                            }
                            return arr.join(',');
                        }
                    },
                    {
                        type: 'static', code: 'oidXm', exp: '=', value: () => {
                            return this.xmid
                        }
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'xmname', hidden: true},
                    {code: 'xmcode', hidden: true},
                    {code: 'oidXm', hidden: true},
                    {code: 'dateJhEnd', hidden: true},
                    {code: 'dataSecretLevcode', hidden: true},
                    {code: 'rwzt', hidden: true},
                    {label: '任务编码', code: 'wbscode', width: 130, sortable: true},
                    {label: '任务名称', code: 'rwname', width: 180},
                    {label: '工期(天)', code: 'rwgq', width: 120, sortable: true},
                    {label: '开始日期', code: 'dateJhStar', width: 100},
                    {label: '任务负责人', code: 'rwfzr', width: 100},
                    {label: '任务创建人', code: 'rwcjr', width: 100},
                    {label: '责任部门', code: 'rwdept', width: 100},
                    {label: '经费合计(元)', code: 'rwysJfSum', width: 100},
                ],
                rules: {
                    jhname: [
                        {required: true, whitespace: true, message: '请输入计划名称', trigger: 'blur'}
                    ],
                    deptName: [
                        {required: true, message: '请选择部门', trigger: 'change'}
                    ],
                    jhfzr: [
                        {required: true, message: '请选择负责人', trigger: 'change'}
                    ],
                    jhyear: [
                        {required: true, message: '请选择年份', trigger: 'change'}
                    ],
                    jhlx: [
                        {required: true, message: '请选择计划类型', trigger: 'change'}
                    ],
                    jhmb: [
                        {whitespace: true, message: '请填写计划目标', trigger: 'blur'}
                    ],
                    bgsm: [
                        {required: true, message: '请填写变更说明', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [{required: true, message: '请选择密级'}],
                    jjcd: [{required: true, message: '请选择紧急程度'}],
                    jhdateStart: [{required: true, message: '请选择紧急程度'}],
                    jhdateEnd: [{required: true, message: '请选择紧急程度'}],
                },
                sectItem: {},
                sectIndex: '',
                editRwData: [],
                formData: {},
                xmNameexChange: [],
                wbsVo: [],
                rwInfo: [],
                initdel: [],
                initrw: [],
                checkAll: false,
                rwMjJh: [],
                wbsData: {}
            }
        },
        mixins: [codeConfigRequest],
        computed: {
            maxChildMj() {
                return this.rwMjJh.map(c => {
                    return c.dataSecretLevcode
                })
            },
            //编辑赋值
            itemData() {
                return this.$route.query.item ? JSON.parse(this.$route.query.item) : '';
            },
            jhOid() {
                if (this.$route.query.oid) {
                    return this.$route.query.oid
                } else {
                    return ''
                }
            },

            xmlist() {
                // let arr = [];
                // let xmoids = this.rwInfo.map(c => {
                //     return c.oidXm
                // })
                if (this.formReadonly) {
                    // return this.xmNameCode.filter(c => {
                    //     return xmoids.indexOf(c.oid) != -1;
                    // })
                    let arr = [];
                    this.rwInfo.forEach(c => {
                        let item = arr.find(p => {
                            return p.oid == c.oidXm
                        })
                        console.log(item)
                        if (!item) {
                            let obj = {
                                name: c.xmcode + '(' + c.xmname + ')',
                                oid: c.oidXm
                            }
                            arr.push(obj);
                        }

                    })
                    return arr;

                } else {
                    return this.xmNameCode
                }
            }
        },
        watch: {
            'formModel.dataSecretLevcode'() {
                if (this.formModel.dataSecretLevcode && this.rwInfo.length <= 0 && !this.formModel.oid) {
                    this.checkAll = true;
                } else {
                    this.checkAll = false;
                }
                this.$refs.grid.refresh();
                this.getXm();
            }
        },
        methods: {
            async details(row) {
                console.log(row);
                await this.$axios.get("/pms/PmsWbs/getPmsWbs", {params: {id: row.rwid ? row.rwid : row.oid}})
                    .then(result => {
                        this.wbsData = result.data;
                        this.$refs.wbsGrid.getPeripheralParams("详情", this.wbsData)
                    })
            },
            // 日期控制
            pickerOptions(type) {
                if (type == 1) {
                    let end = this.formModel.jhdateEnd;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else {
                    let start = this.formModel.jhdateStart;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                }
            },
            handleYear(val) {
                console.log(val)
                this.formModel.jhdateStart = moment(val).format("YYYY") + "-01-01";
                this.formModel.jhdateEnd = moment(val).format("YYYY") + "-12-31";
            },
            tableChange(data) {
                console.log(data);
                if (this.formModel.dataSecretLevcode && this.rwInfo.length <= 0) {
                    if (!this.jhOid && this.checkAll) {
                        this.select(data, [])
                        this.$nextTick(_ => {
                            this.$refs.grid.reDoSelection();
                        })

                    }
                }

            },
            // 获取编码
            getCode(jhlx) {
                console.log(jhlx, 'jhlx')
                let param = jhlx ? jhlx : 'XMLB01'
                this.loadProjectCode({name: 'tcjh', param: param}).then(res => {
                    this.formModel.jhcode = res.number;
                })
            },
            close(rw, index) {
                let rwindex = this.editRwData.findIndex(c => {
                    return c.oid == rw.oid;
                })
                let str = this.isChange && rwindex >= 0 ? '移除后再当前页面无法再次选择，请确认是否删除' : '是否确认删除'
                this.$confirm(str, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.rwInfo.splice(index, 1);
                    this.$refs.grid.closeSelection(rw.oid);
                }).catch(() => {
                    console.log('取消成功')
                })
            },
            select(item, delitem) {
                console.log(item, delitem, 'del')
                let oids = this.rwInfo.map(c => {
                    return c.oid
                })
                let insertItem = item.filter(c => oids.indexOf(c.oid) == -1);
                insertItem.map(o => {
                    o.name = o.xmname + "——" + o.wbscode + "(" + o.rwname + ")"
                })
                this.rwInfo = [...this.rwInfo, ...insertItem];
                let deloids = delitem.map(c => {
                    return c.oid;
                })
                this.rwInfo = this.rwInfo.filter(c => {
                    return deloids.indexOf(c.oid) == -1;
                })
            },
            xminfo(data, index) {
                this.xmid = data.oid;
                this.sectItem = data;
                this.sectIndex = index;
                this.checkAll = false;
                this.$refs.grid.refresh();
            },
            up() {
                this.active = 0;
                this.show = false;
                this.showForm = true;
                this.rwMjJh = this.rwInfo;
            },
            next() {
                this.active = 1
                this.show = true
                this.showForm = false
                return
                if (this.active == 0) {
                    this.$refs.form.validate((validate) => {
                        console.log(validate)
                        if (validate) {

                        }
                    })
                }
            },
            flowReady(flowContext, bizdata) {
                this.formReadonly = flowContext.getFormReadonly();
                console.log(bizdata, 'biz');
                //流程初始化
                if (this.dataId) {
                    bizdata.oid = this.dataId
                }
                if (bizdata.oid) {

                    this.assignmentForm(bizdata);
                    this.getXm();
                    this.$nextTick(_ => {
                        this.$refs.grid.refresh();
                    })
                } else {
                    if (this.jhOid) {
                        this.getJhDetail();
                        this.getRw();
                    }

                }

            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                let sts
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        sts = false
                    } else {
                        sts = true
                    }
                })
                if (this.rwInfo.length <= 0) {
                    this.$message.error("请选择任务后再保存")
                    return
                } else {
                    return sts
                }

            },
            flowBizData() {
                //编辑赋值
                let arr = this.rwInfo;
                // 找出被删除的数据
                let deletearr = [];
                this.editRwData.forEach((c) => {
                    let item = arr.filter((o) => {
                        return o.oid == c.oid;
                    })
                    if (item.length <= 0) {
                        deletearr.push(c);
                    }
                })
                deletearr.map((c) => {
                    //变更减少任务状态暂停
                    c.deleteStatus = 1
                })
                let rwData = {};
                deletearr = deletearr.concat(this.initdel);
                //删除的任务 deletearr
                if (!this.formModel.oid) {
                    this.formModel.createName = this.$userInfo.userName;
                }
                this.formData.jhglVo = this.formModel;
                this.formData.changed = this.formModel.changed;
                this.formData.wbsVo = arr;

                this.formModel.jhyear = moment(this.formModel.jhyear).format('YYYY');
                this.formData.jhname = this.formModel.jhname;
                this.formData.jhcode = this.formModel.jhcode;
                console.log(this.formData, 'sbmit')
                return this.formData
            },
            // 渲染数据之前对数据整理
            beforeBindData(data) {
                console.log(data, this.formReadonly)
                if (this.formReadonly) {
                    let oids = this.rwInfo.map(c => {
                        return c.oid;
                    })
                    return data.filter(c => {
                        return oids.indexOf(c.oid) != -1;
                    });
                } else {
                    return data;
                }

            },
            getJhDetail() {
                this.$axios.get("/pms/Jhgl/get", {
                    params: {
                        id: this.jhOid
                    }
                })
                    .then(result => {
                        this.formModel = result.data;
                        this.checkIfChanged();
                    })
                    .catch(error => {
                        this.$message.error("初始化失败")
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            selectDept(depts) {
                this.formModel.deptCode = depts[0].deptCode
                this.formModel.deptId = depts[0].oid
            },
            out() {
                this.$router.push({name: "/pms/jhgl/tcjhgl"});
            },
            getXm() {
                let index = this.formModel.dataSecretLevcode;
                let arr = [];
                for (let i = 1; i <= index; i++) {
                    arr.push(i);
                }
                let staticConditions = [
                    {column: "xmlx", exp: "=", value: 'XMLX01'},
                    {column: "dataSecretLevcode", exp: "in", value: arr.join(',')},
                ];
                let conditions = [{column: "xmname", exp: "like", value: this.input}, {
                    column: "xmcode",
                    exp: "like",
                    value: this.input
                }];
                this.$axios.get("/pms/Xminfo/queryTheItemsOfAllUnDistributedTasks", {
                    params: {
                        staticConditions: staticConditions,
                        conditions: conditions,
                        conditionLink: 'OR',
                        columns: ['oid', 'xmname', 'xmcode']
                    }
                })
                    .then(result => {
                        console.log(result.data, 'dsfdsfa')
                        let data = result.data;
                        data.map(o => {
                            o.name = (o.xmCode + '(' + o.xmName + ')')
                        })
                        this.xmNameCode = data;

                    })
                    .catch(error => {
                        this.$message.error("初始化失败")
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            // 获取任务数据
            getRw() {
                this.$axios.get("/pms/PmsJhXmRw/list", {
                    params: {
                        // jhid:this.itemData.oid,
                        current: 1,
                        size: 100,
                        conditionLink: 'AND',
                        columns: ['oid', 'oidXm', 'dataSecretLevcode', 'xmid',
                            'xmcode', 'xmname', 'rwid', 'wbscode', 'rwzt', 'rwname', 'rwgq', 'dateJhStar', 'rwfzr',
                            'rwcjr', 'rwdept'],
                        staticConditions: [{column: 'jhid', exp: '=', value: this.jhOid}],
                        jhid: this.jhOid
                    }
                }).then(result => {
                    console.log(result, 'res')
                    let arr = result.data.records ? result.data.records : [];
                    arr.map(o => {
                        o.name = o.xmname + "——" + o.wbscode + "(" + o.rwname + ")"
                    });
                    this.rwInfo = arr;
                    this.editRwData = JSON.parse(JSON.stringify(arr));
                })
                    .catch(error => {
                        this.$message.error("初始化失败")
                    })
                    .finally(_ => {
                        this.loading = false
                    });

                // this.$axios.get("/pms/PmsWbs/listByJhid", {params: {jhid: this.jhOid}})
                //     .then(result => {
                //         this.wbsVo = result.data;
                //     })
                //     .catch(error => {
                //         this.$message.error("查询计划失败")
                //     });
            },
            // 表单数据赋值
            checkIfChanged() {
                if (this.formModel.jhzt == JHZT.JXZ && this.formModel.spzt == SPZT.YSP) {
                    this.formModel.changed = true;
                    console.log('this is changedFlow')
                } else {
                    this.formModel.changed = false;
                    console.log('this is addFlow')
                }
            },
            assignmentForm(bizdata) {
                this.formModel = bizdata.jhglVo;
                this.checkIfChanged();
                this.rwInfo = bizdata.wbsVo;
                this.rwInfo.map(o => {
                    o.name = o.xmname + "——" + o.wbscode + "(" + o.rwname + ")"
                })
                let wbsVo = bizdata.wbsVo ? bizdata.wbsVo.filter((c) => {
                    return c.deleteStatus != 1;
                }) : [];
                // this.initdel = bizdata.wbsVo? bizdata.wbsVo.filter((c) => {
                //     return c.deleteStatus == 1;
                // }):[];
                this.editRwData = JSON.parse(JSON.stringify(wbsVo));
                this.formData = bizdata;
                this.wbsVo = wbsVo;
            },
            // 任务数据赋值给项目列表
            // 任务数据赋值给项目列表
            assignmentData(item, sectdata, xmitem) {
                console.log(sectdata, 'sectdata');
                let itemIndex = this.xmNameCode.findIndex((c) => {
                    return c.oid == sectdata.oid
                })
                console.log(itemIndex)
                if (!item || (item.length > 0 && !item[0])) {
                    this.xmNameCode.splice(itemIndex, 1, []);
                    return;
                }
                item.map(o => {
                    o.name = o.xmname + "——" + o.wbscode + "(" + o.rwname + ")"
                })
                console.log(item)
                this.xmNameCode[itemIndex]['sectRw'] = item;
                this.xmNameCode.splice(itemIndex, 1, this.xmNameCode[itemIndex]);
            },
            callBackSuccess(data) {
                console.log(data, 'data')
                if (data) {
                    this.bizdata.oid = data.oid;
                    this.assignmentForm(data);
                }
                // 刷新选择任务列表
                this.$refs.grid.refresh();
            },
        },
        props: {
            dataId: String,
            SJID: String,
            isChange: {
                type: Boolean,
                default: false,
            },
        },
        created() {
            if (this.formModel.dataSecretLevcode) {
                this.getXm();
                this.$nextTick(_ => {
                    this.$refs.grid.refresh();
                })
            }
        },
        components: {
            IceFlowForm,
            PmsProjectMsg,
            JHGL,
            IcePopSelector,
            IcePersionSelector,
            IcePersionByDeptSelector,
            EditableTable,
            IceDeptSelector,
            IceTree,
            IceSelect,
            IceDialog, IceQueryGrid,
            WbsEdit
        }
    }

</script>


<style lang="less" scoped>
    .elform {
        height: 500px;
        margin-bottom: 15px;
    }

    .box-card {
        height: 500px;
    }

    .xmNameitem {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        margin-bottom: 5px;

        &:hover {
            color: #000;
        }
    }

    .sectedXmname {
        color: #000;
        font-weight: bold;
    }
</style>
