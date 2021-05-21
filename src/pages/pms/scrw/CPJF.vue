<template>
    <div class="ice-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="产品交付管理" name="first"></el-tab-pane>
            <el-tab-pane label="试验参试任务" name="second"></el-tab-pane>
        </el-tabs>
        <div class="btns">
            <div class="right">
                <search-input :query="query" @search="search" v-show="activeName=='first'"></search-input>

                <search-input :query="queryCs" @search="searchCs" v-show="activeName=='second'"></search-input>
            </div>
            <div class="left">
                <el-button type="success" @click="refresh"><i class="el-icon-refresh-right"></i>刷新</el-button>

                <el-button type="primary" @click="addItem"><i class="el-icon-plus"></i>添加</el-button>
            </div>
        </div>
        <div class="vxe-full-main">
            <div class="vxe-full-container">
                <!--产品交付管理-->
                <vxe-table
                        v-show="activeName=='first'"
                        v-loading="vxeloading"
                        resizable
                        show-header-overflow
                        highlight-hover-row
                        :sync-resize="activeName"
                        :align="allAlign"
                        border
                        height="100%"
                        align='center'
                        class="vxe"
                        ref="vxetable"
                        @toggle-row-expand="getRow"
                        :data="tableData">
                    <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                    <vxe-table-column type="expand" width="60">
                        <template v-slot:content="{ row, rowIndex }">
                            <div style="width: 80%;" v-loading="loading">
                                <ice-query-grid :gridData="row.productData?row.productData:[]"
                                                title="交付产品"
                                                ref="insideGrid"
                                                :columns="product.columns"
                                                :minHeight="iceHeight"
                                                :mesHeight="false"
                                                :pagination=false
                                >
                                </ice-query-grid>
                            </div>

                        </template>
                    </vxe-table-column>
                    <vxe-table-column show-overflow="title" v-for="(item, index) in outerColumns" :key="index"
                                      :col="item"
                                      is="qis-vxe-columns"></vxe-table-column>
                    <vxe-table-column fixed="right" title="操作" width="250">
                        <template v-slot="{ row, rowIndex, }">
                            <el-button type="text" @click="edit(row)">编辑</el-button>
                            <el-button type="text" @click="handledelete(row)">删除</el-button>
                            <el-button type="text" @click="handleZx(row, 1)">装箱</el-button>
                            <el-button type="text" @click="handleDb(row, 2, true)"
                                       v-if="(row.dbzt>=1)">调拨
                            </el-button>
                            <el-button type="text" @click="handleDb(row, 1, true)" v-if="row.dbzt>=2">收货
                            </el-button>
                            <el-button type="text" @click="showDetail(row)">详情</el-button>
                        </template>
                    </vxe-table-column>
                </vxe-table>
                <!--试验参试任务 列表-->
                <vxe-table
                        v-show="activeName=='second'"
                        v-loading="vxeloadingCs"
                        resizable
                        auto-resize
                        :align="allAlign"
                        :sync-resize="activeName"
                        border
                        height="100%"
                        align='center'
                        class="vxe"
                        @toggle-row-expand="getRowCs"
                        :data="tableDatacy">
                    <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                    <vxe-table-column type="expand" width="60">
                        <template v-slot:content="{ row, rowIndex }">
                            <div style="width: 80%;" v-loading="loading">
                                <ice-query-grid :gridData="row.productData?row.productData:[]"
                                                title="参试产品"
                                                ref="insideGrid"
                                                :columns="columnsCp"
                                                :minHeight="iceHeight"
                                                :operations="operationsCs"
                                                :mesHeight="false"
                                                :pagination=false
                                >
                                </ice-query-grid>
                            </div>

                        </template>
                    </vxe-table-column>
                    <vxe-table-column v-for="(item, index) in scColumns" :key="index" :col="item"
                                      is="qis-vxe-columns"></vxe-table-column>
                    <vxe-table-column fixed="right" title="操作" width="250">
                        <template v-slot="{ row, rowIndex, }">
                            <el-button type="text" @click="editCs(row)">编辑</el-button>
                            <el-button type="text" @click="handledeleteCs(row)">删除</el-button>
                            <el-button type="text" @click="handleZx(row)">装箱</el-button>
                            <el-button type="text" @click="handleDb(row, 2)"
                                       v-if="(row.dbzt>=1)">调拨
                            </el-button>
                            <el-button type="text" @click="handleDb(row, 1)" v-if="row.dbzt>=2">收货
                            </el-button>
                            <!--<el-button type="text" @click="editCs(row)" v-if="row.spzt!='SPZT10'">流程</el-button>-->
                            <el-button type="text" @click="csjlDetail(row)">详情</el-button>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </div>
        </div>

        <vxe-pager
                v-show="activeName=='first'"
                perfect
                :loading="loading"
                size="mini"
                :current-page="tablePage.current"
                :page-size="tablePage.size"
                :total="tablePage.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="data=>{handlePageChange(data[0])}">
        </vxe-pager>
        <vxe-pager
                v-show="activeName=='second'"
                perfect
                :loading="loading"
                size="mini"
                :current-page="tablePageCs.current"
                :page-size="tablePageCs.size"
                :total="tablePageCs.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="data=>{handlePageChangeCs(data[0])}">
        </vxe-pager>
        <el-dialog v-dialogDrag title="产品调拨单" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="grid-container" v-loading="loadingDb">
                <el-tabs>
                    <el-tab-pane label="调拨单信息">
                        <el-form :v-loading="loading" :model="formModelDb" status-icon :rules="rules" ref="definition"
                                 label-width="140px">
                            <!--第一行-->
                            <el-row :gutter="20">
                                <!--<el-col :span="12">-->
                                <!--<el-form-item label="调出单位" label-width="110px" prop="xmcode">-->
                                <!--<ice-dept-selector  chooseItem="single" mode="onlySelect"-->
                                <!--v-model="formModelDb.cpDcdwName"-->
                                <!--@select-confirm="depts=>formModel.cpDcdwCode=depts[0].deptCode">-->
                                <!--</ice-dept-selector>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->
                                <el-col :span="12">
                                    <el-form-item label="调拨单位" label-width="110px" prop="cpDbdwName">
                                        <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                           :mode="DbDisabled?'readonly':'onlySelect'"
                                                           v-model="formModelDb.cpDbdwName"
                                                           @select-confirm="depts=>formModelDb.cpDbdwCode=depts[0].deptCode">
                                        </ice-dept-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="调出时间" label-width="110px" prop="dbdDate">
                                        <el-date-picker v-model="formModelDb.dbdDate" type="date" placeholder="请选择"
                                                        :disabled="DbDisabled"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">

                                <el-col :span="12">
                                    <el-form-item label="经办人" label-width="110px" prop="jbrName">
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="DbDisabled?'readonly':'onlySelect'"
                                                              v-model="formModelDb.jbrName"
                                                              @select-confirm="depts=>formModelDb.xmbzrCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="领货人" label-width="110px" prop="lhrName">
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="DbDisabled?'readonly':'onlySelect'"
                                                              v-model="formModelDb.lhrName"
                                                              @select-confirm="depts=>formModelDb.xmbzrCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                        <ice-select :control-mj="controlMj" :disabled="DbDisabled"
                                                    v-model="formModelDb.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="批准人" label-width="110px" prop="pzrName">
                                        <ice-persion-selector chooseItem="single"
                                                              :mode="DbDisabled?'readonly':'onlySelect'"
                                                              v-model="formModelDb.pzrName"
                                                              @select-confirm="depts=>formModelDb.pzrCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                        </el-form>
                    </el-tab-pane>
                </el-tabs>

                <el-tabs v-if="dbRow.dbzt>=2&&dbshZt==1">
                    <el-tab-pane label="收货信息">
                        <el-form :v-loading="loading" :model="shForm" status-icon :rules="shRules" ref="definition1"
                                 label-width="140px">
                            <!--第一行-->
                            <el-row :gutter="20">

                                <el-col :span="12">
                                    <el-form-item label="收货人" label-width="110px" prop="shrName">
                                        <el-input v-model="shForm.shrName"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="收货时间" label-width="110px" prop="shDate">
                                        <el-date-picker v-model="shForm.shDate" type="date" placeholder="请选择"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">

                                <el-col :span="12">
                                    <el-form-item label="收货单位" label-width="110px" prop="shdw">
                                        <el-input v-model="shForm.shdw"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系方式" label-width="110px" prop="shrTell">
                                        <el-input v-model="shForm.shrTell"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="收货证明" label-width="110px" prop="shzmDataid">
                                        <ice-single-upload v-model="shForm.shzmDataid"
                                                           :control-mj="formModelDb.dataSecretLevcode?[formModelDb.dataSecretLevcode]:[]"
                                                           :on-success="fileUploadSuccess"
                                                           @fileData="fileData"
                                                           :do-secret="true" ref="fileUpload"></ice-single-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs>
                    <el-tab-pane label="调拨清单">
                        <vxe-table
                                v-loading="vxeloading"
                                resizable
                                :align="allAlign"
                                show-overflow="title"
                                border
                                height="300"
                                align='center'
                                class="vxe"
                                :edit-config="{trigger: 'click', mode: 'row'}"
                                ref="cpDbTable"
                                :data='dbTableData'>
                            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                            <vxe-table-column field="cpName" title="名称"></vxe-table-column>
                            <vxe-table-column field="cpCode" title="图号"></vxe-table-column>
                            <vxe-table-column field="cpUnit" title="单位"></vxe-table-column>
                            <vxe-table-column field="cpNum" title="数量"></vxe-table-column>
                            <vxe-table-column field="sydwName" title="使用单位" width="150">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input v-model="row.sydwName" :disabled="DbDisabled"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="remark" title="备注" width="200">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input v-model="row.remark" :disabled="DbDisabled"></el-input>
                                </template>
                            </vxe-table-column>
                        </vxe-table>
                    </el-tab-pane>
                </el-tabs>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="saveDb"
                               v-if="(formModelDb.dbzt==1||formModelDb.dbzt==null||formModelDb.dbzt==2)&&dbshZt==2">确 定
                    </el-button>
                    <el-button type="primary" @click="saveSh" v-if="formModelDb.dbzt>=2&&dbshZt==1">确认收货</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="产品装箱清单" custom-class="ice-dialog" center :visible.sync="dialogVisibleZx"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="grid-container" v-loading="loadingDb">
                <el-tabs>
                    <el-tab-pane label="装箱信息">
                        <el-form :v-loading="loading" :model="formModelZx" status-icon :rules="rulesZx" ref="formZx"
                                 label-width="140px">
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="包装箱名称" label-width="110px" prop="boxName">
                                        <el-input v-model="formModelZx.boxName" :disabled="dbRow.dbzt>=2"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="包装箱编号" label-width="110px" prop="boxCode">
                                        <el-input v-model="formModelZx.boxCode" :disabled="dbRow.dbzt>=2"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">

                                <el-col :span="12">
                                    <el-form-item label="生产单位代表" label-width="110px" prop="dwdbName">
                                        <el-input v-model="formModelZx.dwdbName" :disabled="dbRow.dbzt>=2"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="军代表" label-width="110px" prop="jdbName">
                                        <el-input v-model="formModelZx.jdbName" :disabled="dbRow.dbzt>=2"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="接收部队代表" label-width="110px" prop="bddbName">
                                        <el-input v-model="formModelZx.bddbName" :disabled="dbRow.dbzt>=2"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                        <ice-select :control-mj="controlMj" :disabled="dbRow.dbzt>=2"
                                                    v-model="formModelZx.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--第一行-->
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="装箱日期" label-width="110px" prop="zxdDate">
                                        <!--<el-date-picker :disabled="dbRow.dbzt>=2" v-model="formModelZx.zxdDate"-->
                                        <!--type="date"-->
                                        <!--placeholder="请选择"></el-date-picker>-->
                                        <el-date-picker
                                                :disabled="dbRow.dbzt>=2" v-model="formModelZx.zxdDate"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs>
                    <el-tab-pane label="产品包装箱清单">
                        <vxe-table
                                v-loading="vxeloading"
                                resizable
                                :align="allAlign"
                                border
                                height="300"
                                show-overflow="title"
                                show-header-overflow="tooltip"
                                align='center'
                                class="vxe"
                                :edit-config="{trigger: 'click', mode: 'row'}"
                                ref="zxTableList"
                                :data='dbTableDataZx'>
                            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                            <vxe-table-column field="cpName" title="零部件名称"></vxe-table-column>
                            <vxe-table-column field="cpCode" title="图号或规格、代号" width="150"></vxe-table-column>
                            <vxe-table-column field="cpCode" title="产品编码"></vxe-table-column>
                            <vxe-table-column field="cpNum" title="数量"></vxe-table-column>
                            <vxe-table-column field="cpUnit" title="单位"></vxe-table-column>
                            <vxe-table-column field="cpBazj" title="被安装件" width="100">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input v-model="row.cpBazj" :disabled="dbRow.dbzt>=2"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="cpDxh" title="袋序号" width="100">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input :disabled="dbRow.dbzt>=2" v-model="row.cpDxh"></el-input>
                                </template>
                            </vxe-table-column>
                            <vxe-table-column field="remark" title="备注" width="200">
                                <template v-slot="{ row, rowIndex, columnIndex }">
                                    <el-input :disabled="dbRow.dbzt>=2" v-model="row.remark"></el-input>
                                </template>
                            </vxe-table-column>
                        </vxe-table>
                    </el-tab-pane>
                </el-tabs>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="handleprint">打 印</el-button>
                    <el-button type="primary" @click="saveZx" v-if="dbRow.dbzt<=1">确 定</el-button>
                    <el-button type="info" @click="closeDialogZx">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <!--参试记录-->
        <el-dialog v-dialogDrag title="参试记录" custom-class="ice-dialog" center :visible.sync="dialogVisiblecsjl"
                   width="800px" append-to-body :close-on-click-modal="false">
            <el-form ref="form" v-loading="loadingcs">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="任务名称：" label-width="140px" prop="sycsName">
                            <el-input disabled v-model="csjldata.sycsName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目名称：" label-width="140px" prop="sycsCode">
                            <el-input disabled v-model="csjldata.xmName"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="参试时间：" label-width="140px" prop="xmName">
                            <el-date-picker v-model="csjldata.sycsDate" type="date" placeholder="请选择"
                                            disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="参试地点：" label-width="140px" prop="sycsCode">
                            <el-input disabled v-model="csjldata.sycsPlace"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="产品名称：" label-width="140px" prop="xmName">
                            <el-input disabled v-model="csjldata.cpName"></el-input>

                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="在制品编号：" label-width="140px" prop="sycsCode">
                            <el-input disabled v-model="csjldata.cpCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="产品密级：" label-width="140px" prop="xmName">
                            <ice-select disabled v-model="csjldata.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="记录人：" label-width="140px" prop="createName">
                            <el-input disabled v-model="csjldata.createName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="记录时间：" label-width="140px" prop="createDate">
                            <el-date-picker v-model="csjldata.createDate" type="date" placeholder="请选择"
                                            disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="参试记录过程：" label-width="140px" prop="xmName">
                            <el-input v-model="csjldata.sycsLog" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit type="textarea" :rows="5"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="saveCsjl">确认</el-button>
                    <el-button type="info" @click="dialogVisiblecsjl=false">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--交付计划详情-->
        <cpjh-model ref="cpjhDetail" :toFlow="toFlow"></cpjh-model>
        <!--试验详情-->
        <csjl-model ref="csjlDetail" :toFlow="editCs"></csjl-model>
    </div>
