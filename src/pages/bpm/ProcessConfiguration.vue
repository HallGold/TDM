<template>
    <div class="processConfig" style="width: 100%">
        <el-container style="width: 100%;height: 100%;box-sizing: border-box">
            <div class="container" style="width: 100%;height: 100%;box-sizing: border-box">
                <el-tabs v-model="message" :stretch=true style="font-size: 14px" class="full-content" @tab-click="handleClick">
                    <el-tab-pane :label="`基础信息`" class="table-panel" :show-header="false" name="first">
                        <div class="el-button-group" style="float: right;padding-bottom: 10px;padding-right: 10%;">
                            <div>
                                <el-button type="primary" @click="configureCopyVisible = true">配置拷贝</el-button>
                                <!--<el-button type="primary">缓存清理</el-button>-->
                                <el-button type="success" @click="saveDef">保存</el-button>
                                <el-button type="danger" @click="returnUper">返回</el-button>

                            </div>

                            <ice-dialog title="数据拷贝选择" :visible.sync="configureCopyVisible" width="800px">
                                <div class="ice-container">
                                    <el-form label-width="40px">
                                        <ice-grid-layout name="数据拷贝信息" :columns="1" gutter="0px" :expandable="false">
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item>
                                                        <el-checkbox-group v-model="configureCopyForm.copyItems">
                                                            <el-checkbox label="bpmDefinition">基础信息</el-checkbox>
                                                            <el-checkbox label="bpmDefRefBiz">流程关联业务</el-checkbox>
                                                            <el-checkbox label="bpmNodeSet">环节属性</el-checkbox>
                                                            <el-checkbox label="bpmSignType">流程会签</el-checkbox>
                                                            <el-checkbox label="bpmNodeUserSet">环节人员</el-checkbox>
                                                            <el-checkbox label="buttonACL" class="chec">按钮管理</el-checkbox>
                                                            <el-checkbox label="nodeButtonExt">按钮附加属性</el-checkbox>
                                                            <el-checkbox label="bpmTaskMsg">环节消息</el-checkbox>
                                                        </el-checkbox-group>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item label="版本" style="margin-left: 40px;">
                                                        <el-select v-model="configureCopyForm.copyVersionNo" placeholder="请选择">
                                                            <el-option
                                                                    v-for="item in tableHistoryData"
                                                                    :key="item.oid"
                                                                    :label="item.bpmDefName+'  版本'+item.versionNo"
                                                                    :value="item.versionNo">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item>
                                                        <p style="color: red;font-size: 10px;">
                                                            拷贝功能会自动根据相同环节ID将指定的版本流程配置信息拷贝到当前的版本中。环节ID不匹配的不会拷贝。</p>
                                                        <p style="color: red;font-size: 10px;padding-right: 10px">
                                                            警告：只建议再流程刚发布新版后使用，此时所有的流程配置信息基本为空，从之前版本拷贝过来可省去大部分工作流。后期修改不建议使用！</p>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </ice-grid-layout>
                                    </el-form>
                                </div>
                                <div class="ice-button-bar" slot="footer">
                                    <el-button type="primary" @click="onSaveCopy">确 定</el-button>
                                    <el-button @click="configureCopyVisible = false">取 消</el-button>
                                </div>
                            </ice-dialog>

                        </div>
                        <el-form :model="definition" ref="definition" label-width="140px">
                            <ice-grid-layout :columns="4" name="基础信息">
                                <el-form-item label="流程类型" prop="typeDesc" >
                                    <el-input v-model="definition.typeDesc" :disabled="true" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="状态" prop="statusDes" >
                                    <el-input v-model="definition.statusDes" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="流程KEY" prop="actDefKey" >
                                    <el-input v-model="definition.actDefKey" :disabled="true"></el-input>
                                </el-form-item>

                                <el-form-item label="流程版本" prop="prossversion" >
                                    <el-input :disabled="true" v-model="definition.versionNo"></el-input>
                                </el-form-item>

                                <el-form-item label="流程名称" prop="bpmDefName" >
                                    <el-input v-model="definition.bpmDefName" ></el-input>
                                </el-form-item>


                                <el-form-item label="生效时间" prop="deadline" >
                                    <ice-date-picker
                                            min="day:0"
                                            v-model="definition.effectiveDate"
                                            type="date"
                                            placeholder="选择日期">
                                    </ice-date-picker>
                                    <!-- <span style="color: red"> 设定的生效时间（到生效时间才能启动）</span>-->
                                </el-form-item>
                                <el-form-item label="期限(单位分钟)" prop="effectiveDate" >
                                    <el-input-number v-model="definition.deadline" :min="0" label="描述文字"></el-input-number>
                                    <!--<span style="color: red"> 期限(单位分钟，必须在180分钟内完成流程)</span>-->
                                </el-form-item>

                                <el-form-item label="是否禁用" prop="lockedStatus" >
                                    <el-checkbox v-model="definition.lockedStatus" >{{definition.lockedStatus?"是":"否"}}</el-checkbox>
                                </el-form-item>

                                <el-form-item label="最后修改时间" prop="updateDate" >
                                    <el-input :disabled="true" v-model="definition.updateDate"></el-input>
                                </el-form-item>
                                <el-form-item label="最后修改人" prop="updateUser" >
                                    <el-input :disabled="true" v-model="definition.updateUser"></el-input>
                                </el-form-item>
                                <el-form-item label="流程描述" prop="bpmDescribe" layout="4">
                                    <el-input type="textarea" v-model="definition.bpmDescribe" maxlength="300"  :rows="3"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="actDefKey" layout="4">
                                    <div class="contentText">
                                        <p>支持br标签换行</p>
                                    </div>
                                </el-form-item>
                                <el-form-item label="标题生成规则" prop="taskNameRule" layout="4">
                                    <el-input type="textarea" v-model="definition.taskNameRule" maxlength="300"  :rows="3"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="actDefKey" layout="4">
                                    <div class="contentText">
                                        <p>标题生成规则</p>
                                        <p>1. {}里的内容为变量的匹配规则定义，多个变量之间可用任意字符串连接</p>
                                        <p>2. 冒号左边为描述信息，最终不会生成到title中，所以可以省略不写</p>
                                        <p>3. 冒号右边是流程自定义变量</p>
                                        <p> flowName：流程名称</p>
                                        <p> operateName：按钮名称</p>
                                        <p> startUser：流程申请人</p>
                                        <p> operateUser：当前流程操作人</p>
                                        <p> startDate：流程申请时间（yyyy-mm-dd）</p>
                                        <p> startTime：流程申请时间（yyyy-mm-dd hh:MM:ss）</p>
                                        <p>如：<span class="exam">{发起人:startUser}{操作:operateName}了{流程标题:flowName},请处理</span></p>
                                    </div>
                                </el-form-item>
                                <el-form-item label="业务规则" prop="bizDataRule" layout="4" style="height: 440px">
                                    <from-template-common :detailGridData="bizDataRuleGrid" ref="bizDataRule"></from-template-common>
                                </el-form-item>
                            </ice-grid-layout>
                         <!--   <ice-grid-layout :columns="4" name="业务规则">

                            </ice-grid-layout>-->

                            <!--<el-form-item label="" prop="bizDataRule">
                                <div class="contentText">
                                    <p>用户业务规则配置，JSON格式</p>
                                </div>
                            </el-form-item>-->

                            <ice-query-grid title="流程关联页面"
                                            style="height: 400px"
                                            :data-url="refBizDataUrl"
                                            :columns="refBizColumns"
                                            :pagination="false"
                                            :operations="refBizOperations"
                                            :buttons="refBizButtons" ref="refBizGrid">
                            </ice-query-grid>

                            <!-- 编辑弹出框 -->
                            <ice-dialog :title="titleMap[dialogTittle]" :visible.sync="refBizEditVisible" width="600px">
                                <div class="ice-container">
                                    <el-form ref="refBizForm" :model="refBizForm" label-width="100px"
                                             :rules="refBizFormRules">
                                        <ice-grid-layout name="流程关联信息" :columns="1" gutter="0px" :expandable="false">
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item label="页面名字" prop="pageName">
                                                        <!--<el-input v-model="refBizForm.refBizForm"  maxlength="30" ></el-input>-->
                                                        <page-edit ref="pageEdit" :selectedHanlder="selectedRefBizPage"></page-edit>
                                                        <el-input v-model="refBizForm.pageName">
                                                            <i slot="suffix" class="el-icon-s-tools" @click="chooseRefBizPage"
                                                               style="padding-right: 10px;color: #5daf34"></i>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item label="关联url" prop="roleType">
                                                        <el-input v-model="refBizForm.roleType" maxlength="100"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item label="规则值" prop="roleText">
                                                        <el-input v-model="refBizForm.roleText" maxlength="200" ></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="40">
                                                <el-col :span="24">
                                                    <el-form-item label="回调class" prop="callClass">
                                                        <el-input v-model="refBizForm.callClass" maxlength="100" ></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </ice-grid-layout>
                                    </el-form>
                                </div>
                                <div class="ice-button-bar" slot="footer">
                                    <el-button type="primary" @click="refBizSaveOrUpdate">保存</el-button>
                                    <el-button @click="refBizEditVisible = false;">取 消</el-button>
                                </div>
                            </ice-dialog>


                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane :label="`表单页面属性`" class="table-panel" name="formRole">
                        <from-role :call-back="pageFromRole" ref="pageFormRole"></from-role>
                    </el-tab-pane>
                    <el-tab-pane :label="`环节人员`" class="table-panel" name="fifth">
                        <div style="padding-bottom: 10px" class="top">
                            <el-button type="warn" @click="saveAllNodeUserSet">保存全部</el-button>
                        </div>
                        <div class="bottom">
                            <div class="ice-full-absolute">

                                <el-table
                                        :data="gridNodeUserList"
                                        :stripe="true"
                                        height="100%"
                                        ref="table"
                                        style="width: 100%">
                                    <el-table-column
                                            :fit="true"
                                            prop="nodeId"
                                            width="150"
                                            align="left"
                                            label="环节ID">
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="nodeName"
                                            align="left"
                                            width="150"
                                            label="环节名称">
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            width="160px"
                                            prop="roleFormula"
                                            label="审批人表达式">
                                        <template slot-scope="scope">
                                            <el-popover
                                                    placement="top-start"
                                                    width="400"
                                                    trigger="click">
                                                <el-input type="textarea" v-model="scope.row.roleFormula"
                                                          rows="3"></el-input>
                                                <el-button slot="reference"
                                                           icon="el-icon-edit"
                                                           circle
                                                           style="color: darkturquoise"
                                                           v-if="!scope.row.roleFormula">填写
                                                </el-button>
                                                <el-button slot="reference"
                                                           icon="el-icon-edit"
                                                           circle
                                                           style="color: #ebb563"
                                                           v-if="!!scope.row.roleFormula">查看
                                                </el-button>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="assignerName"
                                            label="审批人表达式描述">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.assignerName" style="width: 100%"></el-input>
                                        </template>
                                    </el-table-column>
                                   <!-- <el-table-column
                                            :fit="true"
                                            prop="orderNo"
                                            width="100"
                                            sortable
                                            label="返回人数">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.backNum"></el-input>
                                        </template>
                                    </el-table-column>-->
                                    <el-table-column
                                            :fit="true"
                                            prop="orderNo"
                                            width="100px"
                                            sortable
                                            label="排序">
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.orderNo" :controls="false" :min="1" :max="1000" placeholder="1至1000" style="width: 100%"></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            fixed="right"
                                            width="260px"
                                            label="操作">
                                        <template slot-scope="scope">
                                            <el-button-group>
                                                <el-button icon="el-icon-success"
                                                           style="color: plum"
                                                           @click="selectAssignerList(scope.$index, scope.row)">选择
                                                </el-button>
                                                <el-button icon="el-icon-edit"
                                                           style="color: #ebb563"
                                                           @click="editNodeUserSet(scope.$index, scope.row)">修改
                                                </el-button>
                                                <el-button icon="el-icon-sold-out"
                                                           style="color: #85ce61"
                                                           @click="saveNodeUserSet(scope.$index, scope.row)">保存
                                                </el-button>
                                                <!--<el-button @click="delNodeUserSet(scope.$index, scope.row)" >删除</el-button>-->
                                            </el-button-group>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <ext-assigner-editor @set-conf="setRoleFormula" ref="assignerEditor"
                                                     :data="nodeaAsignerRole"></ext-assigner-editor>

                                <ice-dialog title="选择处理人规则"
                                            :visible.sync="selectAssignerFromVisible"
                                            height="550px"
                                            width="900px"
                                            :close-on-click-modal="false">
                                    <!--<ext-assigner-role ref="assignerRoleList"></ext-assigner-role>-->
                                    <ice-query-grid
                                            data-url="/bpm/ExtAssignerRole/list"
                                            :query="assignerQuery"
                                            :columns="columnsAssigner" choose-item="single"
                                            ref="assignerRoleList">
                                    </ice-query-grid>
                                    <div class="ice-button-bar ">
                                        <el-button type="primary" @click="selectAssignerListConfirm">确定</el-button>
                                        <el-button type="info" @click="cancelSelectUser">取消</el-button>
                                    </div>
                                </ice-dialog>
                            </div>
                        </div>


                    </el-tab-pane>
                    <el-tab-pane :label="`环节属性`" class="table-panel" name="second">
                        <div style="padding-bottom: 10px" class="top">
                            <el-button type="warn" @click="saveNodeSet">保存</el-button>
                        </div>
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <el-table
                                        :data="nodeSetList"
                                        :stripe="true"
                                        height="100%"
                                        style="width: 100%;">
                                    <el-table-column
                                            :fit="true"
                                            align="left"
                                            prop="nodeId"
                                            label="环节ID">
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            align="left"
                                            prop="nodeName"
                                            label="环节名称">
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="replacePerson"
                                            label="允许替换处理人">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.replacePerson">
                                                <el-option :value="1" label="是"></el-option>
                                                <el-option :value="0" label="否"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="groupTask"
                                            label="任务池环节">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.groupTask">
                                                <el-option :value="1" label="是"></el-option>
                                                <el-option :value="0" label="否"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="autoSkip"
                                            label="自动执行">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.autoSkip">
                                                <el-option :value="1" label="是"></el-option>
                                                <el-option :value="0" label="否"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="autoSkipSame"
                                            label="相同处理人自动执行">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.autoSkipSame">
                                                <el-option :value="1" label="是"></el-option>
                                                <el-option :value="0" label="否"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="autoSkipNull"
                                            label="处理人为空自动跳过">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.autoSkipNull">
                                                <el-option :value="1" label="是"></el-option>
                                                <el-option :value="0" label="否"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="mobileAllow"
                                            label="批示意见必填">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.isRequiredCommont">
                                                <el-option :value="1" label="是"></el-option>
                                                <el-option :value="0" label="否"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            prop="deadline"
                                            label="期限(天)">
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.deadline" :controls="false" :min="0"></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="timeoutExecute"
                                            label="超时自动执行(分钟)">
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.timeoutExecute" :controls="false" :min="0"></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="classPreScript"
                                            label="前置脚本">
                                        <template slot-scope="scope">
                                            <!--<el-input v-model="scope.row.classPreScript"></el-input>-->
                                            <el-button v-if="!scope.row.classPreScript"  @click="scriptBefore(scope.row)">填写</el-button>
                                            <el-button style="color: #13ce66" v-if="!!scope.row.classPreScript"  @click="scriptBefore(scope.row)">查看</el-button>
                                        </template>
                                    </el-table-column>

                                    <!-- <el-table-column
                                             :fit="true"
                                             prop="classExtScript"
                                             label="执行中脚本">
                                         <template slot-scope="scope">
                                             <el-input v-model="scope.row.classExtScript"></el-input>
                                         </template>
                                     </el-table-column>-->
                                    <el-table-column
                                            :fit="true"
                                            prop="classAftScript"
                                            label="后置脚本">
                                        <template slot-scope="scope">
                                            <!--<el-input v-model="scope.row.classAftScript"></el-input>-->
                                            <el-button v-if="!scope.row.classAftScript"  @click="scriptAfter(scope.row)">填写</el-button>
                                            <el-button style="color: #13ce66" v-if="!!scope.row.classAftScript"  @click="scriptAfter(scope.row)">查看</el-button>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            prop="formRole"
                                            label="表单规则">
                                        <template slot-scope="scope">
                                            <el-button v-if="!scope.row.formRole"  @click="formRoleClick(scope.row)">填写</el-button>
                                            <el-button  style="color: #13ce66" v-if="!!scope.row.formRole"  @click="formRoleClick(scope.row)">查看</el-button>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            prop="formTemplate"
                                            label="环节数据">
                                        <template slot-scope="scope">
                                            <el-button v-if="!scope.row.formTemplate"  @click="formTemplateClick(scope.row)">填写</el-button>
                                            <el-button  style="color: #13ce66" v-if="!!scope.row.formTemplate"  @click="formTemplateClick(scope.row)">查看</el-button>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            prop="nodeOrder"
                                            label="排序编号">
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.nodeOrder" :controls="false" :min="1" :max="1000" placeholder="1至1000"></el-input-number>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <dialog-js-editor :callBack="scriptBeforeBack" doc-url="doc/scriptInstructions.htm" ref="jsBefore"></dialog-js-editor>
                                <dialog-js-editor :callBack="scriptAfterBack" doc-url="doc/scriptInstructions.htm"  ref="jsAfter"></dialog-js-editor>
                                <flow-from-role :callBack="formRoleBack" ref="formRole" ></flow-from-role>
                                <from-template  :callBack="formTemplateBack" ref="formTemplate" ></from-template>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`流程会签`" class="table-panel" name="fourth">
                        <div style="padding-bottom: 10px" class="top">
                            <el-button type="primary" @click="saveSign">保存</el-button>
                        </div>
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <el-table
                                        :data="tableSignTypeData"
                                        :stripe="true"
                                        height="100%"
                                        style="width: 100%;">
                                    <el-table-column
                                            :fit="true"
                                            prop="nodeId"
                                            label="环节ID">
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="nodeName"
                                            label="环节名称">
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            prop="decisionType"
                                            label="决策方式">
                                        <template slot-scope="scope1">
                                            <!--  <div style="height: 20px;">
                                                  {{scope1.row.nodeName}}
                                              </div>-->
                                            <div>
                                                <el-radio-group v-model="scope1.row.decisionType">
                                                    <el-radio label="AGREE" name="AGREE">同意</el-radio>
                                                    <el-radio label="OPPOSE" name="OPPOSE">反对</el-radio>
                                                </el-radio-group>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="voteType"
                                            label="投票类型">
                                        <template slot-scope="scope2">
                                            <div style="height: 20px;"></div>
                                            <div>
                                                <el-radio-group v-model="scope2.row.voteType">
                                                    <el-radio label="AMOUNT" name="AMOUNT">绝对票数</el-radio>
                                                    <el-radio label="PERCENT" name="PERCENT">百分比</el-radio>
                                                </el-radio-group>
                                            </div>
                                        </template>

                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="amount"
                                            label="数值">
                                        <template slot-scope="scope">
                                            <div style="height: 20px;"></div>
                                            <div>
                                                <el-input-number v-model="scope.row.amount" :min="1" :max="100" placeholder="1至100"></el-input-number>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`按钮管理`" class="table-panel" name="sixth">
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <template v-if="message === 'sixth'">
                                    <el-table :data="nodeAclBtnData" :show-header="true" height="100%"
                                              :row-class-name="tableRowClassName">
                                        <el-table-column prop="nodeInfo" label="环节信息" align="left">
                                            <template slot-scope="scope">
                                                {{scope.row.nodeText}}
                                            </template>
                                        </el-table-column>
                                        <!-- <el-table-column prop="nodeId" label="环节ID"></el-table-column>
                                         <el-table-column prop="nodeName" label="环节名称"></el-table-column>-->

                                        <el-table-column prop="aclKey" label="按钮组" align="left"></el-table-column>
                                        <el-table-column prop="buttonName" label="按钮名称" align="left"></el-table-column>
                                        <el-table-column
                                                fixed="right"
                                                label="操作"
                                                width="140">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-button type="text" size="small" v-if="scope.row.isAdd"
                                                               @click="addNodeAclBtn(scope.$index, scope.row)">新增
                                                    </el-button>
                                                    <el-button type="text" size="small" v-if="!scope.row.isAdd"
                                                               @click="editNodeAclBtn(scope.$index, scope.row)">修改
                                                    </el-button>
                                                    <el-button type="text" size="small" v-if="!scope.row.isAdd"
                                                               @click="deleteNodeAclBtn(scope.$index, scope.row)">删除
                                                    </el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </div>
                        </div>

                        <ice-dialog :title="aclMap[aclTittle]" :visible.sync="isShowNodeAclForm" width="600px" height="200px">
                            <div class="ice-container">
                                <el-form :model="nodeAclForm" label-width="80px">
                                    <ice-grid-layout name="按钮信息" :columns="1" gutter="0px" :expandable="false">
                                        <el-row :gutter="40">
                                            <el-col :span="24">
                                                <el-form-item label="按钮组" prop="aclKey">
                                                    <el-select placeholder="请选择" v-model="nodeAclForm.aclId" @change="aclChange">
                                                        <el-option
                                                                v-for="item in sysAclList"
                                                                :key="item.aclKey"
                                                                :label="item.aclName"
                                                                :value="item.aclKey">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="24">
                                                <el-form-item label="按钮Key" prop="buttonKey">
                                                    <el-select placeholder="请选择" filterable v-model="nodeAclForm.buttonKey"
                                                               @change="aclBtnChange" :multiple="true">
                                                        <el-option
                                                                v-for="item in aclButtonList"
                                                                :key="item.key"
                                                                :label="item.text"
                                                                :value="item.key">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="24">
                                                <el-form-item label="按钮名称" prop="buttonName">
                                                    <el-input v-model="nodeAclForm.buttonName"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </ice-grid-layout>
                                </el-form>
                            </div>
                            <div slot="footer" class="ice-button-bar">
                                <el-button type="primary" @click="saveOrUpdateNodeAclBtn()">确 定</el-button>
                                <el-button @click="cancelNodeAclForm">取 消</el-button>
                            </div>
                        </ice-dialog>
                    </el-tab-pane>
                    <el-tab-pane :label="`按钮附加属性`" class="table-panel" name="seventh">
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <el-table
                                        :data="nodeSetList"
                                        :stripe="true"
                                        height="100%"
                                        style="width: 100%;">
                                    <el-table-column
                                            :fit="true"
                                            align="left"
                                            prop="nodeId"
                                            label="环节ID">
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            align="left"
                                            prop="nodeName"
                                            label="环节名称">
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="select"
                                            label="驳回">
                                        <template slot-scope="scope">
                                            <el-select  collapse-tags v-model="scope.row.reject" multiple placeholder="请选择">
                                                <el-option
                                                        v-for="item in flowNodeButtonExtList"
                                                        :key="item.nodeId"
                                                        :label="item.nodeName"
                                                        :value="item.nodeId">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="select"
                                            label="加签">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.append" multiple placeholder="请选择" style="width: 100%">
                                                <el-option
                                                        v-for="item in appendList"
                                                        :key="item.value"
                                                        :label="item.text"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :fit="true"
                                            prop="select"
                                            label="跳转">
                                        <template slot-scope="scope">
                                            <el-select collapse-tags  v-model="scope.row.jump" multiple placeholder="请选择" style="width: 100%">
                                                <el-option
                                                        v-for="item in flowNodeButtonExtList"
                                                        :key="item.nodeId"
                                                        :label="item.nodeName"
                                                        :value="item.nodeId">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            prop="select"
                                            label="自动异常处理">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.autoException" collapse-tags :clearable="true"
                                                       placeholder="请选择" style="width: 100%" @change="autoExceptionChange">
                                                <el-option
                                                        v-for="item in flowNodeButtonExtList"
                                                        :key="item.nodeId"
                                                        :label="item.nodeName"
                                                        :value="item.nodeId">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            :fit="true"
                                            width="90px"
                                            label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="text"
                                                       size="small"
                                                       @click="saveButtonExt(scope.$index, scope.row)">保存
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane :label="`环节消息`" class="table-panel" name="eighth">
                        <div style="padding-bottom: 10px" class="top">
                            <el-button type="warn" @click="saveNodeMsg()">保存</el-button>

                            <el-button type="error" @click="selectTemplate()">选择模板</el-button>

                        </div>
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <template>
                                    <el-table empty-text="  " width="300">
                                        <el-table-column label="消息类型"></el-table-column>
                                        <el-table-column label="标题"></el-table-column>
                                        <el-table-column label="内容"></el-table-column>
                                    </el-table>
                                    <el-table :data="nodeMsgData" :show-header="false" style="margin-top: -38px;"
                                              :default-expand-all="true">
                                        <template>
                                            <el-table-column type="expand" :lable-width="50" prop="nodeName">
                                                <template slot-scope="scope">
                                                    <el-table :data="scope.row.nodeMsgSetting" :show-header="false"
                                                              :row-key="getRowKeys" class="expand">
                                                        <el-table-column label="消息类型" width="450"
                                                                         style="margin-left: -50px">
                                                            <template slot-scope="scope">
                                                                <el-checkbox-group v-model="checked[scope.row.nodeId]"
                                                                                   @change="msgCheckClick($event, scope.row)">
                                                                    <el-checkbox label="MAIL" name="MAIL">邮件
                                                                    </el-checkbox>
                                                                    <el-checkbox label="MSG" name="MSG">消息</el-checkbox>
                                                                </el-checkbox-group>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column prop="msgTitle">
                                                            <template slot-scope="scope">
                                                                <el-input v-model="scope.row.msgTitle"></el-input>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column prop="msgContent">
                                                            <template slot-scope="scope">
                                                                <el-input type="textarea"
                                                                          v-model="scope.row.msgContent"></el-input>
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="环节名称">
                                                <template slot-scope="scope">
                                                    {{scope.row.nodeId}}({{scope.row.nodeName}})
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="标题"></el-table-column>
                                            <el-table-column label="内容"></el-table-column>
                                        </template>
                                    </el-table>
                                </template>

                                <ice-pop-selector style="box-sizing: border-box"
                                                  label=""
                                                  title="请选择模板"
                                                  text-prop="bpmDefName"
                                                  code-prop="actDefKey"
                                                  mode="hidden"
                                                  :query="templateQuery"
                                                  :columns="templateColumns"
                                                  data-url="/bpm/ExtMessageTemplate/list" ref="selectTemplate"
                                                  @select-confirm="selectTemplateConfirm">
                                </ice-pop-selector>
                            </div>
                        </div>


                    </el-tab-pane>
                    <el-tab-pane :label="`流程分支`" class="table-panel" name="third">
                        <!--     <div>
                                 <el-button type="primary" plain @click="addGateWay">新增</el-button>
                                 <el-button type="danger" plain @click="delVisible = true">删除</el-button>
                             </div>-->
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <template v-if="message === 'third'">
                                    <el-table ref="multipleTable"
                                              :data="tableGatewayData"
                                              :show-header="true"
                                              tooltip-effect="dark"
                                              height="100%"
                                              style="width: 100%"
                                              @selection-change="handleSelectionChange">
                                        <!--        <el-table-column
                                                        fixed="left"
                                                        type="selection"
                                                        width="120"
                                                        @click="toggleSelection(tableGatewayData)">
                                                </el-table-column>-->

                                        <el-table-column
                                                prop="paprmName"
                                                label="分支名称"
                                                width="180">
                                        </el-table-column>
                                        <el-table-column
                                                prop="startNodeName"
                                                label="开始环节"
                                                width="180">
                                        </el-table-column>
                                        <el-table-column
                                                prop="expression"
                                                label="流向条件">
                                        </el-table-column>
                                        <el-table-column
                                                prop="targetNodeName"
                                                label="目标环节"
                                        >
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`流程版本`" class="table-panel" name="ninth">
                        <div class="bottom">
                            <div class="ice-full-absolute">
                                <template v-if="message === 'ninth'">
                                    <el-table ref="multipleTable"
                                              :data="tableHistoryData"
                                              :show-header="true"
                                              tooltip-effect="dark"
                                              style="width: 100%"
                                              @selection-change="handleSelectionChange">
                                        <el-table-column
                                                fixed="left"
                                                type="selection"
                                                width="120"
                                                @click="toggleSelection(tableData)">
                                        </el-table-column>
                                        <el-table-column
                                                prop="bpmDefName"
                                                label="流程名称"
                                                width="180"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                prop="bpmDefKey"
                                                label="流程key"
                                                width="180">
                                        </el-table-column>
                                        <el-table-column
                                                prop="versionNo"
                                                label="版本">
                                        </el-table-column>
                                        <el-table-column
                                                prop="createUser"
                                                label="创建人">
                                        </el-table-column>
                                        <ice-table-column
                                                prop="status"
                                                label="状态" mapTypeCode="PUBLISH_STATE">
                                        </ice-table-column>
                                        <el-table-column
                                                prop="createDate"
                                                label="创建时间">
                                        </el-table-column>
                                        <el-table-column
                                                prop="updateDate"
                                                label="修改时间">
                                        </el-table-column>
                                        <el-table-column
                                                :fit="true"
                                                prop="select"
                                                width="90px"
                                                label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="small" @click="showHistory(scope.row)">
                                                    查看
                                                </el-button>
                                            </template>
                                        </el-table-column>

                                    </el-table>
                                </template>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-container>
    </div>
