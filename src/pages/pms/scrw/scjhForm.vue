<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="callBackSuccess">
            <div slot-scope="flowScope">
                <el-form :model="formModel" status-icon ref="form" label-width="140px">
                    <input type="hidden" v-model="bizdata.oids"/>
                </el-form>
                <el-container>
                    <el-header>
                        <el-page-header @back="goBack" content="计划编制" style="margin: 5px 0px;"></el-page-header>
                        <el-steps :active="active" finish-status="success" simple>
                            <el-step title="计划信息"></el-step>
                            <el-step title="选择产品"></el-step>
                            <el-step title="工艺工序"></el-step>
                        </el-steps>
                    </el-header>
                    <el-main style="height: 500px;">
                        <div class="section" v-show="active===0">
                            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading"
                                     style="margin-top: 20px;">
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="选择项目" label-width="110px" prop="oidXm">
                                            <el-input placeholder="请选择项目" v-model="formModel.xmname" readonly>
                                                <el-button :disabled="flowScope.formReadonly" slot="append"
                                                           icon="el-icon-search"
                                                           @click="showProjectDialog"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="计划名称" label-width="110px" prop="scJhname">
                                            <el-input maxlength="80" :disabled="flowScope.formReadonly"
                                                      v-model="formModel.scJhname"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="计划编码" label-width="110px" prop="scJhcode">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.scJhcode"
                                                      readonly="readonly" placeholder="自动生成编码"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="计划类型" label-width="110px" prop="scJhlx">
                                            <ice-select :disabled="flowScope.formReadonly" v-model="formModel.scJhlx"
                                                        map-type-code="JHLX20" @changevalue="getCode"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="紧急程度" label-width="110px" prop="jjcd">
                                            <ice-select :disabled="flowScope.formReadonly" v-model="formModel.jjcd"
                                                        map-type-code="JJCD"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="外部计划文号" label-width="110px" prop="scJhwhWb">
                                            <el-input maxlength="16" :disabled="flowScope.formReadonly"
                                                      v-model="formModel.scJhwhWb"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                            <ice-select :controlMjPar="controlMjPar" :controlMj="controlMj"
                                                        :disabled="flowScope.formReadonly"
                                                        v-model="formModel.dataSecretLevcode"
                                                        map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16">
                                        <div style="display: flex; flex-direction: row">
                                            <ice-single-upload v-model="formModel.oidFj"
                                                               :disabled="flowScope.formReadonly"
                                                               :control-mj="controlFjMj"
                                                               :on-success="fileUploadSuccess"
                                                               @fileData="fileData"
                                                               :do-secret="true" ref="fileUpload"></ice-single-upload>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="计划开始日期" label-width="110px" prop="scJhdateStart">
                                            <el-date-picker
                                                    :disabled="flowScope.formReadonly"
                                                    v-model="formModel.scJhdateStart"
                                                    :picker-options="countDateSelectRange({},filedDateControls.jhDate , 1, formModel.pscs, 's', formModel)"
                                                    type="date"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="计划结束日期" label-width="110px" prop="scJhdateEnd">
                                            <el-date-picker
                                                    :disabled="flowScope.formReadonly"
                                                    v-model="formModel.scJhdateEnd"
                                                    :picker-options="countDateSelectRange({},filedDateControls.jhDate , 1, formModel.pscs, 'e', formModel)"
                                                    type="date"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" v-if="isChange">
                                    <el-col :span="24">
                                        <el-form-item label="变更说明" label-width="110px" prop="change">
                                            <el-input type="textarea" v-model="formModel.change" placeholder="不超过650个字"
                                                      maxlength="650"
                                                      show-word-limit autocomplete="off"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <el-tabs v-model="activeName">
                                <el-tab-pane label="计划分组" name="first">
                                    <el-button v-if="!flowScope.formReadonly" type="primary" @click="addPlanBatch(-1)">
                                        添加分组
                                    </el-button>
                                    <div style="width: 100%;">
                                        <vxe-table border show-overflow
                                                   ref="planBatchTable"
                                                   height="300"
                                                   size="small"
                                                   :edit-rules="validRules"
                                                   :edit-config="{trigger: 'click', mode: 'cell', activeMethod: activeRowMethod}"
                                                   :data="planBatchTableData">
                                            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                                            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                            <vxe-table-column field="jhpc" title="组次"
                                                              :edit-render="{name: 'input'}"></vxe-table-column>
                                            <vxe-table-column field="jhsl" title="数量"
                                            >
                                            </vxe-table-column>
                                            <vxe-table-column field="jhdateQt" title="齐套时间"
                                            >
                                                <template v-slot="{ row, rowIndex }">
                                                    <el-date-picker
                                                            :disabled="isDisabled"
                                                            v-model="row.jhdateQt"
                                                            :picker-options="countDateSelectRange(formModel,filedDateControls.fzDate , 2, row.psccps, 's', row)"
                                                            type="date"
                                                            placeholder="选择日期">
                                                    </el-date-picker>
                                                </template>
                                            </vxe-table-column>
                                            <vxe-table-column field="jhdateJf" title="交付时间"
                                            >
                                                <template v-slot="{ row, rowIndex }">
                                                    <el-date-picker
                                                            :disabled="isDisabled"
                                                            v-model="row.jhdateJf"
                                                            type="date"
                                                            :picker-options="countDateSelectRange(formModel , filedDateControls.fzDate , 2, row.psccps, 'e', row)"
                                                            placeholder="选择日期">
                                                    </el-date-picker>
                                                </template>
                                            </vxe-table-column>
                                            <vxe-table-column title="操作" v-if="!flowScope.formReadonly">
                                                <template v-slot="{ row }">
                                                    <el-link type="primary" :underline="false"
                                                             @click="deleteGroup(row)">删除
                                                    </el-link>
                                                </template>
                                            </vxe-table-column>
                                        </vxe-table>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="section" v-if="active>0">
                            <table width="100%" style="margin: 15px 0px 5px 0px;">
                                <tr>
                                    <td>项目信息：{{formModel.xmname}}（{{formModel.xmcode}}）</td>
                                    <td>计划信息：{{formModel.scJhname}}（{{formModel.scJhlx}}）</td>
                                </tr>
                            </table>
                            <el-tabs v-model="product_activeName" @tab-click="groupTabClick">
                                <template v-for="(batch, index) in planBatchTableData">
                                    <el-tab-pane :label="batch.jhpc" :name="batch.jhpc+index"></el-tab-pane>
                                </template>
                            </el-tabs>
                        </div>
                        <div class="section" v-show="active===1">
                            <el-container>
                                <el-aside v-if="!flowScope.formReadonly">
                                    <CP_LIST :flowScope="flowScope" @select="productSelect" :sectitem="productData"
                                             :oidXm="formModel.oidXm" ref="cplist"></CP_LIST>
                                </el-aside>
                                <el-main style="padding: 0 0 0 20px">
                                    <CP_EDIT :formModel="formModel" :countDateSelectRange="countDateSelectRange"
                                             :filedDateControls="filedDateControls" :flowScope="flowScope"
                                             :activeRowMethod="activeRowMethod"
                                             :tableData="productData" :sectGroupData="sectGroupData" ref="cpEdit"
                                             @removeRow="removeRow"></CP_EDIT>
                                </el-main>
                            </el-container>
                        </div>
                        <div class="section" v-show="active===2">
                            <el-container>
                                <el-aside>
                                    <CP_LIST_SHOW :product-data="productData" @select="selectProduct"></CP_LIST_SHOW>
                                </el-aside>
                                <el-main style="padding: 0 0 0 20px">
                                    <div class="msg">
                                        <div class="item">
                                            <label for="">
                                                {{currentProduct.cpName}}（{{currentProduct.cpCode}}）
                                            </label>
                                            <span></span>
                                        </div>
                                        <div class="item">
                                            <label for="">
                                                开始时间：
                                            </label>
                                            <span>{{startTime}}</span>
                                        </div>
                                        <div class="item">
                                            <label for="">
                                                结束时间：
                                            </label>
                                            <span>{{endTime}}</span>
                                        </div>
                                        <div class="item">
                                            <label for="">
                                                交付：
                                            </label>
                                            <span>{{currentProduct.cpjfsl?currentProduct.cpjfsl:'-'}}</span>
                                        </div>
                                        <div class="item">
                                            <label for="">
                                                备件：
                                            </label>
                                            <span>{{currentProduct.cpbjsl?currentProduct.cpbjsl:'-'}}</span>
                                        </div>
                                    </div>
                                    <el-select :disabled="flowScope.formReadonly" v-model="gylxValue"
                                               placeholder="请选择工艺路线" @change="selectGylx">
                                        <el-option
                                                v-for="item in gylxListData"
                                                :key="item.gylxid"
                                                :label="item.gylxname"
                                                :value="item.gylxid">
                                        </el-option>
                                    </el-select>
                                    <CP_GX :countDateSelectRange="countDateSelectRange"
                                           :filedDateControls="filedDateControls" :currentProduct="currentProduct"
                                           :flowScope="flowScope" :activeRowMethod="activeRowMethod" :src-data="gxes"
                                           ref="cpGxEdit"></CP_GX>
                                </el-main>
                            </el-container>
                        </div>
                    </el-main>
                    <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
                        <XM_SELECT @select="selectProject" @closeVisible="closeProject"
                                   choose-item="single"></XM_SELECT>
                    </ice-dialog>

                    <el-footer>
                        <el-button style="margin-top: 12px;" @click="prev" :disabled="active==0">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="next" :disabled="active==2">下一步</el-button>
                        <!--<el-button @click="save">保存</el-button>-->
                        <!--<el-button @click="save2">保存2</el-button>-->
                        <!--<el-button @click="look">查看数据</el-button>-->
                    </el-footer>
                </el-container>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>

    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import ATTACHMENT from "../common/ATTACHMENT";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceTree from "../../../components/common/base/IceTree";
    import PmsProjectMsg from "../../../components/common/pms/PmsProjectMsg";
    import SCJH_ITEM from "../common/SCJH_ITEM";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XM_SELECT from "../common/XM_SELECT";
    import CP_LIST from "../common/CP_LIST";
    import CP_EDIT from "../common/CP_EDIT";
    import CP_LIST_SHOW from "../common/CP_LIST_SHOW";
    import CP_GX from "../common/CP_GX";
    import moment from 'moment';
    import codeConfigRequest from '@/utils/codeConfigRequest';

    export default {
        mixins: [codeConfigRequest],
        components: {
            SCJH_ITEM,
            PmsProjectMsg,
            IceTree,
            IceFlowForm,
            ATTACHMENT,
            IceGridLayout,
            CP_GX,
            CP_LIST_SHOW, CP_EDIT, CP_LIST, XM_SELECT, IceSingleUpload, IceSelect, IceDialog, IceDatePicker
        },

        data() {
            return {
                // startFiled, endFiled, childObj, childFiledStart, childFiledEnd
                filedDateControls: {
                    // 计划时间
                    jhDate: {
                        childFiledStart: "jhdateQt",
                        childFiledEnd: "jhdateJf",
                        start: 'scJhdateStart',
                        end: 'scJhdateEnd'
                    },
                    // 分组时间
                    fzDate: {
                        startFiled: "scJhdateStart",
                        endFiled: "scJhdateEnd",
                        start: 'jhdateQt',
                        end: 'jhdateJf'
                    },
                    // 产品时间
                    cpDate: {
                        startFiled: "scJhdateStart",
                        endFiled: "scJhdateEnd",
                        childFiledStart: "startTime",
                        childFiledEnd: "endTime",
                        start: 'jhdateStart',
                        end: 'jhdateEnd'
                    },
                    // 工序时间
                    gxDate: {
                        startFiled: "jhdateStart",
                        endFiled: "jhdateEnd",
                        start: 'startTime',
                        end: 'endTime'
                    },
                },
                controlMj: [],
                bizdata: {},
                formReadonly: false,

                loading: false,
                active: 0,
                visibleProject: false,
                activeName: 'first',
                product_activeName: '',

                currentProduct: {},
                gylxValue: '',

                formModel: {
                    oid: '',
                    oidXm: this.$route.query.oidXm ? this.$route.query.oidXm : '',
                    xmcode: this.$route.query.xmcode ? this.$route.query.xmcode : '',
                    xmname: this.$route.query.xmname ? this.$route.query.xmname : '',
                    scJhname: '',
                    scJhcode: '',
                    scJhlx: '',
                    dataSecretLevcode: '',
                    jjcd: 'yb',
                    scJhwhWb: '',
                    oidFj: '',
                    filename: '',
                    xtFj: {},

                    pscs: [
                        {}
                    ],
                    scJhdateStart: '',
                    scJhdateEnd: ''
                },
                planBatchTableData: [
                    {
                        jhpc: '分组一',
                        jhsl: 0,
                        jhdateQt: '',
                        jhdateJf: '',
                    }
                ],
                rules: {
                    oidXm: [
                        {required: true, whitespace: true, message: '请选择项目', trigger: 'blur'}
                    ],
                    scJhname: [
                        {required: true, whitespace: true, message: '请输入计划名称', trigger: 'blur'}
                    ],
                    scJhlx: [
                        {required: true, whitespace: true, message: '请选择计划类型', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    scJhdateStart: [
                        {required: true, message: '请选择计划开始时间', trigger: 'change'}
                    ],
                    scJhdateEnd: [
                        {required: true, message: '请选择计划结束时间', trigger: 'change'}
                    ],
                },

                validRules: {
                    jhpc: [
                        {required: true, message: '请输入组次'},
                    ],
                    jhsl: [
                        {required: true, message: '请输入数量'}
                    ]
                },

                gylxListData: [
                    {
                        'label': '工艺路线01',
                        'value': '1'
                    },
                    {
                        'label': '工艺路线02',
                        'value': '2'
                    },
                ],

                productListData: [
                    {
                        'jhdateStart': '2019-10-10',
                        'jhdateEnd': '2019-11-12',
                        'cpjfsl': '20',
                        'cpbjsl': '50',
                        'cpName': '产品一',
                        'cpCode': 'CP1',
                        'oid': '11',
                        childrens: [
                            {
                                'jhdateStart': '2019-10-10',
                                'jhdateEnd': '2019-11-12',
                                'cpjfsl': '50',
                                'cpbjsl': '100',
                                'cpName': '部件一',
                                'cpCode': 'CP1',
                                'oid': '100',
                            }
                        ]
                    },
                    {
                        'jhdateStart': '2019-10-12',
                        'jhdateEnd': '2019-11-22',
                        'cpjfsl': '22',
                        'cpbjsl': '80',
                        'cpName': '产品十',
                        'cpCode': 'CP10',
                        'oid': '22',
                        childrens: []
                    }
                ],

                productGxData: [],
                productData: [],
                tabActiveIndex: 0,

                // 保存后返回的数据
                saveLastData: null,
                // 删除的产品数据
                removeCpData: {},
                // 选中的分组
                sectGroupData: {},
                // 判定是否取得流程数据
                isFlowData: false,
                confirmIndex: 0,
                gxes: [],
                flowReadOnly: false,
                changeFjSrdata: [],
                isDisabled: false
            }
        },

        computed: {

            startTime() {
                if (this.currentProduct.jhdateStart) {
                    return moment(this.currentProduct.jhdateStart).format('YYYY-MM-DD');
                } else {
                    return '';
                }
            },
            endTime() {
                if (this.currentProduct.jhdateEnd) {
                    return moment(this.currentProduct.jhdateEnd).format('YYYY-MM-DD');
                } else {
                    return '';
                }
            },
            oidScjh() {
                return this.$route.query.oid ? this.$route.query.oid : ''
            },
            NewplanBatchTableData() {
                return this.planBatchTableData.filter((o) => {
                    return o.version != -1;
                })
            },
            controlFjMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
            controlMjPar() {
                // 附件
                return this.changeFjSrdata;
            },
            isChange() {
                return this.$route.query.isChange || ""
            }
        },
        created() {
            console.log(this.isChange)
        },

        methods: {
            // 计算日期可选择范围
            /**
             *
             *  type 1 无上级  2 有上级和自己 3 无下级  mold 类型 s开始，e结束
             *
             * */
            countDateSelectRange(obj, fileds, type, childobj, mold, row) {
                if (type == 1) {
                    childobj = this.$refs.planBatchTable ? this.$refs.planBatchTable.getTableData().visibleData : null;
                }
                let minstart = "";
                let maxend = "";
                let minChildStart = "";
                let maxChildEnd = "";
                if (childobj && type != 3) {
                    // 获取最大最小时间 开始时间获取最小，结束时间获取最大
                    let {childFiledStart, childFiledEnd} = fileds;
                    childobj.forEach(c => {
                        minChildStart = minChildStart ? (this.compareDate(c[childFiledStart], minChildStart) ? minChildStart : c[childFiledStart]) : c[childFiledStart];
                        maxChildEnd = maxChildEnd ? (this.compareDate(c[childFiledEnd], maxChildEnd) ? c[childFiledEnd] : maxChildEnd) : c[childFiledEnd];
                    })
                }
                if (type != 1) {
                    let {startFiled, endFiled} = fileds;
                    minstart = obj[startFiled];
                    maxend = obj[endFiled];
                }
                if (mold == 's') {
                    return {
                        disabledDate: (time) => {
                            // 判定结束时间是否有值，有值 开始时间就不能大于结束时间
                            let max = minChildStart ? minChildStart : maxend;
                            let end = row[fileds.end];
                            if (end) {
                                max = this.compareDate(max, end) ? end : max;
                            }
                            if (!max) {
                                max = end;
                            }
                            return time.getTime() < moment(minstart).valueOf()
                                || time.getTime() > moment(max).valueOf();
                        }
                    }
                } else {
                    return {
                        disabledDate: (time) => {
                            // 判定结束时间是否有值，有值 开始时间就不能大于结束时间
                            let min = maxChildEnd ? maxChildEnd : minstart;
                            let start = row[fileds.start];
                            if (start) {
                                min = this.compareDate(min, start) ? min : start;
                            }
                            if (!min) {
                                min = start;
                            }
                            return time.getTime() < moment(min).valueOf()
                                || time.getTime() > moment(maxend).valueOf();
                        }
                    }
                }

            },
            // 比较两个时间大小
            compareDate(start, end) {
                return moment(start).valueOf() >= moment(end).valueOf();
            },

            fileData(data) {
                this.changeFjSrdata = data.fileSecret ? [data.fileSecret] : [];
            },
            // 获取编码
            getCode(scjh) {
                let param = scjh ? scjh : ''
                this.loadProjectCode({name: 'scjh', param: param}).then(res => {
                    this.formModel.scJhcode = res.number;
                })
            },
            flowReady(flowContext, bizdata) {
                this.flowReadOnly = flowContext.getFormReadonly();
                //流程初始化
                // console.log('init', bizdata);
                console.log('flowContext', flowContext);
                this.isDisabled = flowContext.getFormReadonly();

                let flowData = this.$refs.flowForm.flowInstData;
                if (flowData.proOperates != null) {
                    this.isFlowData = true;
                    let result = {
                        data: bizdata
                    }
                    this.assignment(result);
                } else {
                    if (this.oidScjh) {
                        this.getDetail();
                    }

                }
            },
            async flowOperateBtn(flowContext, bizdata) {
                // await resault = this.$refs.form.validate();
                let isContinue = false;
                // 判定分组下，是否有数据  产品，工序
                let showData = this.$refs.planBatchTable.getTableData().visibleData;
                // 是否完整数据
                let complete = true;
                showData.forEach(c => {
                    if (c.psccps && c.psccps.length > 0) {
                        c.psccps.forEach(p => {
                            if (!p.gylx) {
                                complete = false;
                            } else {
                                if (!(p.gylx.gxes && p.gylx.gxes.length > 0)) {
                                    complete = false;
                                }
                            }
                        })
                    } else {
                        complete = false;
                    }

                })
                if (!complete) {
                    this.$message.error("有未填写完的信息！");
                    return false;
                }
                this.$refs.form.validate((valid) => {
                    if (!valid) return;
                    flowContext.processVar = {scJhlx: this.formModel.scJhlx};
                    console.log(flowContext.processVar)
                    isContinue = true;
                });
                return isContinue;
            },
            flowBizData() {
                // 计算计算数量
                this.count();
                //获取业务表单数据
                let showData = this.$refs.planBatchTable.getTableData().visibleData;
                // 删除的分组
                let groups = showData;
                this.formModel.pscs = groups;
                this.formModel.pscs.map(o => {
                    o.psccps = o.psccps ? o.psccps : [];
                    if (o.psccps) {
                        o.psccps.map((p) => {
                            p.gylx = p.gylx ? p.gylx : null
                        })
                    }
                });
                this.formModel.addOrNot = true;
                if (this.isChange == 1) {
                    this.formModel.oidScjh = this.oidScjh;
                    this.formModel.oid = null;
                    this.formModel.addOrNot = false;
                }
                console.log(this.formModel)
                return this.formModel;
            },

            // 保存回调方法
            callBackSuccess(data) {
                let result = {
                    data: data
                }
                this.assignment(result, 1);
            },

            // tab标签被选中是触发
            groupTabClick(data) {
                let index = data.index;
                this.tabActiveIndex = index;
                // this.product_activeName = index;
                if (!this.planBatchTableData[index].psccps) {
                    this.planBatchTableData[index].psccps = [];
                }
                let psccps = this.planBatchTableData[index].psccps;
                this.sectGroupData = this.planBatchTableData[index];
                this.productData = psccps ? psccps : [];
                // 清空行选中
                if (this.$refs.cplist) {
                    this.$refs.cplist.clearCheckboxRow(this.productData);
                }
                // this.$refs.cplist.clearCheckboxRow();
            },
            goBack() {
                this.$router.go(-1)
            },
            next() {
                if (this.active == 0) {
                    let showData = this.$refs.planBatchTable.getTableData().visibleData;
                    if (showData.length <= 0) {
                        this.$message.error('你还未选择分组，不能进入下一步！');
                        return;
                    }
                    this.formModel.pscs = showData;
                    this.planBatchTableData = this.formModel.pscs;
                    this.product_activeName = this.planBatchTableData.length > 0 ? this.planBatchTableData[0].jhpc + '0' : '';
                    let psccps = this.planBatchTableData[0].psccps;
                    this.productData = psccps ? psccps : [];
                    this.sectGroupData = this.planBatchTableData[0];
                } else {
                    let index = this.tabActiveIndex;
                    if (!this.planBatchTableData[index].psccps) {
                        this.planBatchTableData[index].psccps = [];
                    }
                    let psccps = this.planBatchTableData[index].psccps;
                    this.sectGroupData = this.planBatchTableData[index];
                    this.productData = psccps ? psccps : [];
                }
                this.active++;
                this.handleResetTable();

            },
            prev() {
                this.active--;
                this.count();
                this.handleResetTable();
            },
            // 计算交付数量
            count() {
                this.planBatchTableData.map(c => {
                    let cps = (c.psccps ? c.psccps : []).map(p => {
                        return p.cpjfsl;
                    });
                    let num = cps.reduce((total, s) => {
                        return total * 1 + s * 1
                    }, 0)
                    c.jhsl = num;
                })
            },
            showProjectDialog() {
                this.visibleProject = true;
            },
            selectProject(item) {
                this.controlMj = [item[0].dataSecretLevcode];
                this.formModel.dataSecretLevcode = '';
                this.formModel.oidXm = item[0].oid;
                this.formModel.xmcode = item[0].xmcode;
                this.formModel.xmname = item[0].xmname;
                this.visibleProject = false;
            },
            closeProject() {
                this.visibleProject = false;
            },

            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {
                    filename: file.name,
                    fileSize: file.size,
                    dataid: response.data,
                    dataSecretLevcode: response.securityLevel
                };
                //this.$downloadFile(fileId);
                this.$refs.fileUpload.reset();
                this.formModel.oidFj = fileId;
                this.formModel.filename = file.name;
                this.formModel.xtFj = record;
            },

            save() {
                this.savePlanInfo();
                return
                if (this.active == 0) {
                    // 保存计划信息
                    this.savePlanInfo(0);
                } else if (this.active == 1) {
                    // 保存产品信息
                    // this.saveProductInfo(0);
                }
            },

            save2() {
                let data = this.$refs.cpGxEdit.getAllData();
            },
            // 获取详情数据
            getDetail() {
                this.$axios.get("/pms/PmsScJh/detail", {params: {id: this.oidScjh}})
                    .then(result => {
                        this.assignment(result);
                    })
                    .catch(error => {
                        this.$message.error("查询生产计划详情失败")
                    })
                    .finally(_ => {

                    })
            },
            // 获取详情数据后赋值
            assignment(result, type) {
                if (type == 1) {
                    this.formModel.oid = result.data.oid;
                } else {
                    this.formModel = result.data;
                    this.saveLastData = result.data;
                    console.log(this.formModel, 'formmodel')
                    localStorage.listdata = JSON.stringify(this.formModel);
                    this.planBatchTableData = this.formModel.pscs;
                    this.product_activeName = this.planBatchTableData.length > 0 ? this.planBatchTableData[0].oid : '';
                    let psccps = this.planBatchTableData[0].psccps;
                    this.productData = psccps ? psccps : [];
                    console.log(this.productData, 'this.productData')
                    // 清空行选中
                    if (this.$refs.cplist && this.productData.length > 0) {
                        this.$refs.cplist.clearCheckboxRow(this.productData);
                    }
                    return;
                }


            },
            /**
             * 保存计划信息
             * @param next 0、保存，1、下一步
             */
            savePlanInfo(next) {
                let showData = this.$refs.planBatchTable.getTableData().visibleData;
                // 删除的分组
                let delGroup = this.clearupGroupRemoveData();
                let groups = showData.concat(delGroup);
                this.formModel.pscs = groups;
                this.formModel.pscs.map(o => {
                    o.psccps = o.psccps ? o.psccps : [];
                    if (o.psccps) {
                        o.psccps.map((p) => {
                            p.gylx = p.gylx ? p.gylx : {}
                        })
                    }
                });
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$refs.planBatchTable.validate(valid => {
                            if (valid) {
                                this.loading = true
                                this.$axios.post("/pms/PmsScJh/saveScjh", this.formModel)
                                    .then(result => {
                                        this.$message.success('保存成功');
                                        this.formModel = result.data;
                                        this.saveLastData = result.data;

                                        localStorage.listdata = JSON.stringify(this.formModel);
                                        this.formModel.pscs.map(o => {

                                        });
                                        this.planBatchTableData = this.formModel.pscs;
                                    })
                                    .catch(error => {
                                        this.$message.error("保存失败")
                                    })
                                    .finally(_ => {
                                        this.loading = false;
                                    })
                            }
                        })
                    }
                })
            },
            // // 整理数据，找到删除的分组
            // clearupGroupRemoveData() {
            //     if (!this.saveLastData) {
            //
            //         return [];
            //     }
            //     let showData = this.$refs.planBatchTable.getTableData().visibleData;
            //     let gather = {
            //         ids: [],
            //     };
            //     showData.forEach((c) => {
            //         if (c.oid) {
            //             gather.ids.push(c.oid);
            //         }
            //     });
            //
            //     let delData = this.saveLastData.pscs.filter((c) => {
            //         if (c.oid) {
            //             return gather.ids.indexOf(c.oid) < 0;
            //         }
            //     })
            //     delData.map((c) => {
            //         c.version = -1;
            //     });
            //     return delData;
            // },
            // 整理选择产品数据
            clearupCpData() {

            },
            // 移除行
            removeRow(row) {
                this.getDataByeva();
                this.$refs.cplist.cancelCheckbox(row);
            },

            addPlanBatch(row) {
                let record = {};
                this.$refs.planBatchTable.insertAt(record, row)
                    .then(({row}) => this.$refs.planBatchTable.setActiveCell(row))
            },

            productSelect(item) {
                console.log(item, 'FSDFDSFDFDSFDS')
                let plan = this.planBatchTableData[this.tabActiveIndex]
                if (Array.isArray(item)) {
                    item.forEach((c) => {
                        c.oidCpk = c.oid;
                        c.oid = null;
                        c.cpbjsl = 0;
                        c.docNum = 0;
                        c.cpjfsl = 0;
                        c.jhdateStart = this.formModel.scJhdateStart ? this.formModel.scJhdateStart : '';
                        c.jhdateEnd = this.formModel.scJhdateEnd ? this.formModel.scJhdateEnd : '';
                        this.$refs.cpEdit.loadTableData(c);
                        this.getDataByeva();
                    })
                } else {
                    item.oidCpk = item.oid;
                    item.oid = null;
                    item.cpbjsl = 0;
                    item.docNum = 0;
                    item.cpjfsl = 0;
                    item.jhdateStart = this.formModel.scJhdateStart ? this.formModel.scJhdateStart : '';
                    item.jhdateEnd = this.formModel.scJhdateEnd ? this.formModel.scJhdateEnd : '';
                    this.$refs.cpEdit.loadTableData(item);
                    this.getDataByeva();
                }
            },
            // 获取表格数据并且赋值
            getDataByeva() {
                let psccps = this.$refs.cpEdit.getCpData();
                console.log(psccps, 'psccps615615')
                let ids = [];
                psccps.forEach((c) => {
                    if (c.oid) {
                        ids.push(c.oid);
                    }
                })
                this.planBatchTableData.map((o, index) => {
                    if ((o.jhpc + index) == this.product_activeName) {
                        if (o.psccps) {
                            // let removeItems = o.psccps.filter((c) => {
                            //     if (c.oid) {
                            //         return ids.indexOf(c.oid) < 0;
                            //     } else {
                            //         return false;
                            //     }
                            // })
                            // removeItems.map((p) => {
                            //     p.version = -1;
                            // })
                            let arr = psccps;
                            o.psccps = arr;
                            this.productData = arr;
                        } else {
                            o.psccps = psccps;
                            this.productData = psccps;
                        }

                    }
                });
            },
            getGylx(cpid) {
                if (!cpid) {
                    return
                }
                let url = "pms/PmsViewGylx/getByCpid";
                this.$axios.get(url, {params: {cpid: cpid}})
                    .then(result => {
                        this.gylxListData = result.data;
                        if (this.currentProduct.gylx) {
                            this.gylxValue = this.currentProduct.gylx.gylxid;
                            if (this.currentProduct.gylx.gxes) {
                                this.gxes = this.currentProduct.gylx.gxes;
                            }
                        }
                    })
                    .catch(error => {
                        this.$message.error("查询工艺路线失败！")
                    })
            },
            selectProduct(val) {
                console.log(val, 'val');
                this.currentProduct = val;
                this.gylxValue = '';
                this.gxes = [];
                this.getGylx(val.oidCpk);
            },

            selectGylx(value) {
                let val = this.gylxListData.filter((c) => {
                    return value == c.gylxid
                })
                val = val[0];
                let url = "pms/PmsViewGx/getByGylxid";
                this.$axios.get(url, {params: {gxlyid: value}})
                    .then(result => {
                        this.productGxData = result.data;
                        const currentP = JSON.parse(JSON.stringify(this.currentProduct));
                        console.log(currentP, 'currentp')
                        console.log(this.currentProduct.jhdateStart, 'this.currentProduct.jhdateStart')
                        this.productGxData.map((c) => {
                            c.startTime = currentP.jhdateStart ? currentP.jhdateStart : '';
                            c.endTime = currentP.jhdateEnd ? currentP.jhdateEnd : '';
                            c.dw = currentP.cpSldw ? currentP.cpSldw : ''
                            c.jhsl = currentP.cpjfsl && currentP.cpjfsl * 1 || 0;
                            // c.jhsl = 0;
                            c.sfsjjd = this.formModel.scJhlx == 'JHLX21' ? '1' : '0';
                            c.sfsjcqjc = this.formModel.scJhlx == 'JHLX21' ? '1' : '0';
                        })
                        console.log(this.productGxData, 'product')
                        let arr = this.productGxData.map(c => {
                            let obj = {
                                startTime: c.startTime,
                                endTime: c.endTime,
                                sfsjjd: c.sfsjjd,
                                sfsjcqjc: c.sfsjcqjc,
                                gxCode: c.gxCode,
                                gxName: c.gxName,
                                gxdept: c.gxdept,
                                jhsl: c.jhsl,
                                workHour: c.workHour,
                                cllx: c.cllx,
                                deptid: c.deptid,
                                deptcode: c.deptcode,
                                gxid: c.gxid,
                                gxlyid: c.gxlyid,
                                gxtype: c.gxtype,
                                sn: c.sn,
                                wcsl: c.wcsl,
                                dw: c.dw

                            }
                            return obj
                        })
                        console.log(arr, 'arr')
                        val['gxes'] = arr;
                        this.currentProduct['gylx'] = val;
                        this.gxes = this.currentProduct.gylx.gxes;
                        // this.gxes = arr
                        this.planBatchTableData[this.tabActiveIndex].psccps.map((c, i) => {
                            if (c.oidCpk == this.currentProduct.oidCpk) {
                                c.gylx = val;
                            }
                        })
                    })
                    .catch(error => {
                        this.$message.error("查询工序失败！")
                    })
                return
            },
            look() {
                // this.productData.map((c)=>{
                //   c.gylx = ['1'];
                // })
                let showData = this.$refs.planBatchTable.getTableData().visibleData;
                this.planBatchTableData = showData;
                console.log(this.formModel, this.planBatchTableData)
            },
            // 编辑禁用
            activeRowMethod({row, rowIndex, columnIndex}) {
                return !this.flowReadOnly;
            },
            // 表格重新计算
            resize() {
                this.$nextTick(() => {
                    this.$refs.planBatchTable.recalculate();
                })
            },
            // 切换tab后重新计算表格
            handleResetTable() {
                let index = this.active;
                if (index == 0) {
                    this.resize();
                }
                if (index == 1) {
                    this.$refs.cpEdit.resize();
                    if (!this.flowReadOnly) {
                        this.$refs.cplist.resize();
                    }

                }
                if (index === 2) {
                    this.$refs.cpGxEdit.resize();
                }
            },
            // 删除分组
            deleteGroup(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.$refs.planBatchTable.remove(row);
                    // this.tabActiveIndex = 0;
                    if (row.oid) {
                        this.delGroup(row);
                    } else {
                        this.$refs.planBatchTable.remove(row);
                        this.tabActiveIndex = 0;
                    }

                }).catch(() => {
                    console.log('取消成功')
                })

            },
            // 判断是否能够删除分组
            delGroup(row) {
                console.log(row,)
                this.$axios.get("/pms/PmsScJh/deleteJudgmentByOidPsc", {params: {oidPsc: row.oid}})
                    .then(result => {
                        if (result.data) {
                            this.$refs.planBatchTable.remove(row);
                            this.tabActiveIndex = 0;
                        } else {
                            this.$message.warning("存在正在生产的产品，禁止删除！");
                        }
                    })
                    .catch(error => {
                        this.$message.error("删除失败")
                    })
                    .finally(_ => {

                    })
            },
        },
        watch: {
            product_activeName() {
                this.planBatchTableData.map(o => {
                    if (o.oid == this.product_activeName) {

                    }
                });
            },
            currentProduct() {
                console.log('currentProduct', this.currentProduct)
            }
        },
    }

</script>

<style lang="less" scoped>
    .msg {
        margin-bottom: 10px;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        .item {
            float: left;
            font-size: 14px;
            white-space: nowrap;

            label {
                color: #555;
            }

            span {
                font-size: 14px;
                margin-right: 20px;
                white-space: nowrap;
            }
        }

    }

    .section {

    }
</style>
