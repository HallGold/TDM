<template>
    <div class="ice-container">
        <div class="btns">
            <div class="right">
                <search-input :query="query" @search="search"></search-input>
            </div>
            <div class="left">
                <el-button type="primary" @click="refresh"><i class="el-icon-refresh"></i>刷新</el-button>
                <el-button type="success" @click="addFjVisible"><i class="el-icon-plus"></i>新增</el-button>
                <el-button type="info" @click="handleImportShow"><i class="el-icon-upload2"></i>导入</el-button>
                <!--<el-button type="warning" @click="exportDataEvent"><i class="el-icon-top"></i>导出</el-button>-->
            </div>

        </div>
        <div class="vxe-full-main">
            <div class="vxe-full-container">
                <vxe-table
                        ref="vxetable"
                        :loading="vxeloading"
                        resizable
                        border
                        size="mini"
                        column-min-width="100"
                        height="100%"
                        header-align="center"
                        :align="allAlign"
                        :data="tableData">
                    <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                    <!--<vxe-table-column :field="item.code" :title="item.label" v-for="(item, index) in columns">-->
                    <!--<vxe-table-column :field="citem.code" :title="citem.label" v-if="item.children" v-for="(citem, o) in item.children">-->
                    <!--<template v-slot="{ row, rowIndex, columnIndex }">-->
                    <!--<pms-vxe-column v-if="item.dataTable" :value="row.dataSecretLevcode" mapTypeCode="DATA_SECRET_LEVEL"></pms-vxe-column>-->
                    <!--<span v-else>{{row[item.code]}}</span>-->
                    <!--</template>-->
                    <!--</vxe-table-column>-->
                    <!--<template v-else v-slot="{ row, rowIndex, columnIndex }">-->
                    <!--<pms-vxe-column v-if="item.dataTable" :value="row.dataSecretLevcode" mapTypeCode="DATA_SECRET_LEVEL"></pms-vxe-column>-->
                    <!--<span v-else>{{row[item.code]}}</span>-->
                    <!--</template>-->
                    <!--</vxe-table-column>-->
                    <vxe-table-column field="fxcode" title="风险编码"></vxe-table-column>
                    <vxe-table-column field="fxname" title="风险名称"></vxe-table-column>
                    <vxe-table-column field="fxqdZyqy" title="作业区域"></vxe-table-column>
                    <vxe-table-column field="fxqdZyhd" title="作业活动"></vxe-table-column>
                    <vxe-table-column field="fxqdSglx" title="事故类型">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <pms-vxe-column :value="row.fxqdSglx" mapTypeCode="SGLX"></pms-vxe-column>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dataSecretLevcode" title="项目密级">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <pms-vxe-column :value="row.dataSecretLevcode"
                                            mapTypeCode="DATA_SECRET_LEVEL"></pms-vxe-column>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="fxqdBbdw" title="识别单位"></vxe-table-column>
                    <vxe-table-column field="fxry" title="发现人员"></vxe-table-column>
                    <vxe-table-column field="fxdate" title="识别日期"></vxe-table-column>
                    <vxe-table-column field="fxqdWhys" title="危害和危害因素"></vxe-table-column>
                    <vxe-table-column field="yzcd" title="严重程度">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <pms-vxe-column :value="row.yzcd" mapTypeCode="YZCD"></pms-vxe-column>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="fsgl" title="发生概率">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <pms-vxe-column :value="row.fsgl" mapTypeCode="FSGL"></pms-vxe-column>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="age" title="控制后风险">
                        <vxe-table-column field="lecdL" title="L">

                        </vxe-table-column>
                        <vxe-table-column field="lecdE" title="E">

                        </vxe-table-column>
                        <vxe-table-column field="lecdC" title="C">

                        </vxe-table-column>
                        <vxe-table-column field="lecdD" title="D">

                        </vxe-table-column>
                    </vxe-table-column>
                    <vxe-table-column field="fxqdFxfq" title="风险分区">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <el-tag v-if="row.fxqdFxfq=='蓝区'">{{row.fxqdFxfq}}</el-tag>
                            <el-tag type="danger" v-if="row.fxqdFxfq=='红区'">{{row.fxqdFxfq}}</el-tag>
                            <el-tag type="warning" v-if="row.fxqdFxfq=='黄区'">{{row.fxqdFxfq}}</el-tag>
                            <el-tag color="orange" v-if="row.fxqdFxfq=='橙区'">{{row.fxqdFxfq}}</el-tag>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="fxzt" title="风险状态">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <pms-vxe-column :value="row.fxzt" mapTypeCode="FXZT"></pms-vxe-column>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column fixed="right" title="操作" width="100">
                        <template v-slot="{ row, rowIndex, columnIndex }">
                            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                            <el-button type="text" @click="handleDel(row)">删除</el-button>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>

        </div>

        <vxe-pager
                perfect
                size="mini"
                :current-page="tablePage.current"
                :page-size="tablePage.size"
                :total="tablePage.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="data=>{handlePageChange(data[0])}">
        </vxe-pager>
        <!--新增-->
        <!--添加风险-->
        <ice-dialog :title="activeName" :visible.sync="addFxVisible" width="1200px">
            <div style="padding: 10px;" class="formBox">
                <el-form :model="formModel" :rules="rules" ref="formbd" v-loading="loading">
                    <el-row :gutter="20">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="风险编码" label-width="110px">
                                    <el-input v-model="formModel.fxcode" disabled placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="风险名称" label-width="110px" prop="fxname">
                                    <el-input v-model="formModel.fxname"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="风险区域" label-width="110px" prop="fxqdZyqy">
                                    <el-input v-model="formModel.fxqdZyqy"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="16">-->
                                <!--<div style="display: flex; flex-direction: row">-->
                                    <!--<ice-single-upload v-model="formModel.oidFj"-->
                                                       <!--:on-success="fileUploadSuccess"-->
                                                       <!--:do-secret="true" ref="fileUpload"></ice-single-upload>-->
                                    <!--&lt;!&ndash;<el-input v-model="formModel.filename" style="margin-left: 10px;"&ndash;&gt;-->
                                    <!--&lt;!&ndash;disabled></el-input>&ndash;&gt;-->
                                <!--</div>-->
                            <!--</el-col>-->
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="作业活动" label-width="110px" prop="fxqdZyhd">
                                    <el-input v-model="formModel.fxqdZyhd"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="事故类型" label-width="110px" prop="fxqdSglx">
                                    <ice-select v-model="formModel.fxqdSglx"
                                                map-type-code="SGLX"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">

                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="发现人员" label-width="110px" prop="fxry">
                                    <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                          v-model="formModel.fxry"
                                                          @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="辨别单位" label-width="110px" prop="fxqdBbdw">
                                    <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                       v-model="formModel.fxqdBbdw"
                                                       @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="识别日期" label-width="110px" prop="fxdate">
                                    <el-date-picker v-model="formModel.fxdate"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="严重程度" label-width="110px" prop="yzcd">
                                    <ice-select v-model="formModel.yzcd"
                                                map-type-code="YZCD"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发生概率" label-width="110px" prop="fsgl">
                                    <ice-select v-model="formModel.fsgl"
                                                map-type-code="FSGL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="LECK-L" label-width="110px" prop="lecdL">
                                    <el-input type="number" v-model="formModel.lecdL"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="LECD-E" label-width="110px" prop="lecdE">
                                    <el-input type="number" v-model="formModel.lecdE"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="LECD-C" label-width="110px" prop="lecdC">
                                    <el-input type="number" v-model="formModel.lecdC"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="LECD-D" label-width="110px" prop="lecdD">
                                    <el-input type="number" v-model="formModel.lecdD" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="风险分区" label-width="110px" prop="value">
                                    <el-input :class="analyze.ys" v-model="analyze.value" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="风险状态" label-width="110px" prop="yzcd">
                                    <ice-select v-model="formModel.fxzt"
                                                map-type-code="FXZT"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="危害和危害因素" label-width="110px" prop="fxqdWhys">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.fxqdWhys"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="现有控制措施" label-width="110px" prop="fxqdXykzcs">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.fxqdXykzcs"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="持续改进意见" label-width="110px" prop="fxqdCxgjyj">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.fxqdCxgjyj"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-row>
                </el-form>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
                    <el-button type="info" @click="addFxVisible=false">关闭</el-button>
                </div>
            </div>

        </ice-dialog>
        <!--导入-->
        <ice-dialog title="导入" :visible.sync="visibleImport" width="500px">
            <ice-excel-uploader @uploadSuccess="uploadSuccess" service="fxqdExcelService"
                                module="pms"></ice-excel-uploader>
        </ice-dialog>

        <!--// 导出-->
        <ice-dialog title="数据导出预览" :visible.sync="exportSelectorShow"
                    height="700px" width="1200px" remounted>
            <ice-query-grid-export :exportQuery="querys"
                                   :exportColumn="columns1"
                                   data-url="/pms/PmsFxqd/list"
                                   exportTitle="风险清单导出"
                                   exportType="remote"
                                   :pager="pagination"
                                   @export-cancel="exportSelectorShow=false">

            </ice-query-grid-export>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';
    import XM_SELECT from "../common/XM_SELECT";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import UploadAttachment from "../../biz/dev/comm/uploadAttachment";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import ATTACHMENT from "../common/ATTACHMENT";
    import pmsVxeColumn from './components/pmsVxeColumn'
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";

    import searchInput from "../../qis/zlycbh/searchInput"

    import codeConfigRequest from '@/utils/codeConfigRequest'
    import IceQueryGridExport from "../../../components/common/base/IceQueryGridExport";
    export default {
        mixins: [codeConfigRequest],
        name: "FXQD",
        components: {
            searchInput,
            ATTACHMENT,
            IceSingleUpload,
            UploadAttachment,
            IceMultipleUpload,
            XM_SELECT,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            pmsVxeColumn,
            IceDeptSelector,
            IcePersionSelector,
            IceExcelUploader,
            IceQueryGridExport
        },
        data() {
            return {
                // 导出
                exportSelectorShow: false,
                pagination: true,
                // 导入
                visibleImport: false,
                vxeloading: false,
                tableData: [],
                allAlign: null,
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditions:[],
                    conditionLink:'OR',
                },
                activeName: '添加风险',
                loading: false,
                addFxVisible: false,
                //查询
                query: [
                    {type: 'input', code: 'fxcode', label: '风险编码', exp: 'like', value: ''},
                    {type: 'input', code: 'fxname', label: '风险名称', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdZyqy', label: '作业区域', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdZyhd', label: '作业活动', exp: 'like', value: ''},
                    {type: 'select', code: 'fxqdSglx', label: '事故类型', exp: 'like', value: '', mapTypeCode: "SGLX"},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级', exp: 'like', value: '', mapTypeCode: "DATA_SECRET_LEVEL"},
                    {type: 'input', code: 'fxry', label: '发现人员', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdBbdw', label: '辨别单位', exp: 'like', value: ''},
                    {type: 'date', code: 'fxdate', label: '识别日期', exp: 'like', value: ''},
                    {type: 'select', code: 'yzcd', label: '严重程度', exp: 'like', value: '', mapTypeCode: "YZCD"},
                    {type: 'select', code: 'fsgl', label: '发生概率', exp: 'like', value: '', mapTypeCode: "FSGL"},
                    {type: 'input', code: 'lecdL', label: 'LECD_L', exp: 'like', value: ''},
                    {type: 'input', code: 'lecdE', label: 'LECD_E', exp: 'like', value: ''},
                    {type: 'input', code: 'lecdC', label: 'LECD_C', exp: 'like', value: ''},
                    {type: 'input', code: 'lecdD', label: 'LECD_D', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdFxfq', label: '风险分区', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdWhys', label: '危害和危害因素', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdCxgjyj', label: '持续改进意见', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdXykzcs', label: '现有控制措施', exp: 'like', value: ''},
                ],
                // 导出查询
                querys: [
                    {type: 'input', code: 'fxcode', label: '风险编码'},
                    {type: 'input', code: 'fxname', label: '风险名称'},
                ],
                //列表展示字段
                columns: [
                    // {code: 'oid', hidden: true},
                    // {code: 'oidXm', hidden: true},
                    // {code: 'xmname', hidden: true},
                    // {code: 'xmcode', hidden: true},
                    // {code: 'dataSecretLevcode', hidden: true},
                    {label: '风险编码', code: 'fxcode'},
                    {label: '风险名称', code: 'fxname'},
                    {label: '作业区域', code: 'fxqdZyqy'},
                    {label: '作业活动', code: 'fxqdZyhd'},
                    {label: '事故类型', code: 'fxqdSglx', dataTypeCode: 'SGLX'},
                    {label: '密级', code: 'dataSecretLevcode', dataTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '发现人员', code: 'fxry'},
                    {label: '辨别单位', code: 'fxqdBbdw'},
                    {label: '识别日期', code: 'fxdate'},
                    {label: '严重程度', code: 'yzcd', dataTypeCode: 'YZCD'},
                    {label: '发生概率', code: 'fsgl', dataTypeCode: 'FSGL'},
                    {
                        label: '控制后风险', code: 'xxx',
                        children: [
                            {label: 'LECD_L', code: 'lecdL',},
                            {label: 'LECD_E', code: 'lecdE'},
                            {label: 'LECD_C', code: 'lecdC',},
                            {label: 'LECD_D', code: 'lecdD',},
                        ]
                    },
                    {label: '风险分区', code: 'fxqdFxfq'},
                    {label: '危害和危害因素', code: 'fxqdWhys'},
                    {label: '持续改进意见', code: 'fxqdCxgjyj',},
                    {label: '备注', code: 'dateRemark'},
                    {label: '现有控制措施', code: 'fxqdXykzcs'},
                ],
                columns1: [
                    {code: 'oid', hidden: true},
                    {label: '风险编码', code: 'fxcode'},
                    {label: '风险名称', code: 'fxname'},
                    {label: '作业区域', code: 'fxqdZyqy'},
                    {label: '作业活动', code: 'fxqdZyhd'},
                    {label: '事故类型', code: 'fxqdSglx', mapTypeCode: 'SGLX'},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '发现人员', code: 'fxry'},
                    {label: '辨别单位', code: 'fxqdBbdw'},
                    {label: '识别日期', code: 'fxdate'},
                    {label: '严重程度', code: 'yzcd', mapTypeCode: 'YZCD'},
                    {label: '发生概率', code: 'fsgl', mapTypeCode: 'FSGL'},
                    {label: 'LECD_L', code: 'lecdL'},
                    {label: 'LECD_E', code: 'lecdE'},
                    {label: 'LECD_C', code: 'lecdC',},
                    {label: 'LECD_D', code: 'lecdD',},
                    {label: '风险分区', code: 'fxqdFxfq'},
                    {label: '风险状态', code: 'fxzt', mapTypeCode: 'FXZT'},
                    {label: '危害和危害因素', code: 'fxqdWhys'},
                    {label: '持续改进意见', code: 'fxqdCxgjyj',},
                    {label: '备注', code: 'dateRemark'},
                    {label: '现有控制措施', code: 'fxqdXykzcs'},
                ],
                formModel: {
                    oid: '',
                    fxcode: '',
                    fxname: '',
                    fxqdZyqy: '',
                    fxqdZyhd: '',
                    fxqdSglx: '',
                    dataSecretLevcode: '',
                    fxry: '',
                    fxqdBbdw: '',
                    fxdate: '',
                    yzcd: '',
                    fsgl: '',
                    lecdL: '',
                    lecdE: '',
                    lecdC: '',
                    lecdD: '',
                    fxqdFxfq: '',
                    fxqdWhys: '',
                    fxqdCxgjyj: '',
                    dateRemark: '',
                    fxqdXykzcs: '',
                    fxzt: ''
                },
                rules: {
                    fxname: [
                        {required: true, whitespace: true, message: '请输入风险名称', trigger: 'blur'}
                    ],
                    fxqdZyqy: [
                        {required: true, whitespace: true, message: '请输入风险区域', trigger: 'blur'}
                    ],
                    fxqdZyhd: [
                        {required: true, whitespace: true, message: '请输入作业活动', trigger: 'blur'}
                    ],
                    fxqdSglx: [
                        {required: true, whitespace: true, message: '请选择事故类型', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择项目密级', trigger: 'blur'}
                    ],
                    fxry: [
                        {required: true, message: '请选择发现人员', trigger: 'blur'}
                    ],
                    fxqdBbdw: [
                        {required: true, message: '请选择辨别单位', trigger: 'blur'}
                    ],
                    fxdate: [
                        {required: true, message: '请选择识别日期', trigger: 'blur'}
                    ],
                    lecdL: [
                        {required: true, message: '请输入LECD_L', trigger: 'blur'}
                    ],
                    lecdE: [
                        {required: true, message: '请输入LECD_E', trigger: 'blur'}
                    ],
                    lecdC: [
                        {required: true, message: '请输入LECD_C', trigger: 'blur'}
                    ],
                    fxqdWhys: [
                        {required: true, message: '请输入危害和危害因素', trigger: 'blur'}
                    ],
                    fxqdXykzcs: [
                        {required: true, message: '请输入现有控制措施', trigger: 'blur'}
                    ],
                    fxzt: [
                        {required: true, whitespace: true, message: '请选择事故类型', trigger: 'blur'}
                    ],
                },
                // 风险分析

            }
        },
        computed: {
            // 风险分析
            analyze() {
                if (!(this.formModel.lecdL && this.formModel.lecdE && this.formModel.lecdC)) {
                    this.formModel.lecdD = '';
                    return {
                        value: '',
                        ys: '',
                    }
                }
                let num = this.formModel.lecdL * this.formModel.lecdE * this.formModel.lecdC;
                this.formModel.lecdD = num;
                if (num >= 160) {
                    return {
                        value: '红区',
                        ys: 'red',
                    }
                } else if (num >= 70 && num < 160) {
                    return {
                        value: '橙区',
                        ys: 'orange'
                    }
                } else if (num >= 20 && num < 70) {
                    return {
                        value: '黄区',
                        ys: 'yellow'
                    }
                } else {
                    return {
                        value: '蓝区',
                        ys: 'blue'
                    }
                }
            },
                staticQuerys() {
                    let arr = this.query.filter(item => item.type == "static")
                    return arr.map(c => {
                        return {
                            column: c.code,
                            exp: c.exp,
                            value: typeof c.value == "function" ? c.value() : c.value
                        }
                    });
                },
        },
        created() {
            this.getList();
        },
        methods: {
            search(data) {
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'fxqd'}).then(res => {
                    this.formModel.fxcode = res.number;
                })
            },
            handleConfirmAdd() {
                this.formModel.fxqdFxfq = this.analyze.value;

                this.$refs.formbd.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("pms/PmsFxqd/saveOrUpdate ", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.refresh();
                                this.addFxVisible = false;
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
            // 编辑
            handleEdit(row) {
                this.addFxVisible = true;
                this.$nextTick(_ => {
                    console.log(this.$refs.formbd)
                    this.$refs.formbd.resetFields();
                    this.getSingle(row);

                })


            },

            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/PmsFxqd/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取风险清单失败！")
                    })
            },
            // 删除
            handleDel(row) {
                console.log(row)
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pms/PmsFxqd/deleteStatusFxqd", {
                        params: {oid: row.oid}
                    })
                        .then(result => {
                            this.$message.success("删除成功");
                            this.$refs.vxetable.remove(row);
                        })
                        .catch(error => {
                            console.log(error)
                            this.$message.error("删除失败!" + error.msg);
                        })
                        .finally(_ => {

                        })

                });

            },
            // 获取列表数据
            getList() {
                this.vxeloading = true;
                let arr = [];
                this.columns1.forEach((c) => {
                    arr.push(c.code);
                })
                this.tablePage.columns = arr;
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("/pms/PmsFxqd/list", {params: this.tablePage})
                    .then(result => {
                        this.tableData = result.data.records;
                        this.tablePage.total = result.data.total;
                    })
                    .catch(error => {
                        this.$message.error("获取失败");
                    })
                    .finally(_ => {
                        this.vxeloading = false;
                    })
            },
            // 添加显示
            addFjVisible() {
                console.log(123)
                this.addFxVisible = true;
                this.$nextTick(() => {
                    this.$refs.formbd.resetFields();
                    this.getCode();
                })
            },
            // 分页点击
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.current = currentPage
                this.tablePage.size = pageSize
                this.getList();
            },
            // 刷新
            refresh() {
                this.getList();
            },
            // 导入显示
            handleImportShow() {
                console.log(123)
                this.visibleImport = true;
            },
            // 导出数据
            exportDataEvent() {
                this.exportSelectorShow = true
                return
                this.$refs.vxetable.exportData({type: 'csv', filename: '风险清单'})
            },
            // 上传成功后回调
            uploadSuccess() {
                this.visibleImport = false;
                this.refresh();
            },


        }
    }
</script>

<style lang="less" scoped>
    .btns {
        margin: 0px 0;
        padding: 0 0;
        .right {
            float: right;
        }
        .left {
            overflow: hidden;
            margin-right: 420px;
        }
    }

    .formBox /deep/ input {
        transition: all 1s;
    }

    .formBox /deep/ .red input {
        background: red;
        color: #fff;
    }

    .formBox /deep/ .blue input {
        background: blue;
        color: #fff;
    }

    .formBox /deep/ .orange input {
        background: orange;
        color: #fff;
    }

    .formBox /deep/ .yellow input {
        background: yellow;
        color: #fff;
    }

    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;
        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>