</template>

<script>
    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'
    import IceSelect from '../../components/common/base/IceSelect.vue'
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import ExtAssignerRole from "@/pages/bpm/ext/ExtAssignerRole.vue";
    import ExtAssignerEditor from "@/pages/bpm/ext/ExtAssignerEditor.vue";

    import IceTableColumn from "../../components/common/base/IceTableColumn.vue";
    import IcePopSelector from "../../components/common/base/IcePopSelector";
    import IceEditableTable from '../../components/common/base/IceEditableTable.vue'
    import IceEditableTableColumn from '../../components/common/base/IceEditableTableColumn.vue'
    import IceDialog from "../../components/common/base/IceDialog";
    import IceJsEditor from "../../components/common/base/iceJsEditor/IceJsEditor.vue";
    import DialogJsEditor from "./DialogJsEditor.vue";
    import FlowFromRole from "./FlowFromRole.vue";
    import IceDatePicker from "../../components/common/base/IceDatePicker";
    import PageEdit from "../system/informationPreserve/pageEdit";
    import FromRole from "@/pages/bpm/FromRole.vue";
    import FromTemplate from "./FromTemplate";
    import FromTemplateCommon from "./FromTemplateCommon";
    import FlowConfig from "./FlowConfiguration/FlowConfig";

    export default {
        name: 'processConfiguration',
        components: {
            FromTemplateCommon,
            FromTemplate,
            FromRole,
            PageEdit,
            IceDatePicker,
            FlowFromRole,
            DialogJsEditor,
            IceJsEditor,
            IceDialog,
            IceQueryGrid,
            IceGridLayout,
            IceSelect,
            IcePersionSelector,
            IceEditableTable,
            IceEditableTableColumn,
            ExtAssignerRole,
            ExtAssignerEditor,
            IceTableColumn,
            IcePopSelector
        },
        mixins:[FlowConfig],
        computed: {},
        watch: {
            $route() {
                this.$loadData();
            }
        },
        mounted() {
            this.$loadData();
        }
    }
</script>

<style src="./FlowConfiguration/FlowConfig.css" scoped>
    /*@import "./FlowConfiguration/FlowConfig.css";*/
</style>
<style lang="less">
    .el-table .warning-row {
        background: #f0f9eb;
    }

    .el-table .success-row {
        background: #FFFFFF;
    }

    .processConfig {
        .el-tabs.el-tabs--top.full-content {
            width: 100%;
            height: 100%;
            position: relative;

            .el-tabs__content {
                position: absolute;
                top: 56px;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: auto;
            }
        }
    }

</style>
