<template>
    <div class="ice-container">

        <el-container>
            <!--调用左侧组件格式-->
            <el-aside width="250px">
                <el-tabs type="border-card"  >
                    <el-tab-pane label="按项目">
                        <ice-tree load-url="pms/Xminfo/QueryTree"
                                  label-prop="xmname"
                                  value-prop="oid"
                                  style="height: 526px"
                                  @node-click="orgNodeClick"
                                  :lazy="false"
                                  ref="iceGrid"
                        >
                            <div style="display: flex;justify-content:space-around" slot="prefix">
                                <el-button icon="el-icon-refresh-left"  type="text" style="color: #4027FF" @click="refreshTree">
                                    <span style="color: #222222">刷新</span>
                                </el-button>
                                <el-button icon="el-icon-circle-plus" type="text" style="color: #98FB98"  @click="addNode">
                                    <span style="color: #222222">新增</span>
                                </el-button>
                                <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteNode"
                                >
                                    <span style="color: #222222">删除</span>
                                </el-button>
                            </div>
                        </ice-tree>
                    </el-tab-pane>
                    <el-tab-pane label="按年份">
                        <ice-tree load-url="pms/Xminfo/QueryTree"
                                  label-prop="xmname"
                                  value-prop="oid"
                                  style="height: 526px"
                                  @node-click="orgNodeClick"
                                  :lazy="false"
                                  ref="iceGrid"
                        ></ice-tree>

                    </el-tab-pane>
                </el-tabs>
            </el-aside>

            <!--引用组件,定义变量-->
            <el-main>
                <ice-query-grid
                        data-url="pms/Xminfo/list"
                        :columns="columns"
                        :buttons="buttons"
                        ref="grid"
                        :operations="operations"
                        :query="querys"
                        exportTitle="科研项目信息"
                >
                </ice-query-grid>
            </el-main>
        </el-container>

        <!--点击编辑弹出模态框进行修改删除-->
        <ice-dialog :title="titleName" :visible.sync="visible" width="1300px">
            <el-tabs  v-model="activeName" type="card">
                <el-tab-pane label="项目基本信息" name="first">
                    <el-form :model="formModel" :rules="rules" ref="form" :v-loading="loading">
                        <el-row :gutter="20">
                            <!--第一行-->
                            <el-col :span="8">
                                <el-form-item label="项目名称" label-width="110px" prop="xmname">
                                    <el-input v-model="formModel.xmname"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所内项目编号" label-width="110px" prop="xmcode">
                                    <el-input v-model="formModel.xmcode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所外项目编号" label-width="110px" prop="xmcode">
                                    <el-input v-model="formModel.xmcodeyn"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--第二行-->
                            <el-col :span="8">
                                <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目状态" label-width="110px" prop="xmzt">
                                    <ice-select v-model="formModel.xmzt" map-type-code="XMZT" filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目类别" label-width="110px" prop="xmlb">
                                    <ice-select v-model="formModel.xmlb" map-type-code="XMLB0101" filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>
                            <!--第三行-->
                            <el-col :span="8">
                                <el-form-item label="学科方向" label-width="110px" prop="xmxkfx">
                                    <ice-select v-model="formModel.xmxkfx" map-type-code="XMXKFX" filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="上报状态" label-width="110px" prop="sbzt">
                                    <ice-select v-model="formModel.sbzt" map-type-code="SBZT" filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="立项日期" label-width="110px" prop="gmtLx">
                                    <el-date-picker v-model="formModel.gmtLx"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <!--第四行-->
                            <el-col :span="8">
                                <el-form-item label="责任单位" label-width="110px" prop="orgid">
                                    <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModel.orgid" @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="责任人" label-width="110px" prop="personid">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formModel.deptCode" v-model="formModel.personid" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目主管" label-width="110px" prop="xmzg">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModel.xmzg" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <!--第五行-->
                            <el-col :span="8">
                                <el-form-item label="业务主管部门" label-width="110px" prop="xmzgbm">
                                    <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModel.xmzgbm" @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="技术负责人" label-width="110px" prop="personidJs">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModel.personidJs" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="行政负责人" label-width="110px" prop="personidXz">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModel.personidXz" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                            <!--第六行-->
                            <el-col :span="8">
                                <el-form-item label="全时人力投入" label-width="110px" prop="rltr">
                                    <el-input v-model="formModel.rltr"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="预算经费合计" label-width="110px" prop="ysjfhj">
                                    <el-input v-model="formModel.ysjfhj"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="预算号" label-width="110px" prop="yscode">
                                    <el-input v-model="formModel.yscode"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--第七行-->
                            <el-col :span="24">
                                <el-form-item label="项目目标" label-width="110px" prop="xmmb">
                                    <el-input v-model="formModel.xmmb" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <!--第八行-->
                            <el-col :span="24">
                                <el-form-item label="项目经费渠道建议" label-width="110px" prop="xmjfqd">
                                    <el-input v-model="formModel.xmjfqd" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit type="textarea" :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <!--第九行-->
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input v-model="formModel.dateRemark" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit type="textarea"
                                              :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <!--模态框底部定义按钮-->
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button type="info" @click="visible=false">返回</el-button>
                    </div>
                </el-tab-pane>
                <!--点击编辑打开项目成员tab 标签-->
                <el-tab-pane label="项目成员" name="xmcy">
                    <div>
                        <ice-query-grid
                                :gridData="queryListXmcy"
                                :columns="columnsXmcy"
                                :buttons="buttonsXmcy"
                                :operations="operationsXmcy"
                                ref="XzryTable"
                        >

                        </ice-query-grid>
                    </div>
                </el-tab-pane>

                <!--点击编辑打开项目输入-->
                <el-tab-pane label="项目输入"  name="xmsr">
                    <!--点击添加附件功能，选中行删除-->
                    <div style="display: flex; flex-direction: row">
                        <ice-single-upload :on-success="fileUploadSuccess" ref="fileUpload"></ice-single-upload>
                        <el-button type="danger" @click="deleteAtta" style="margin-left: 10px;">删除</el-button>
                    </div>
                    <vxe-table
                            border
                            resizable
                            show-overflow
                            highlight-current-row
                            highlight-hover-row
                            ref="attaTable"
                            max-height="800"
                            :data="queryListXmsr"
                    >
                        <vxe-table-column type="checkbox" width="60"></vxe-table-column>    <!--以下行定义列-->
                        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                        <vxe-table-column field="xmname" width="128" title="项目名称"></vxe-table-column>
                        <vxe-table-column field="xmstage" width="141" title="项目阶段" >
                            <template v-slot="{ row }">
                                <ice-select disabled v-model="row.xmstage" map-type-code="XMSTAGE"></ice-select>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="filename" width="128" title="文件名称"></vxe-table-column>
                        <vxe-table-column field="filecode" width="128" title="文件编号"></vxe-table-column>
                        <vxe-table-column field="fileLyDwname" width="128" title="编写单位"></vxe-table-column>
                        <vxe-table-column field="fileBxr" width="128" title="编写人"></vxe-table-column>
                        <vxe-table-column field="spzt" width="130" title="审批状态" map-type-code="SPZT">
                            <template v-slot="{ row }">
                                <ice-select disabled v-model="row.spzt" map-type-code="SPZT"></ice-select>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="fileDateCreate" width="130" title="上传日期"></vxe-table-column>
                        <vxe-table-column field="fileDateSp" width="135" title="审批通过日期"></vxe-table-column>
                        <vxe-table-column   field="operator" title="操作" width="80">
                            <template v-slot="{ row }">
                                <template>
                                    <el-button type="text" @click="downloadFile(row)">下载</el-button>
                                </template>
                            </template>
                        </vxe-table-column>
                    </vxe-table>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="saveXmsrFj">保存</el-button>
                        <el-button type="info" @click="visible=false">关闭</el-button>
                    </div>
                </el-tab-pane>

                <!--点击编辑打开项目输出-->
                <el-tab-pane label="项目输出"  name="xmsc">
                    <!--添加项目输出附件上传-->
                    <div style="display: flex; flex-direction: row">
                        <ice-single-upload :on-success="fileUploadSuccessXmsc" ref="fileUploadXmsc"></ice-single-upload>
                        <el-button type="danger" @click="deleteAttaXmsc" style="margin-left: 10px;">删除</el-button>
                    </div>
                    <vxe-table
                            border show-overflow
                            ref="attaTableXmsc"
                            max-height="800"
                            :data="queryListXmsc"
                    >
                        <vxe-table-column type="checkbox" width="60"></vxe-table-column>    <!--以下行定义列-->
                        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                        <vxe-table-column field="xmname" width="128" title="项目名称"></vxe-table-column>
                        <vxe-table-column field="xmstage" width="128" title="项目阶段">
                            <template v-slot="{ row }">
                                <ice-select  disabled v-model="row.xmstage" map-type-code="XMSTAGE"></ice-select>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="filename" width="128" title="文件名称"></vxe-table-column>
                        <vxe-table-column field="filecode" width="128" title="文件编号"></vxe-table-column>
                        <vxe-table-column field="fileLyDwname" width="128" title="编写单位"></vxe-table-column>
                        <vxe-table-column field="fileBxr" width="128" title="编写人"></vxe-table-column>
                        <vxe-table-column field="spzt" width="130" title="审批状态">
                            <template v-slot="{ row }">
                                <ice-select disabled v-model="row.spzt" map-type-code="SPZT"></ice-select>
                            </template>
                        </vxe-table-column>
                        <vxe-table-column field="fileDateCreate" width="130" title="上传日期"></vxe-table-column>
                        <vxe-table-column field="fileDateSp" width="135" title="审批通过日期"></vxe-table-column>
                        <vxe-table-column   field="operator" title="操作" width="80">
                            <template v-slot="{ row }">
                                <template>
                                    <el-button type="text" @click="downloadFileXmsc(row)">下载</el-button>
                                </template>
                            </template>
                        </vxe-table-column>
                    </vxe-table>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="saveXmscFj">保存</el-button>    <!--@click="saveXmsrFj"-->
                        <el-button type="info" @click="visible=false">关闭</el-button>
                    </div>
                </el-tab-pane>

            </el-tabs><!--tabs底部-->

        </ice-dialog>

        <!--弹出Tree树左侧模态框，里面有项目基本信息，项目成员，项目输入，项目输出-->
        <ice-dialog title="新增项目库" :visible.sync="treevisible"  width="1300px">
            <el-tabs v-model="activeName" type="card">
                <!--点击左侧项目树弹出《新增项目基本信息》模态框--->
                <el-tab-pane label="新增项目基本信息" name="first">
                    <XmBaseInfo ref="XminfoBase"></XmBaseInfo>
                </el-tab-pane>

                <!--点击左侧项目树弹出《项目成员》模态框--->
                        <!--这个项目成员需要重新写-->
                <!--<el-tab-pane label="新增项目成员" name="xmcy">-->
                    <!--<XmBaseXmcy ref="XminfoXmcy"></XmBaseXmcy>-->
                <!--</el-tab-pane>-->

                <!--点击左侧项目树弹出《项目输入》模态框--->
                <ATTACHMENT></ATTACHMENT> //这边需要使用杨寿宝的封装好的插件。上传到PMS_RW_FJ 这个表存一个ID，另一个XT_FJ 存一个ID
                <!--<el-tab-pane label="新增项目输入"  name="xmsr">-->
                    <!--&lt;!&ndash;点击添加附件功能，选中行删除&ndash;&gt;-->
                    <!--<XmBaseXmsr ref="XminfoXmsr"></XmBaseXmsr>-->
                <!--</el-tab-pane>-->

                <!--点击左侧项目树弹出《项目输出》模态框--->
                <ATTACHMENT></ATTACHMENT> //这边需要使用杨寿宝的封装好的插件。上传到PMS_RW_FJ 这个表存一个ID，另一个XT_FJ 存一个ID
                <!--<el-tab-pane label="新增项目输出"  name="xmsc">-->
                    <!--&lt;!&ndash;添加项目输出附件上传&ndash;&gt;-->
                    <!--<XmBaseXmsc ref="XminfXmsc"></XmBaseXmsc>-->
                <!--</el-tab-pane>-->
            </el-tabs><!--tab项目树底部-->
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirmDemo">确认</el-button>
                <el-button type="info" @click="treevisible=false">关闭</el-button>
            </div>
        </ice-dialog>

        <!--弹出项目结转模态框《开会商量不需要了》-->
        <!--<ice-dialog title="项目结转"    :visible.sync="visibleXmjz" width="1300px">-->
            <!--<el-form :model="formModelXmjz" :rules="rulesXmjz" :v-loading="loadingXmjz" ref="refXmjzform">-->
                <!--&lt;!&ndash;项目结转信息内容&ndash;&gt;-->
                <!--<el-row :gutter="20">-->
                    <!--&lt;!&ndash;第一行&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="项目名称" label-width="110px" prop="xmname">-->
                            <!--<el-input v-model="formModelXmjz.xmname"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="所内项目编号" label-width="110px" prop="xmcode">-->
                            <!--<el-input v-model="formModelXmjz.xmcode"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="所外项目编号" label-width="110px" prop="xmcode">-->
                            <!--<el-input v-model="formModelXmjz.xmcodeyn"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第二行&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">-->
                            <!--<ice-select v-model="formModelXmjz.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"-->
                                        <!--filterable placeholder="请选择">-->
                            <!--</ice-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="项目状态" label-width="110px" prop="xmzt">-->
                            <!--<ice-select v-model="formModelXmjz.xmzt" map-type-code="XMZT" filterable-->
                                        <!--placeholder="请选择"></ice-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="项目类别" label-width="110px" prop="xmlb">-->
                            <!--<ice-select v-model="formModelXmjz.xmlb" map-type-code="XMLB0101" filterable-->
                                        <!--placeholder="请选择"></ice-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第三行&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="学科方向" label-width="110px" prop="xmxkfx">-->
                            <!--<ice-select v-model="formModelXmjz.xmxkfx" map-type-code="XMXKFX" filterable-->
                                        <!--placeholder="请选择"></ice-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="上报状态" label-width="110px" prop="sbzt">-->
                            <!--<ice-select v-model="formModelXmjz.sbzt" map-type-code="SBZT" filterable-->
                                        <!--placeholder="请选择"></ice-select>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="立项日期" label-width="110px" prop="gmtLx">-->
                            <!--<el-date-picker v-model="formModelXmjz.gmtLx"></el-date-picker>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第四行&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="责任单位" label-width="110px" prop="orgid">-->
                            <!--<ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModelXmjz.orgid" @select-confirm="depts=>formModelXmjz.deptCode=depts[0].deptCode">-->
                            <!--</ice-dept-selector>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="责任人" label-width="110px" prop="personid">-->
                            <!--<ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formModelXmjz.deptCode" v-model="formModelXmjz.personid" @select-confirm="depts=>formModel.dataDeptId=depts[0].oid">-->
                            <!--</ice-persion-selector>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="项目主管" label-width="110px" prop="xmzg">-->
                            <!--<ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModelXmjz.xmzg" @select-confirm="depts=>formModelXmjz.dataDeptId=depts[0].oid">-->
                            <!--</ice-persion-selector>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第五行&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="业务主管部门" label-width="110px" prop="xmzgbm">-->
                            <!--<ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModelXmjz.xmzgbm" @select-confirm="depts=>formModelXmjz.deptCode=depts[0].deptCode">-->
                            <!--</ice-dept-selector>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="技术负责人" label-width="110px" prop="personidJs">-->
                            <!--<ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModelXmjz.personidJs" @select-confirm="depts=>formModelXmjz.dataDeptId=depts[0].oid">-->
                            <!--</ice-persion-selector>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="行政负责人" label-width="110px" prop="personidXz">-->
                            <!--<ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formModelXmjz.personidXz" @select-confirm="depts=>formModelXmjz.dataDeptId=depts[0].oid">-->
                            <!--</ice-persion-selector>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第六行&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="全时人力投入" label-width="110px" prop="rltr">-->
                            <!--<el-input v-model="formModelXmjz.rltr"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->

                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="预算经费合计" label-width="110px" prop="ysjfhj">-->
                            <!--<el-input v-model="formModelXmjz.ysjfhj"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="预算号" label-width="110px" prop="yscode">-->
                            <!--<el-input v-model="formModelXmjz.yscode"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第七行&ndash;&gt;-->
                    <!--<el-col :span="24">-->
                        <!--<el-form-item label="项目目标" label-width="110px" prop="xmmb">-->
                            <!--<el-input v-model="formModelXmjz.xmmb" placeholder="不超过2000个字" type="textarea" :rows="2">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第八行&ndash;&gt;-->
                    <!--<el-col :span="24">-->
                        <!--<el-form-item label="项目经费渠道建议" label-width="110px" prop="xmjfqd">-->
                            <!--<el-input v-model="formModelXmjz.xmjfqd" placeholder="不超过2000个字" type="textarea" :rows="2">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;第九行&ndash;&gt;-->
                    <!--<el-col :span="24">-->
                        <!--<el-form-item label="备注" label-width="110px" prop="dateRemark">-->
                            <!--<el-input v-model="formModelXmjz.dateRemark" placeholder="不超过2000个字" type="textarea"-->
                                      <!--:rows="2">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            <!--</el-form>-->
            <!--<div class="ice-button-bar">-->
                <!--<el-button type="primary" @click="SaveXmzj">保存</el-button>-->
                <!--<el-button type="info" @click="visibleXmjz=false">返回</el-button>-->
            <!--</div>-->
        <!--</ice-dialog>-->

        <!--点击编辑的时候弹出新增人员模态框-->
        <ice-dialog :title="titleNameXzry"  :visible.sync="visibleXzry" width="900px">
            <el-form ref="Xzryfrom" :model="formXzryModel" v-loading="loadingXzry"  :rules="rulesXzry">
                <el-row :gutter="20">
                    <!--新增人员第一行-->
                    <el-col :span="24">
                        <el-form-item label="项目角色" label-width="90px" prop="xmcylx">
                            <ice-select v-model="formXzryModel.xmcylx" map-type-code="XMCYLX"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <!--新增人员第二行-->
                    <el-col :span="12">
                        <el-form-item label="人员姓名" label-width="90px" prop="name">
                            <ice-persion-selector mode="onlySelect" chooseItem="single" v-model="formXzryModel.name" @select-confirm="selectDepRyxm">
                            </ice-persion-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="人员编码" label-width="90px" prop="code">
                            <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formXzryModel.code" v-model="formXzryModel.code" :aria-disabled="true">
                            </ice-persion-selector>
                        </el-form-item>
                    </el-col>
                    <!--新增人员第三行-->
                    <el-col :span="12">
                        <el-form-item label="所属单位" label-width="90px" prop="deptName">
                            <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formXzryModel.deptName" @select-confirm="selectDept">
                            </ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属单位编码" label-width="90px" prop="deptCode" >
                            <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="formXzryModel.deptCode" v-model="formXzryModel.deptCode" :aria-disabled="true" >
                            </ice-persion-selector>
                        </el-form-item>
                    </el-col>
                    <!--新增人员第四行-->
                    <el-col :span="24">
                        <el-form-item label="项目目标" label-width="90px" prop="zzsm">
                            <el-input v-model="formXzryModel.zzsm" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit type="textarea" :rows="2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--模态框:新增人员保存和关闭按钮-->
            <div class="ice-button-bar">
                <el-button type="primary" @click="saveXzry">保存</el-button>
                <el-button type="info" @click="visibleXzry = false ">关闭</el-button>
            </div>
        </ice-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTree from "../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XmBaseInfo from "./XmBaseInfo";
    import XmBaseXmcy from "./XmBaseXmcy";
    import XmBaseXmsr from "./XmBaseXmsr";
    import XmBaseXmsc from "./XmBaseXmsc";
    import ATTACHMENT from "../common/ATTACHMENT";

    //export default 只能导出一个默认模块，这个模块可以匿名
    export default {
        name: "Xmkxinfo",
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                formModel1:{
                    xmname: '', //项目名称
                    xmcode: '',//
                    xmcodeyn: '',//
                    dataSecretLevcode: '2', //默认选择为2
                    xmzt: 'XMZT01',//
                    xmlb: 'XMLB01010101',// 默认选择为XMLB01010101
                    xmxkfx: 'XMXKFX01',//
                    xmjfqd: '',//
                    xmzgbm: '',//
                    xmzg: '',//
                    orgid: '',//
                    personid: '',//
                    personidJs: '',//
                    personidXz: '',//
                    sbzt: 'SBZT01',//
                    xmmb: '',//
                    rltr: '',//
                    gmtLx: '',//
                    xmysh: '',//
                    yscode:'',//
                    dateRemark: '',//
                    ysjfhj: '',//预算经费合计
                },

                //调用页面网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {label: "项目名称", code: "xmname", width: 100, sortable: true},
                    {label: "所内项目编号", code: "xmcode", width: 130, sortable: true},
                    {label: "所外项目编号", code: "xmcodeyn", width: 130, sortable: true},
                    {label: '项目密级', code: 'dataSecretLevcode', width: 100, sortable: true, mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "项目状态", code: "xmzt", width: 100, sortable: true, mapTypeCode: 'XMZT'},
                    {label: "项目类别", code: "xmlb", width: 100, sortable: true, mapTypeCode: 'XMLB0101'},
                    {label: "学科方向", code: "xmxkfx", width: 100, sortable: true, mapTypeCode: 'XMXKFX'},
                    {label: "业务主管部门", code: "xmzgbm", width: 130, sortable: true},
                    {label: "项目主管", code: "xmzg", width: 100, sortable: true},
                    {label: "责任单位", code: "orgid", width: 100, sortable: true},
                    {label: "责任人", code: "personid", width: 100, sortable: true},
                    {label: "技术负责人 ", code: "personidJs", width: 130, sortable: true},
                    {label: "行政负责人", code: "personidXz", width: 130, sortable: true},
                    {label: "上报状态", code: "sbzt", width: 100, sortable: true,mapTypeCode: 'SBZT'},
                    {label: "审批结果", code: "dateRemark", width: 100, sortable: true},
                    {label: "预算经费合计（万元）", code: "ysjfhj", width: 100, sortable: true},
                    {label: "全时人力投入", code: "rltr", hidden: true},
                    {label: "立项日期", code: "gmtLx", width: 100, sortable: true},
                    {label: "预算号", code: "yscode", width: 100, sortable: true},
                    {label: "上级项目编号", code: "pid", hidden: true},
                    {label: "项目经费渠道建议", code: "xmjfqd", hidden: true},
                    {label: "项目目标", code: "xmmb", hidden: true},
                ],
                //按钮组件
                buttons: [
                    // {name: '导出', ctrlCode: "export", type: 'export'},  //导出Excel表需要定义一个组件就行，这里声明就可以使用
                    {name: '刷新', icon: 'el-icon-refresh', ctrlCode: "BXZ", type: 'success', callback: this.refreshGrid},
                ],

                //定义弹出框为false，隐藏状态
                visible: false,

                //定义模态框里面的新增内容字段
                formModel: {
                    oid: '',
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    pid: '',
                    dataSecretLevcode: '',
                    xmzt: '',
                    xmlb: '',
                    xmxkfx: '',
                    xmjfqd: '',
                    xmzgbm: '',
                    xmzg: '',
                    orgid: '',
                    personid: '',
                    personidJs: '',
                    personidXz: '',
                    sbzt: '',
                    xmmb: '',
                    ysjfhj: '',
                    rltr: '',
                    gmtLx: '',
                    xmysh: '',
                    dateRemark: '',
                },

                //定义模态框里面必填项,是以数组形式保存，里面存放的是JSON
                rules: {
                    xmname: [{required: true,  message: '请输入项目名称', trigger: 'blur'}],
                    xmcode: [{required: true,  message: '所内项目编号', trigger: 'blur'}],
                    xmcodeyn: [{required: true,  message: '所外项目编号', trigger: 'blur'}],

                    dataSecretLevcode: [{required: true,  message: '项目密集', trigger: 'blur'}],
                    xmzt: [{required: true,  message: '项目状态', trigger: 'blur'}],
                    xmlb: [{required: true,  message: '项目类别', trigger: 'blur'}],

                    xmxkfx: [{required: true,  message: '学科方向', trigger: 'blur'}],
                    sbzt: [{required: true,  message: '上报状态', trigger: 'blur'}],
                    gmtLx: [{required: true,  message: '立项日期', trigger: 'blur'}],

                    orgid: [{required: true,  message: '责任单位', trigger: 'blur'}],
                    personid: [{required: true,  message: '责任人', trigger: 'blur'}],
                    xmzg: [{required: true,  message: '项目主管', trigger: 'blur'}],

                    xmzgbm: [{required: true,  message: '业务主管部门', trigger: 'blur'}],
                    personidJs: [{required: true,  message: '技术负责人', trigger: 'blur'}],
                    personidXz: [{required: true,  message: '行政负责人', trigger: 'blur'}],

                    xmzgbm: [{required: true,  message: '业务主管部门', trigger: 'blur'}],
                    personidJs: [{required: true,  message: '技术负责人', trigger: 'blur'}],
                    personidXz: [{required: true,  message: '行政负责人', trigger: 'blur'}],

                    rltr: [{required: true,  message: '全时人力投入', trigger: 'blur'}],
                    ysjfhj: [{required: true,  message: '预算经费合计', trigger: 'blur'}],
                    yscode: [{required: true,  message: '预算号', trigger: 'blur'}],

                    xmmb: [{required: true,  message: '项目目标', trigger: 'blur'}],
                    xmjfqd: [{required: true,  message: '项目经费渠道建议', trigger: 'blur'}],
                },
                //定义模态框 转圈加载过程
                loading: false,

                //定义行的编辑,项目结转
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "editor"},
                    {name: '项目结转', callback: this.editXmjz, ctrlCode: "editorXmjx"},
                ],

                //定义高级模糊查询方法
                querys: [
                    {type: 'input', code: 'xmname', label: '项目名称'},
                    {type: 'input', code: 'xmcode', label: '项目编号'},
                    {type: 'input', code: 'xmzg', label: '项目主管'},
                    {type: 'input', code: 'personidJs', label: '技术负责人'},
                    {type: 'input', code: 'personidXz', label: '行政负责人'},
                ],

                //定义模态框项目名称为空：
                titleName: '新增项目',

                /**
                 * 左边树tree
                 * 点击获取节点内容ID
                 */
                selectedDeptId: '',

                /**
                 * 左边树tree
                 * 定义左边树弹框新增的字段名称
                 */

                /**
                 * 左边树Tree 验证
                 * rulesTree
                 */
                rulesTree:{
                    xmname: [{required: true,  message: '请输入项目名称', trigger: 'blur'}],
                    xmcode: [{required: true,  message: '所内项目编号', trigger: 'blur'}],
                    xmcodeyn: [{required: true,  message: '所外项目编号', trigger: 'blur'}],

                    dataSecretLevcode: [{required: true,  message: '项目密集', trigger: 'change'}],
                    xmzt: [{required: true,  message: '项目状态', trigger: 'change'}],
                    xmlb: [{required: true,  message: '项目类别', trigger: 'change'}],

                    xmxkfx: [{required: true,  message: '学科方向', trigger: 'change'}],
                    sbzt: [{required: true,  message: '上报状态', trigger: 'change'}],
                    gmtLx: [{required: true,  message: '立项日期', trigger: 'blur'}],

                    orgid: [{required: true,  message: '责任单位', trigger: 'change'}],
                    personid: [{required: true,  message: '责任人', trigger: 'change'}],
                    xmzg: [{required: true,  message: '项目主管', trigger: 'change'}],

                    xmzgbm: [{required: true,  message: '业务主管部门', trigger: 'change'}],
                    personidJs: [{required: true,  message: '技术负责人', trigger: 'change'}],
                    personidXz: [{required: true,  message: '行政负责人', trigger: 'change'}],

                    xmzgbm: [{required: true,  message: '业务主管部门', trigger: 'change'}],
                    personidJs: [{required: true,  message: '技术负责人', trigger: 'change'}],
                    personidXz: [{required: true,  message: '行政负责人', trigger: 'change'}],

                    rltr: [{required: true,  message: '全时人力投入', trigger: 'blur'}],
                    ysjfhj: [{required: true,  message: '预算经费合计', trigger: 'blur'}],
                    yscode: [{required: true,  message: '预算号', trigger: 'blur'}],

                    xmmb: [{required: true,  message: '项目目标', trigger: 'blur'}],
                    xmjfqd: [{required: true,  message: '项目经费渠道建议', trigger: 'blur'}],
                },
                /**
                 * 左边树Tree 加载
                 * loding转圈加载
                 */
                loadingTree: false,

                /**
                 * 左边树Tree
                 * 弹出模态框默认为true
                 */
                treevisible: false,

                /**
                 * 左边树Tree
                 * 定义左侧树节点 默认为空
                 */
                nodeType: '',
                /**
                 * 左边树
                 * 定义获取行内容
                 */
                curTreeNode:{},
                /**
                 * 定义右侧模态框首选《项目信息》
                 */
                activeName: 'first',

                /**
                 * 定义项目输入attaTableData: [],
                 */
                attaTableData: [],
                /**
                 * 定义项目输入的数据源数组空[]
                 */
                queryListXmsr: [],
                xtFjs: [],
                /**
                 * 定义项目输出的数据源为空
                 */
                queryListXmsc: [],

                /**
                 * ------------------------------------项目结转---------------------------------
                 */
                //项目结转模态框默认为关闭false状态
                visibleXmjz: false ,

                //定义项目结转模态框字段，数据双向绑定
                formModelXmjz:{
                    oid: '',
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    pid: '',
                    dataSecretLevcode: '',
                    xmzt: '',
                    xmlb: '',
                    xmxkfx: '',
                    xmjfqd: '',
                    xmzgbm: '',
                    xmzg: '',
                    orgid: '',
                    personid: '',
                    personidJs: '',
                    personidXz: '',
                    sbzt: '',
                    xmmb: '',
                    ysjfhj: '',
                    rltr: '',
                    gmtLx: '',
                    xmysh: '',
                    dateRemark: '',
                },

                //定义项目结转里面的必填项验证rulesXmjz
                rulesXmjz: {
                    xmname: [{required: true,  message: '请输入项目名称', trigger: 'blur'}],
                    xmcode: [{required: true,  message: '所内项目编号', trigger: 'blur'}],
                    xmcodeyn: [{required: true,  message: '所外项目编号', trigger: 'blur'}],

                    dataSecretLevcode: [{required: true,  message: '项目密集', trigger: 'change'}],
                    xmzt: [{required: true,  message: '项目状态', trigger: 'change'}],
                    xmlb: [{required: true,  message: '项目类别', trigger: 'change'}],

                    xmxkfx: [{required: true,  message: '学科方向', trigger: 'change'}],
                    sbzt: [{required: true,  message: '上报状态', trigger: 'change'}],
                    gmtLx: [{required: true,  message: '立项日期', trigger: 'blur'}],

                    orgid: [{required: true,  message: '责任单位', trigger: 'change'}],
                    personid: [{required: true,  message: '责任人', trigger: 'change'}],
                    xmzg: [{required: true,  message: '项目主管', trigger: 'change'}],

                    xmzgbm: [{required: true,  message: '业务主管部门', trigger: 'change'}],
                    personidJs: [{required: true,  message: '技术负责人', trigger: 'change'}],
                    personidXz: [{required: true,  message: '行政负责人', trigger: 'change'}],

                    xmzgbm: [{required: true,  message: '业务主管部门', trigger: 'change'}],
                    personidJs: [{required: true,  message: '技术负责人', trigger: 'change'}],
                    personidXz: [{required: true,  message: '行政负责人', trigger: 'change'}],

                    rltr: [{required: true,  message: '全时人力投入', trigger: 'blur'}],
                    ysjfhj: [{required: true,  message: '预算经费合计', trigger: 'blur'}],
                    yscode: [{required: true,  message: '预算号', trigger: 'blur'}],

                    xmmb: [{required: true,  message: '项目目标', trigger: 'blur'}],
                    xmjfqd: [{required: true,  message: '项目经费渠道建议', trigger: 'blur'}],
                },
                //定义项目结转loadingXmjz
                loadingXmjz: false,

                /**
                 * ----------------------------------项目成员------------------------------
                 */
                //定义项目成员列源数据为空
                queryListXmcy: [],

                //点击新增人员弹出的模态框title
                titleNameXzry:"新增人员",

                //默认模态框为false关闭状态
                visibleXzry: false,

                //定义项目成员loadingXzry为false
                loadingXzry: false,

                //列表展示字段
                columnsXmcy:[
                    {code: 'oid', hidden: true},
                    {code: 'oidXm', hidden: true},
                    {code: 'xmname', hidden: true},
                    {code: 'xmcode', hidden: true},
                    {code: 'dataSecretLevcode', hidden: true},
                    {label: '项目角色', code: 'xmcylx', width: 200, mapTypeCode: 'XMCYLX'},
                    {label: '人员姓名', code: 'name', width: 200, },
                    {label: '人员编码', code: 'code', width: 200, sortable: true},
                    {label: '所属单位', code: 'deptName', width: 200,},
                    {label: '所属单位编码', code: 'deptCode', width: 200, sortable: true},
                ],

                //项目成员按钮事件
                buttonsXmcy:[
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addXzcy},
                ],
                //项目成员编辑事件
                operationsXmcy: [
                    {name: '编辑',callback: this.editXmcy,  ctrlCode: "BXZ1"},
                    {name: '删除', callback: this.deleteXmcy, ctrlCode: "BXZ2"},
                ],

                //定义项目成员新增字段名称
                formXzryModel: {
                    oidXm: "",  //项目OID
                    xmname: "", //项目名称
                    xmcode: "",//所内项目编号
                    xmcylx: "", //项目角色
                    name: "",   //人员姓名
                    code: "",   //人员编码
                    deptName: "",//所属单位
                    deptCode: "",//所属单位编码
                    zzsm: "",   //职责说明
                    dataSecretLevcode: '2', //默认选择为2
                },

                //项目新增人员验证
                rulesXzry:{
                    xmcylx: [{required: true,  message: '项目角色', trigger: 'change'}],
                    name: [{required: true,  message: '人员姓名', trigger: 'change'}],
                    code: [{required: true,  message: '人员编码', trigger: 'change'}],
                    deptName: [{required: true,  message: '所属单位', trigger: 'change'}],
                    deptCode: [{required: true,  message: '所属单位编码', trigger: 'change'}],
                    zzsm: [{required: true,  message: '职责说明', trigger: 'blur'}],
                },

                //项目成员定义点击第一层编辑行的时候获取Xminfo数据
                Xzryrow:{}
            }
        },
        //触发事件方法
        methods: {
            //右侧模态框保存方法
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true;   //定义加载转圈
                        //调用save保存接口
                        this.$axios.post("/pms/Xminfo/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");  //保存完毕之后的提示
                                this.visible = false;                //保存成功之后关闭模态框
                                this.$refs.grid.refresh();          //保存成功grid网格刷新页面
                            })
                            .catch(error => {
                                this.$message.error("保存失败");
                            })
                            .finally(_ => {
                                this.loading = false;
                            })
                    }
                })
            },
            //编辑行
            edit(row) {
                this.Xzryrow = row;
                this.visible = true;  //打开模态框
                this.titleName = '编辑项目库';
                this.activeName = 'first';
                this.$nextTick(_ => {   //事件循环
                    this.$refs.form.resetFields();  //刷新模态框
                    this.formModel = {...row};
                })
                this.queryListXmsr = []; //点击编辑的时候项目输入模态框先清空
                this.queryListXmsc = []; //点击编辑的时候项目输出模态框先清空
                this.queryListXmcy = []; //点击编辑的时候项目成员模态框先清空
                this.getListXmsrData(row.oid);  //获取当前行的项目信息主键OID --查询项目输入
                this.getListXmscData(row.oid);  //获取当前行的项目信息主键OID --查询项目输出
                this.getListXmcyData(row.oid)   //获取当前行的项目信息主键OID --查询项目成员
            },

            //刷新按钮
            refreshGrid() {
                this.$refs.grid.refresh();
            },
            /**
             *左侧树Tree
             * 获取点击项目的ID
             */
            orgNodeClick(id,row) {
                this.selectedDeptId = id;
                this.curTreeNode = row;  //获取行数据
                this.querys= [
                    {type: 'static', code: 'pid', label: '父ID',value:id},
                    {type: 'input', code: 'xmname', label: '项目名称'},
                    {type: 'input', code: 'xmcode', label: '项目编号'},
                    {type: 'input', code: 'xmzg', label: '项目主管'},
                    {type: 'input', code: 'personidJs', label: '技术负责人'},
                    {type: 'input', code: 'personidXz', label: '行政负责人'},
                ];
                this.$refs.grid.refresh();
            },
            /**
             * 左边树Tree 打开模态框方法
             */
            addNode(){
                this.treevisible= true;
                //this.formModelTree.gmtLx = new Date;  //点击新增的时候设置默认当前时间
                this.$nextTick(_ => {
                    this.$refs.treeform && this.$refs.treeform.resetFields();//刷新模态框方法
                })
            },

            /**
             * 左侧树Tree 保存方法
             */
            TreeSave(){
                this.$refs.treeform.validate((valid) => {
                    if (valid) {
                        this.loadingTree = true;   //定义加载转圈
                        //调用save保存接口
                        this.formModelTree.pid=this.curTreeNode.data.oid;
                        this.$axios.post("/pms/Xminfo/saveOrUpdate", this.formModelTree)
                            .then(result => {
                                this.$message.success("保存成功");          //保存完毕之后的提示
                                this.treevisible = false;                //保存成功之后关闭模态框
                                this.$refs.iceGrid.addNode(result.data); //保存之后刷新左侧树
                                this.$refs.grid.refresh();              //保存成功grid网格刷新页面
                            })
                            .catch(error => {
                                this.$message.error("保存失败");
                            })
                            .finally(_ => {
                                this.loadingTree = false;
                            })
                    }
                })
            },

            /**
             * 左侧树Tree 删除功能
             */
            deleteNode(){
                if (this.curTreeNode.childNodes.length>0) {
                    this.$message({
                        message: '该节点为根节点，不可删除',
                        type: 'warning'
                    });
                }else{
                    //let length = this.curTreeNode.pid();
                    this.$axios.delete("pms/Xminfo/del",{"params": {"id": this.curTreeNode.data.oid}}).then(
                        this.$message({
                            message: '删除成功',
                        })
                    )
                    this.$refs.iceGrid.remove(this.curTreeNode.data.oid);
                    this.$refs.grid.refresh();
                }

            },
            /**
             * 左边树的刷新方法
             */
            refreshTree(){
                this.$refs.iceGrid.refresh();
            },

            /**
             * ---------------------------------------项目输入输出附件上传下载----------
             */
            //获取项目输入,添加附件数据
            getListXmsrData(xmOid){
                this.$axios.get("/pms/PmsXmRwFj/querylistByOidXmsrFj", {params: {xmOid: xmOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.queryListXmsr.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },

            //项目输入附件上传
            fileUploadSuccess(response, file){
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: fileId, oidXm: this.formModel.oid};
                console.log(record)
                debugger
                this.$refs.fileUpload.reset();
                this.$refs.attaTable.insertAt(record, -1)
                    .then(({ row }) => this.$refs.attaTable.setActiveCell(row));
            },
            //项目输入附件下载
            downloadFile (row) {
                this.$downloadFile(row.dataid);
            },
            //项目输入根据行删除附件信息
            deleteAtta () {
                this.$refs.attaTable.removeSelecteds()
            },
            //项目输入保存方法
            saveXmsrFj(){
                //协同附件数据
                let insertAttaData = this.$refs.attaTable.getInsertRecords();
                let removeAttaData = this.$refs.attaTable.getRemoveRecords();
                let updateAttaData = this.$refs.attaTable.getUpdateRecords();
                removeAttaData.map(o =>{o.version = -1})
                this.formModel.XtFjList =  insertAttaData.concat(removeAttaData,updateAttaData);
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsXmRwFj/saveOrUpdateByRwfjAndXtfj", this.formModel)
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
            /**
             *  点击编辑的时候根据项目OID获取项目输出数据
             */
            getListXmscData(xmOid){
                this.$axios.get("/pms/PmsXmRwFj/querylistByOidXmscFj", {params: {xmOid: xmOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.queryListXmsc.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            //项目输出附件上传
            fileUploadSuccessXmsc(response, file){
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: fileId, oidXm: this.formModel.oid};
                this.$refs.fileUploadXmsc.reset();
                this.$refs.attaTableXmsc.insertAt(record, -1)
                    .then(({ row }) => this.$refs.attaTableXmsc.setActiveCell(row));
            },
            //项目输出附件上传删除（选中列删除）
            deleteAttaXmsc () {
                this.$refs.attaTableXmsc.removeSelecteds()
            },
            //项目输出保存方法
            saveXmscFj(){
                //协同附件数据
                let insertAttaData = this.$refs.attaTableXmsc.getInsertRecords();
                let removeAttaData = this.$refs.attaTableXmsc.getRemoveRecords();
                let updateAttaData = this.$refs.attaTableXmsc.getUpdateRecords();
                removeAttaData.map(o =>{o.version = -1})
                this.formModel.XtFjList =  insertAttaData.concat(removeAttaData,updateAttaData);
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsXmRwFj/saveOrUpdateByRwfjAndXtfjXmsc", this.formModel)
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
            //下载项目输出
            downloadFileXmsc(row){
                this.$downloadFile(row.dataid);
            },
            /**
             *  -----------------------------《项目结转功能》-------------
             */
            //点击项目结转弹出模态框
            editXmjz(row){
                row.oid = "";   //给获取到oid设置为空
                this.visibleXmjz = true;  //打开项目结转模态框
                this.$nextTick(_ => {   //事件循环
                    this.formModelXmjz = {...row};
                })
            },
            //项目结转保存方法
            SaveXmzj(){
                this.$refs.refXmjzform.validate((valid) => {
                    if (valid) {
                        this.loadingXmjz = true;   //定义加载转圈
                        //调用save保存接口
                        this.$axios.post("/pms/Xminfo/saveOrUpdate", this.formModelXmjz)
                            .then(result => {
                                this.$message.success("保存成功");  //保存完毕之后的提示
                                this.visibleXmjz = false;                //保存成功之后关闭模态框
                                this.$refs.grid.refresh();          //保存成功grid网格刷新页面
                            })
                            .catch(error => {
                                this.$message.error("保存失败");
                            })
                            .finally(_ => {
                                this.loadingXmjz = false;
                            })
                    }
                })
            },
            /**
             * ----------------------------------项目成员------------------------------
             */
            //获取项目列表数据
            getListXmcyData(oidXm){
                console.log(oidXm)
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.queryListXmcy = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            //点击新增的时候打开模态框《项目成员》
            addXzcy(){
                this.visibleXzry = true;    //设置新增人员的时候模态框为true
                this.formXzryModel.deptName = '';
                this.$nextTick(_ => {
                    this.$refs.Xzryfrom && this.$refs.Xzryfrom.resetFields();//刷新模态框方法
                })
                let self = this;
                let tid =setTimeout(function () {
                    console.log('-------', self.formXzryModel)
                },500)
            },
            //点击选择部门的时候自动查询部门编码
            selectDept(depts){
                this.formXzryModel.deptCode=depts[0].deptCode
                this.formXzryModel.deptName = depts[0].deptShortName
                this.formXzryModel.deptId=depts[0].oid
            },
            //点击选择人员的时候自动查询人员编码
            selectDepRyxm(depts){
                this.formXzryModel.code =depts[0].code
                this.formXzryModel.deptId=depts[0].oid
            },

            //项目成员新增人员保存方法
            saveXzry(){
                this.formXzryModel.oidXm = this.Xzryrow.oid;          //获取Xminfo的Oid
                this.formXzryModel.xmname = this.Xzryrow.xmname;     //获取Xminfo的xmname
                this.formXzryModel.xmcode = this.Xzryrow.xmcode;     //获取Xminfo的xmcode
                this.$refs.Xzryfrom.validate((valid) => {
                    if (valid) {
                        this.loadingXzry = true;   //定义加载转圈
                        //调用save保存接口
                        this.$axios.post("/pms/PmsXminfoCy/saveOrUpdate", this.formXzryModel)
                            .then(result => {
                                this.$message.success("保存成功");      //保存完毕之后的提示
                                this.visibleXzry = false;                //保存成功之后关闭模态框
                                this.getListXmcyData(this.Xzryrow.oid);    //重新调用接口刷新界面
                            })
                            .catch(error => {
                                this.$message.error("保存失败");
                            })
                            .finally(_ => {
                                this.loadingXzry = false;
                            })
                    }
                })
            },
            //编辑项目成员
            editXmcy(row){
                console.log(row);
                this.titleNameXzry = "编辑项目库";   //修改头部文字信息
                this.visibleXzry = true ;   //打开新增项目成员模态框
                this.$nextTick(_ => {       //循环渲染出数据
                    this.$refs.Xzryfrom.resetFields();
                    this.formXzryModel = {...row};
                })
            },

            //删除项目新增成员
            deleteXmcy(row){
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/PmsXminfoCy/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.getListXmcyData(this.Xzryrow.oid);    //重新调用接口刷新界面
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                })

            },
            confirmDemo () {
                let XminfoBaseData = this.$refs.XminfoBase.formModel;
                let XminfoXmcyData = this.$refs.XminfoXmcy.formModel;
                let XminfoXmsrData = this.$refs.XminfoXmsr.formModel;
                let XminfXmscData = this.$refs.XminfXmsc.formModel;

                console.log("基本信息", XminfoBaseData);
                console.log("成员", XminfoXmcyData);
                console.log("输入", XminfoXmsrData);
                console.log("输出", XminfXmscData);

            }

        },  //methods方法底部


        //这个是你引用插件生成的,不用管它
        components: {
            ATTACHMENT,
            XmBaseXmsc,
            XmBaseXmsr,
            XmBaseXmcy,
            XmBaseInfo,
            IceSingleUpload,
            IcePersionSelector,
            IceDeptSelector,
            IceTree,
            IceSelect,
            IceDialog,
            IceQueryGrid}
    }
</script>