</template>
<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import qisVxeColumns from '../../basePage/VxeColumns';
    import searchInput from "../../qis/zlycbh/searchInput"
    import IceSelect from "@/components/common/base/IceSelect";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import {mapGetters, mapMutations} from 'vuex'
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import {validatePassTel} from "../../../utils/validator"
    import CpjhModel from "../detail/CpjhModel"
    import CsjlModel from "../detail/CsjlModel"

    export default {
        name: "AntPreFirIde",
        components: {
            IceQueryGrid,
            qisVxeColumns,
            searchInput,
            IcePersionSelector,
            IceSelect,
            ATTACHMENT,
            IceDeptSelector,
            IceSingleUpload,
            CpjhModel,
            CsjlModel
        },
        data() {
            return {
                dialogVisiblecsjl: false,
                activeName: 'first',
                // 产品调拨
                dialogVisible: false,
                loadingDb: false,
                formModelDb: {
                    cpDcdwName: '三所', //调出单位
                    cpDcdwCode: '90-03', //产品调出单位编号
                    cpDbdwName: null, //产品调拨单位名称
                    cpDbdwCode: '', //产品调拨单位编号
                    dbdDate: null, //调拨单日期
                    jbrName: '', //经办人姓名
                    lhrName: '', //领货人姓名
                    shrName: null, //收货人姓名
                    jfjhId: '', //产品交付计划ID
                    deleteStatus: '', //删除状态
                    dataSecretLevcode: '', //密级
                    pmsJfjhDbdCpVoList: [], //调拨单明细
                    pzrName: ''
                },
                // 收货form
                shForm: {
                    shDate: null,
                    shrName: null,
                    shdw: "",
                    shrTell: "",
                    shzm: "",
                    shzmDataid: "",
                    xtFj: {},
                    oidJfjh: ""
                },
                shRules: {
                    shDate: [{required: true, message: '收货时间', trigger: 'change'}],
                    shrName: [{required: true, message: '收货人', trigger: 'blur'}],
                    shdw: [{required: true, message: '收货单位', trigger: 'blur'}],
                    shzm: [{required: true, message: '选择收货证明', trigger: 'blur'}],
                    shrTell: [
                        {required: true, message: '请输入电话', trigger: 'blur'},
                        {validator: validatePassTel, trigger: 'blur'}
                    ],
                },
                rules: {
                    cpDbdwName: [{required: true, message: '请选择调拨单位', trigger: 'change'}],
                    dbdDate: [{required: true, message: '调出日期', trigger: 'change'}],
                    dataSecretLevcode: [{required: true, message: '密级', trigger: 'change'}],
                },

                // 产品装箱清单
                // private String oid;
                formModelZx: {
                    oid: '',
                    boxName: '',
                    boxCode: '',
                    dwdbName: '',
                    jdbName: '',
                    bddbName: '',
                    zxdDate: null,
                    jfjhId: '',
                    deleteStatus: '',
                    dataSecretLevcode: '',
                    pmsJfjhZxdCpVoList: '',
                },
                dialogVisibleZx: false,
                dbTableDataZx: [],
                rulesZx: {
                    boxName: [{required: true, message: '包装箱名称', trigger: 'blur'}],
                    boxCode: [{required: true, message: '包装箱编码', trigger: 'blur'}],
                    dwdbName: [{required: true, message: '生产代表', trigger: 'blur'}],
                    zxdDate: [{required: true, message: '日期', trigger: 'change'}],
                    dataSecretLevcode: [{required: true, message: '密级', trigger: 'change'}],
                },
                dbTableData: [],


                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditions: [],
                    conditionLink: 'OR',
                    staticConditions: []
                },
                tablePageCs: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditions: [],
                    conditionLink: 'OR'
                },
                allAlign: [],
                tableData: [],
                loading: false,

                iceHeight: 300,
                queryModel: "normal",
                multipleSelection: [],
                outerQuery: [
                    {type: 'input', label: '计划名称', code: 'planName', value: "", exp: "like"},
                    {type: 'input', label: '计划编号', code: 'planCode', value: ""},
                    {type: 'input', label: '产品名称', code: 'productName', value: "", exp: "like"}
                ],
                //查询
                query: [
                    {type: 'input', code: 'jfjhCode', label: '交付计划号', value: ''},
                    {type: 'input', code: 'cpjfPlace', label: '交付地点', value: ''},
                    {type: 'date', code: 'cpjfDate', label: '交付时间', value: ''},
                    {type: 'input', code: 'zlwj', label: '质量文件', value: ''},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'input', code: 'cars', label: '车辆', value: ''},
                    // {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    // {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                outerColumns: [
                    {code: 'oid', hidden: true},
                    {label: '交付计划号', code: 'jfjhCode', width: 150},
                    // {label: '交付数量', code: 'planCode', width: 200},
                    {label: '质量文件', code: 'zlwj', width: 100},
                    {label: '交付时间', code: 'cpjfDate', width: 150},
                    {label: '交付地点', code: 'cpjfPlace', width: 200},
                    {label: '联系人', code: 'contacts', width: 300},
                    {label: '车辆', code: 'cars', width: 300},
                    {
                        label: '密级',
                        code: 'dataSecretLevcode',
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    // {label: "上报状态", code: "sbzt", width: 100, sortable: true, mapTypeCode: 'SBZT'},
                    // {label: "审批状态", code: "spzt", width: 100, sortable: true, mapTypeCode: 'SPZT'},
                    {label: "调拨状态", code: "dbzt", width: 100, sortable: true, mapTypeCode: 'DBZT'},
                ],
                dialogVisible: false,
                attachmentData: {
                    oid: '',
                    name: '',
                    upTime: '',
                    attachmentType: '',
                    fileId: '',
                    dataSecretLevcode: '2',
                    planId: ''
                },
                formRules: {
                    name: [{required: true, message: '请输入附件名称', trigger: 'blur'}],
                    attachmentType: [{required: true, message: '请选择类型', trigger: 'blur'}],
                },
                tittle: '',
                selectRow: [],
                selectIDS: [],
                selected: false,  // 判断用户是否有
                visibleExpand: false,
                expandableRow: {},    // 展开时获取行数据
                vxeloading: false,
                vxeloadingCs: false,
                product: {
                    columns: [
                        {label: "oid", code: "oid", width: 100, hidden: true},
                        // {label: "工单ID", code: "workOrderId", width: 100, hidden: true},
                        {label: "在制品编码", code: "productCode", width: 210},
                        {label: "在制品名称", code: "productName"},
                        // {label: "质量卡编码", code: "qualityCardCode", width: 100},
                        // {label: "交接位置", code: "connectLocation", width: 100},
                        // {label: "最新位置", code: "newestLocation", width: 100},
                        // {label: "交接时间", code: "connectTime", width: 100},
                        // {label: "发生部门", code: "happenDept", width: 100},
                        // {label: "上一级产品ID", code: "parentId", width: 100},
                        {label: "完成时间", code: "createDate"},
                        // {label: "操作人", code: "operator", width: 100},
                        // {label: "交付计划ID", code: "jfjhId", width: 100},
                        {label: "产品编号", code: "cpCode"},
                        {label: "产品单位", code: "cpUnit"},
                    ]
                },
                requestData: [],
                // 参试任务
                queryCs: [
                    {type: 'input', code: 'sycsCode', label: '任务单编号', value: ''},
                    {type: 'input', code: 'sydwryName', label: '试验现场单位', value: ''},
                    {type: 'date', code: 'jfDate', label: '交付时间', value: ''},
                    {type: 'input', code: 'jfPlace', label: '交付地点', value: ''},
                    {type: 'date', code: 'syDate', label: '参试时间', value: ''},
                    {type: 'input', code: 'syPlace', label: '参试地点', value: ''},
                    {type: 'input', code: 'cslx', label: '交付类型', value: ''},
                    // {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    // {type: 'input', code: 'cars', label: '车辆',  value: ''},
                    // {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    // {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},
                ],
                scColumns: [
                    {label: "oid", code: "oid", width: 100, hidden: true},
                    // {label: "工单ID", code: "workOrderId", width: 100, hidden: true},
                    {label: "任务单编号", code: "sycsCode", width: 100},
                    {label: "主管部门", code: "xmDeptName", width: 100},
                    {
                        label: "项目主管", width: 100,
                        columns: [
                            {label: "姓名", code: "xmzgName", width: 100},
                            {label: "联系电话", code: "xmzgTell", width: 100},
                        ]
                    },
                    {
                        label: "试验现场单位", width: 100,
                        columns: [
                            {label: "人员", code: "sydwryName", width: 100},
                            {label: "联系电话", code: "sydwryTell", width: 100},
                        ]
                    },
                    {
                        label: "交付", width: 100,
                        columns: [
                            {label: "时间", code: "jfDate", width: 120},
                            {label: "地点", code: "jfPlace", width: 100},
                        ]
                    },
                    {
                        label: "参试", width: 100,
                        columns: [
                            {label: "时间", code: "syDate", width: 120},
                            {label: "地点", code: "syPlace", width: 100},
                        ]
                    },
                    {label: "交付类型", code: "cslx", width: 100},
                    {label: "备注", code: "dateRemark", width: 100},
                    {label: "调拨状态", code: "dbzt", width: 100, sortable: true, mapTypeCode: 'DBZT'},


                ],
                tableDatacy: [],

                columnsCp: [
                    {label: "oid", code: "oid", width: 100, hidden: true},
                    // {label: "工单ID", code: "workOrderId", width: 100, hidden: true},
                    {label: "在制品编码", code: "productCode", width: 220},
                    {label: "在制品名称", code: "productName", width: 100},
                    {label: "技术要求", code: "technicalRequirement", width: 100},
                    {label: "产品数量", code: "cpsl", width: 100},
                    {label: "产品单位", code: "cpUnit", width: 100},
                    {label: "产品密级", code: "dataSecretLevcode", width: 100, mapTypeCode: "DATA_SECRET_LEVEL"},
                    {label: "合格证", code: "certificate", width: 100},
                    {label: "目前位置", code: "location", width: 100},
                    {label: "备注", code: "dateRemark", width: 100},
                    // {label: "质量卡编码", code: "qualityCardCode", width: 100},
                    // {label: "交接位置", code: "connectLocation", width: 100},
                    // {label: "最新位置", code: "newestLocation", width: 100},
                    // {label: "交接时间", code: "connectTime", width: 100},
                    // {label: "发生部门", code: "happenDept", width: 100},
                    // {label: "上一级产品ID", code: "parentId", width: 100},
                    {label: "完成时间", code: "completionTime", width: 100, hidden: true},
                    // {label: "操作人", code: "operator", width: 100},
                    // {label: "交付计划ID", code: "jfjhId", width: 100},
                    {label: "产品编号", code: "cpCode", width: 100, hidden: true},

                ],
                //定义行的编辑,项目结转
                operationsCs: [
                    {
                        name: '参试记录', callback: this.csjl, ctrlCode: "BBJ"
                    },
                ],
                csjldata: {
                    sycsLog: ''
                },
                loadingcs: false,
                scrow: {},

                // 调拨数据
                dbRow: {},
                dbshZt: 1,
                // 判定是交付计划还是试验件
                isJfjh: true

            }
        },
        computed: {
            controlMj() {
                return this.dbRow.dataSecretLevcode ? [this.dbRow.dataSecretLevcode] : []
            },
            datamap() {
                // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
                return this.getDataMap()("DATA_SECRET_LEVEL");
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
            staticQuerysCs() {
                let arr = this.queryCs.filter(item => item.type == "static")
                return arr.map(c => {
                    return {
                        column: c.code,
                        exp: c.exp,
                        value: typeof c.value == "function" ? c.value() : c.value
                    }
                });
            },
            DbDisabled() {
                return this.dbRow.dbzt > 2 || this.dbshZt == 1
            }

        },
        created() {
            this.getList();
            this.getsyRw();
            this.addUndoTypeCodes('DATA_SECRET_LEVEL');
        },
        methods: {
            // 展示详情
            showDetail(row) {
                this.$refs.cpjhDetail.getDetail(row.oid)
            },
            // 参试记录详情
            csjlDetail(row) {
                this.$refs.csjlDetail.getDetail(row.oid)
            },

            // 打印
            handleprint() {
                this.loadingDb = true;
                let obj = {};
                if (this.isJfjh) {
                    obj = {
                        oidjfjh: this.dbRow.oid
                    }
                } else {
                    obj = {
                        oidsycs: this.dbRow.oid
                    }
                }
                this.$axios.get("/pms/PmsJfjhZxd/downloadDoc", {params: obj})
                    .then(result => {

                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
                    .finally(_ => {
                        this.loadingDb = false
                    })

                // window.location.href = `/api/pms/PmsJfjhZxd/downloadDoc?oidjfjh=${this.dbRow.oid}`
                // // this.$router.replace(`/pms/PmsJfjhZxd/downloadDoc?oidjfjh=${this.dbRow.oid}");
                // this.loading = false;

            },
            fileData(data) {
                console.log(data)
            },
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let dataSecretLevcode = response.securityLevel;
                let record = {
                    filename: file.name,
                    fileSize: file.size,
                    dataid: fileId,
                    dataSecretLevcode: dataSecretLevcode
                };
                this.shForm.shzm = file.name;
                this.shForm.shzmDataid = fileId;
                this.shForm.xtFj = record;
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            // 参试记录
            csjl(row) {
                this.$axios.get("/pms/PmsSycsCpLog/getByOidJfjhCp", {params: {oidJfjhCp: row.oid}})
                    .then(result => {
                        this.csjldata = result.data;
                        this.scrow = row;
                        this.getUser();
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
                    .finally(_ => {
                        this.loading = false
                    })

                this.dialogVisiblecsjl = true;

            },
            // 获取用户信息
            getUser() {
                if (!this.csjldata.createUser) {
                    return;
                }
                this.$axios.get("/permission/user/get_employee_users", {params: {userCodes: this.csjldata.createUser}})
                    .then(result => {
                        if (result.data.length > 0) {
                            this.csjldata = {...this.csjldata, ...{createName: result.data[0].name}};

                        }
                        console.log(this.csjldata, 'this.csjldata')
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            // 保存产品参试
            saveCsjl() {
                console.log(this.csrow)
                this.csjldata.oidJfjhCp = this.scrow.oid;
                this.csjldata.cpCode = this.scrow.productCode;
                this.loadingcs = true;
                this.$axios.post("/pms/PmsSycsCpLog/saveOrUpdate", this.csjldata)
                    .then(result => {
                        this.$message.success('保存成功');

                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
                    .finally(_ => {
                        this.dialogVisiblecsjl = false;
                    })
            },
            handleClick() {
                this.$nextTick(_ => {
                    console.log(this.$refs.vxetable, this.tableData)
                    if (this.$refs.vxetable) {
                        console.log("进入");
                        this.$refs.vxetable.recalculate();
                    }

                })
            },
            toFlow(row) {
                this.$router.push('/pms/scrw/cpjf_flow?dataId=' + row.oid)
            },
            //选中一行进行删除
            handledelete(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    // return
                    this.$axios.delete("/pms/PmsJfjh/del", {params: {oid: row.oid}})
                        .then(result => {
                            this.$message.success('删除成功！')
                            this.refresh();
                        })
                        .catch(error => {
                            this.$message.error(fail)
                        })
                        .finally(_ => {
                            this.loading = false
                        })

                })
            },
            handledeleteCs(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    // return
                    this.$axios.delete("/pms/PmsSycs/del", {params: {oidSycs: row.oid}})
                        .then(result => {
                            this.$message.success('删除成功！')
                            this.refresh();
                        })
                        .catch(error => {
                            this.$message.error(fail)
                        })
                        .finally(_ => {
                            this.loading = false
                        })

                })
            },
            // 获取交付产品
            getProductList(row, rowIndex) {
                if (row.productData) {
                    return
                }
                this.loading = true;
                this.$axios.get("/pms/PmsJfjhCp/cpListByOidJfjh", {params: {oidJfjh: row.oid}})
                    .then(result => {
                        console.log(result.data, 'data')
                        row.productData = result.data;
                        this.tableData.splice(rowIndex, 1, row);
                        this.loading = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            getProductListCs(row, rowIndex) {
                if (row.productData) {
                    return
                }
                this.loading = true;
                this.$axios.get("/pms/PmsJfjhCp/cpListByOidSycs", {params: {oidSycs: row.oid}})
                    .then(result => {
                        console.log(result.data, 'data')
                        row.productData = result.data;
                        this.tableDatacy.splice(rowIndex, 1, row);
                        this.loading = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            addItem() {
                if (this.activeName == 'first') {
                    this.$router.push('/pms/scrw/cpjf_flow');
                } else {
                    this.$router.push('/pms/scrw/sycs_flow');
                }

            },
            edit(row) {
                this.$router.push({
                    path: '/pms/scrw/cpjf_flow', query: {
                        dataId: row.oid
                    }
                })
            },
            editCs(row) {
                this.$router.push({
                    path: '/pms/scrw/sycs_flow', query: {
                        dataId: row.oid
                    }
                })
            },
            search(data) {
                // this.query.map(item => item.value = selectText ? selectText : '');
                console.log(data)
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.refresh();
            },
            searchCs(data) {
                this.tablePageCs.conditionLink = data.conditionLink;
                this.tablePageCs.conditions = data.conditions;
                this.tablePageCs.staticConditions = data.staticConditions;
                this.refresh();
            },
            refresh() {

                if (this.activeName == "first") {
                    this.getList();
                } else {
                    this.getsyRw();
                }

            },
            getRow({row, expanded, rowIndex}) {
                this.getProductList(row, rowIndex);
            },
            getRowCs({row, expanded, rowIndex}) {
                this.getProductListCs(row, rowIndex);
            },
            closeDialog() {
                this.dialogVisible = false;
                this.$refs.definition.resetFields();
            },
            // 请求数据
            getCol(data) {
                data.forEach((c) => {
                    if (c.columns && c.columns.length > 0) {
                        this.getCol(c.columns);
                    } else {
                        this.requestData.push(c.code);
                    }
                })
            },
            getList() {
                this.vxeloading = true;
                this.requestData = [];
                this.getCol(this.outerColumns);
                this.tablePage.columns = this.requestData;
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("/pms/PmsJfjh/list", {params: this.tablePage})
                    .then(result => {
                        this.tableData = result.data.records;
                        this.tablePage.total = result.data.total;
                        this.vxeloading = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            // 获取试验任务
            getsyRw() {
                this.vxeloadingCs = true;
                this.requestData = [];
                this.getCol(this.scColumns);

                this.tablePageCs.columns = this.requestData;
                this.tablePageCs.staticConditions = this.staticQuerysCs;
                this.$axios.get("/pms/PmsSycs/list", {params: this.tablePageCs})
                    .then(result => {
                        this.tableDatacy = result.data.records;
                        this.tablePageCs.total = result.data.total;
                        this.vxeloadingCs = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            handlePageChange({currentPage, pageSize}) {
                this.tablePageCs.current = currentPage;
                this.tablePageCs.size = pageSize;
                this.refresh();
            },
            handlePageChangeCs({currentPage, pageSize}) {
                this.tablePage.current = currentPage;
                this.tablePage.size = pageSize;
                this.getsyRw();
            },
            //  调拨
            handleDb(row, type, isJhjh) {
                let obj = {};
                if (isJhjh) {
                    obj = {
                        url: '/pms/PmsJfjhDbd/dbdInfoByOidjfjh',
                        parm: {
                            oidjfjh: row.oid
                        }
                    }
                    this.isJfjh = true;
                } else {
                    obj = {
                        url: '/pms/PmsJfjhDbd/dbdInfoByOidsycs',
                        parm: {
                            oidsycs: row.oid

                        }
                    }
                    this.isJfjh = false;
                }
                this.dbshZt = type;
                // 计划赋值
                this.dialogVisible = true;
                this.formModelDb.jfjhId = row.oid;
                this.shForm.oidJfjh = row.oid;
                this.dbRow = row;
                // /pms/PmsJfjhDbd/dbdInfoByOidjfjh
                this.$axios.get(obj.url, {params: obj.parm})
                    .then(result => {
                        this.dbTableData = result.data.pmsJfjhDbdCpVoList;
                        this.formModelDb = result.data;
                        if (isJhjh) {
                            this.formModelDb.jfjhId = row.oid;
                            this.formModelDb.sycsId = null;
                        } else {
                            this.formModelDb.jfjhId = null;
                            this.formModelDb.sycsId = row.oid;

                        }
                        this.shForm.shDate = result.data.shDate;
                        this.shForm.shrName = result.data.shrName;
                        this.shForm.shzmDataid = result.data.shzmDataid;
                        this.shForm.shzm = result.data.shzm;
                        this.shForm.shdw = result.data.shdw;
                        this.shForm.shrTell = result.data.shrTell;
                    })
                    .catch(error => {
                        this.$message.error('获取调拨数据失败!')
                    })
                    .finally(_ => {

                    })
            },
            // 调拨确定
            saveDb() {
                this.$refs.definition.validate(validate => {
                    if (validate) {
                        this.loadingDb = true;
                        let tabledata = this.$refs.cpDbTable.getTableData().visibleData;
                        tabledata.map((c) => {
                            c.dataSecretLevcode = this.formModelDb.dataSecretLevcode;
                        });
                        this.formModelDb.pmsJfjhDbdCpVoList = tabledata
                        console.log(this.formModelDb)
                        this.$axios.post("/pms/PmsJfjhDbd/saveOrUpdate", this.formModelDb)
                            .then(result => {
                                this.$message.success('保存成功');
                                this.dialogVisible = false;
                                this.refresh();
                            })
                            .catch(error => {
                                this.$message.error('保存失败!')
                            })
                            .finally(_ => {
                                this.loadingDb = false;
                            })
                    }
                })

            },
            // 确认收货
            saveSh() {
                this.shForm.oid = this.formModelDb.oid;
                this.$refs.definition1.validate(validate => {
                    if (validate) {
                        this.loadingDb = true;
                        console.log(this.formModelDb)
                        this.$axios.post("/pms/PmsJfjhDbd/confirm", this.shForm)
                            .then(result => {
                                this.$message.success('保存成功');
                                this.dialogVisible = false;
                                // this.$refs.vxetable.refresh();
                            })
                            .catch(error => {
                                this.$message.error('保存失败!')
                            })
                            .finally(_ => {
                                this.loadingDb = false;
                            })
                    }
                })

            },
            closeDialogZx() {
                this.dialogVisibleZx = false;
            },
            //  装箱
            handleZx(row, type) {
                this.dialogVisibleZx = true;
                this.loadingDb = true;
                this.dbRow = row;
                let obj = {};
                if (type) {
                    obj = {
                        url: '/pms/PmsJfjhZxd/zxdInfoByOidjfjh',
                        parm: {
                            oidjfjh: row.oid
                        }
                    }
                    this.isJfjh = true;
                } else {
                    obj = {
                        url: '/pms/PmsJfjhZxd/zxdInfoByOidsycs',
                        parm: {
                            oidsycs: row.oid

                        }
                    }
                    this.isJfjh = false;
                }

                this.$axios.get(obj.url, {params: obj.parm})
                    .then(result => {
                        console.log(result.data,'result')
                        this.loadingDb = false;
                        this.dbTableDataZx = result.data.pmsJfjhZxdCpVoList;
                        this.formModelZx = result.data;
                        if (type) {
                            this.formModelZx.jfjhId = row.oid;
                            this.formModelZx.sycsId = null;
                        } else {
                            this.formModelZx.jfjhId = null;
                            this.formModelZx.sycsId = row.oid;

                        }
                        console.log(this.formModelZx, 'ZX')
                    })
                    .catch(error => {
                        this.$message.error('获取装箱清单数据失败!')
                    })
                    .finally(_ => {

                    })
            },
            // 装箱确定
            saveZx() {
                this.$refs.formZx.validate(validate => {
                    if (validate) {
                        this.loadingDb = true;
                        let tabledata = this.$refs.zxTableList.getTableData().visibleData;
                        tabledata.map((c) => {
                            c.dataSecretLevcode = this.formModelZx.dataSecretLevcode;
                        });
                        this.formModelZx.pmsJfjhZxdCpVoList = tabledata
                        console.log(this.formModelZx)
                        this.$axios.post("/pms/PmsJfjhZxd/saveOrUpdate", this.formModelZx)
                            .then(result => {
                                this.$message.success('保存成功');
                                this.dialogVisibleZx = false;
                            })
                            .catch(error => {
                                this.$message.error('保存失败!')
                            })
                            .finally(_ => {
                                this.loadingDb = false;
                            })
                    }
                })

            },


        },
        watch: {
            $route(New, old) {
                if (New.path === '/pms/scrw/cpjf' && old.path === '/pms/scrw/cpjf_flow') {
                    this.refresh();
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .btns {
        padding: 10px 15px;

        .right {
            float: right;
        }

        .btn {
            margin-right: 10px;
        }
    }

    .vxe {
        flex-grow: 1;
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
