<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-tree-grid
                    exportTitle="技术服务目录"
                    load-url="/pro/ProScTechCatalog/creatTree?areaId="
                    label-prop="name"
                    value-prop="name"
                    data-url="/pro/ProScTechCatalog/list"
                    :query="query"
                    :columns="columns"
                    :operations="operations"
                    :operationsWidth=100
                    :buttons="buttons"
                    :chooseItem="chooseItem"
                    @pagClick="pagClick"
                    ref="mainQueryGrid"
                    @selection-change="handleSelectionChange"
                    @node-click="nodeTreeSelectedHandler">
            </ice-tree-grid>
        </div>

        <ice-dialog :title="`${dialogEditReadonly?'查看':(isAddFlag?'新增':'编辑')}技术服务`"
                    remounted
                    :visible.sync="dialogEditVisible"
                    :buttons="dialogEditReadonly?[]:addButtons"
                    width="900px">
            <div style="height: 500px" class="form-content">
                <div style="max-height: 500px;overflow-x: hidden;">
                    <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                             class="conditon-bar" ref="editForm"
                             style="margin-top: 20px">
                        <ice-grid-layout name="基础属性" :columns="2">

                            <el-form-item label="区域:" label-width="140px" prop="areaId">
                                <el-select placeholder="请选择" v-model="editData.areaId" :disabled="!isAddFlag"
                                           v-if="isAddFlag">
                                    <el-option v-for="item in regionList"
                                               :key="item.oid"
                                               :label="item.shortname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.areaName"></el-input>
                            </el-form-item>

                            <el-form-item label="服务大类:" label-width="140px" prop="parentId">
                                <el-select placeholder="请选择"
                                           v-model="editData.parentId"
                                           :disabled="!isAddFlag"
                                           @change="associateCatalog"
                                           v-if="isAddFlag">
                                    <el-option v-for="item in serviceMenuList"
                                               :key="item.oid"
                                               :label="item.sname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.bigCategoryName"></el-input>
                            </el-form-item>

                            <el-form-item label="服务分类:" label-width="140px" prop="categoryId">
                                <el-select placeholder="请选择"
                                           v-model="editData.categoryId"
                                           :disabled="!isAddFlag"
                                           @change="associateOption"
                                           v-if="isAddFlag">
                                    <el-option v-for="item in serviceCategoryList"
                                               :key="item.oid"
                                               :label="item.sname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.categoryName"></el-input>
                            </el-form-item>

                            <el-form-item label="服务项:" label-width="140px" prop="templateId">
                                <el-select placeholder="请选择" v-model="editData.templateId" :disabled="!isAddFlag"
                                           v-if="isAddFlag" @change="templateTechData">
                                    <el-option v-for="item in serviceOptionList"
                                               :key="item.oid"
                                               :label="item.sname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.catalogName"></el-input>
                            </el-form-item>

                            <el-form-item label="担当岗位:" label-width="140px" prop="roleId">
                                <el-input placeholder="请输入" maxlength=21 v-model="editData.roleId"></el-input>
                            </el-form-item>

                            <el-form-item label="第三方技术支持:" label-width="140px" prop="thirdparty">
                                <el-select placeholder="请选择" v-model="editData.thirdparty">
                                    <el-option v-for="item in thirdPartyList"
                                               :key="item.oid"
                                               :label="item.unitname"
                                               :value="item.oid"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="贡献值:" label-width="140px" prop="score">
                                <el-input-number v-model="editData.score"
                                                 controls-position="right"
                                                 style="width:100%"
                                                 :precision="2"
                                                 :max="99"
                                                 :min="0">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="难度系数:" label-width="140px" prop="difficuty">
                                <el-input-number v-model="editData.difficuty"
                                                 controls-position="right"
                                                 style="width:100%"
                                                 :max="99"
                                                 :min="0">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="有效开始时间:" label-width="140px" prop="gmtBegin">
                                <el-date-picker
                                        v-model="editData.gmtBegin"
                                        type="date"
                                        @change="changeGmtBegin"
                                        placeholder="选择日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="有效结束时间:" label-width="140px" prop="gmtEnd">
                                <el-date-picker
                                        v-model="editData.gmtEnd"
                                        type="date"
                                        :picker-options="{disabledDate(time) {return timeFilter(time)}}"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="技术手册:" label-width="140px" prop="manual" layout="2">
                                <el-input placeholder="技术手册" type="textarea" :rows="4" resize="none"
                                          v-model="editData.manual"></el-input>
                            </el-form-item>
                            <el-form-item label-width="120px" label="附件信息:">
                                <ice-multiple-upload doSecret v-model="editData.manualAtt"></ice-multiple-upload>
                            </el-form-item>
                        </ice-grid-layout>
                    </el-form>
                    <ice-form-group name="服务对象">
                        <div style="margin-bottom: 2px" v-if="!dialogEditReadonly">
                            <el-button type="primary" @click="addItem">新增</el-button>
                            <el-button type="primary" @click="deleteItem">删除</el-button>
                        </div>
                        <ice-query-grid :gridData="devData"
                                        :columns="columnsDev"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :chooseItem="chooseItemDev"
                                        :pagination="false"
                                        @selection-change="devRows"></ice-query-grid>
                    </ice-form-group>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog title="基础信息" center
                    :visible.sync="dialogVisibleProScBizCatalog"
                    :buttons="moreButtons"
                    remounted
                    width="1000px" :close-on-click-modal="false">
            <pro-sc-tech-catalog-dialog ref="$moreOpt" @closeDialog="closeDialog" :checkedIds="checked_ids"
                                        :isSuccess="isSuccess"></pro-sc-tech-catalog-dialog>
        </ice-dialog>
        <pro-sc-tech-catalog-batch-dialog ref="serviceBatch"
                                          @closeBatchDialog="closeBatchDialog"></pro-sc-tech-catalog-batch-dialog>
        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="true"
                    :columns="columnsDev"
                    width="1050px"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>

</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProScTechCatalogDialog from "./ProScTechCatalogDialog";
    import ProScTechCatalogBatchDialog from "./ProScTechCatalogBatchDialog";
    import ProBaseMaintainMember from "../module/ProBaseMaintainMember";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceDialog from "@/components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import DevSelect from "../../biz/dev/devSelect";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";

    export default {
        name: "ProScTechCatalog",
        components: {
            IceFormGroup,
            DevSelect,
            IceQueryGrid,
            ProBaseMaintainMember,
            ProScTechCatalogDialog,
            IceSelect,
            IceTreeGrid,
            ProScTechCatalogBatchDialog,
            IceDialog,
            IceGridLayout,
            IceMultipleUpload
        },
        mixins: [bizComm, devComm, renderer],
        data() {
            let ncolumns = [
                {label: 'oid', code: 'oid', hidden: true},
                {code: 'devId', hidden: true},
                {label: '区域', code: 'areaId', hidden: true},
                {label: '服务大类id', code: 'parentId', hidden: true},
                {label: '服务分类id', code: 'categoryId', hidden: true},
                {label: '服务项id', code: 'templateId', hidden: true},
                {label: '技术手册', code: 'manual', hidden: true},

                {label: '区域', code: 'areaName', width: 180, required: true},
                {label: '服务大类', code: 'bigCategoryName', width: 180, required: true},
                {label: '服务分类', code: 'categoryName', width: 180, required: true},
                {label: '服务项', code: 'catalogName', width: 260, required: true},
                {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "enabled", required: true, sortable: true},
                {
                    label: '是否发布',
                    code: 'isPublished',
                    width: 100,
                    mapTypeCode: "SERVICE_PUBLISH",
                    required: true,
                    sortable: true
                },
                {label: '有效开始时间', code: 'gmtBegin', width: 160, sortable: true},
                {label: '有效结束时间', code: 'gmtEnd', width: 160, sortable: true},
                {label: '创建人', code: 'createUser', hidden: true},
                {label: '创建时间', code: 'createDate', width: 160, sortable: true}];
            return {
                treeId: '0', treeName: '', rootNode: null,
                activeName: 'first',
                query: [],
                queryObj: [
                    {label: '区域', code: 'areaName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务大类', code: 'bigCategoryName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务分类', code: 'categoryName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务项', code: 'catalogName', type: 'input', exp: 'upperLike', value: ''},
                    {type: 'select', label: '是否启用', code: 'isDisabled', mapTypeCode: "YES_NO", value: ''},
                    {type: 'select', label: '是否发布', code: 'isPublished', mapTypeCode: "SERVICE_PUBLISH", value: ''},
                    {label: '有效开始时间', code: 'gmtBegin', type: 'date', exp: ">=",compare:2},
                    {label: '有效结束时间', code: 'gmtEnd', type: 'date', exp: "<=",compare:3},
                    {label: '创建人', code: 'createUser', type: 'input', exp: 'upperLike', value: ''},
                    {label: '创建时间', code: 'createDate', type: 'date',compare:1}
                ],
                editData: common.toInitData(ncolumns, {
                    sort: '0',
                    isFactorychoosed: '0',
                    isDisabled: '0',
                    areaId: this.treeId + '',
                    areaShortname: this.treeName + '',
                    manualAtt:""
                }),
                editRules: {
                    areaId: {required: true, message: '请选择区域'},
                    parentId: {required: true, message: '请选择服务大类'},
                    categoryId: {required: true, message: '请选择服务分类'},
                    templateId: {required: true, message: '请选择服务项名称'},
                    // gmtBegin: {required: true, message: '请选择开始有效时间'},
                    // gmtEnd: {required: true, message: '请选择有效结束时间'},
                    thirdparty: [{required: true, message: '请选择第三方技术支持'}]
                },
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem}],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}
                    , {name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.deleteCallback}
                    , {name: '导出', icon: 'el-icon-upload2', type: 'export'}
                    , {name: '更多操作', icon: 'el-icon-upload2', type: 'primary', callback: this.moreOptionCallback},
                    {
                        name: '更多功能',
                        icon: 'el-icon-plus',
                        type: 'dropdown',
                        callback: this.moreItem,
                        items: [
                            {name: '发布', code: 'publishCallback'},
                            {name: '取消发布', code: 'cancelPublishCallback'},
                            {name: '启用', code: 'startCallback'},
                            {name: '停用', code: 'endCallback'},
                            {name: '批量新增实例', code: 'addBatchCallback'}
                        ]
                    }],
                addButtons: [
                    {name: '保存', iscannel: false, click: this.saveData},
                    {name: '取消', iscannel: true},

                ],
                moreButtons: [
                    {name: '保存', iscannel: false, click: this.saveMoreOptData},
                    {name: '取消', iscannel: true},
                ],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                dialogVisibleProBaseMaintainMember: false,
                tendId: '',
                dialogVisibleProScBizCatalog: false,
                chooseItem: 'multiple',
                checked_ids: '',
                checked_status:'',
                choosedFlag: false,
                thirdPartyList: [],
                regionList: [],
                serviceMenuList: [],
                serviceCategoryList: [],
                serviceOptionList: [],
                isAddFlag: false,
                columnsDev: [],//服务对象数据展示列
                devSelectShow: false,    //设备选择弹窗的开关属性
                devData: [],//服务对象数据
                chooseItemDev: 'multiple',
                devList: [],
                timeEdit: false,
            }
        },
        methods: {
            /**根据服务项渲染技术手册*/
            templateTechData(){
                for (let i = 0; i < this.serviceOptionList.length; i++) {
                    if (this.editData.templateId == this.serviceOptionList[i].oid) {
                        this.editData.manual = this.serviceOptionList[i].manual
                    }
                }
            },
            /**时间过滤*/
            timeFilter(time) {
                if (time < new Date(this.editData.gmtBegin)) {
                    return true
                }
                return false;
            },
            changeGmtBegin() {
                if (new Date(this.editData.gmtBegin) > new Date(this.editData.gmtEnd)) {
                    this.editData.gmtEnd = '';
                }
            },
            /**
             * 服务对象--新增
             */
            addItem() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**
             * 服务对象--删除
             */
            deleteItem() {
                if(this.devList.length > 0){
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.deletes(this.devData, this.devList);
                    this.devList=[];
                });
                }else{
                    this.$message.warning("请选择一条数据进行删除！！！");
                }
            },
            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        if (this.findSameRowByCode(this.devData, data[i].oid, 'oid') == -1) {
                            this.devData.push(data[i]);
                        }
                    }
                    this.$nextTick(() => {
                        resolve();
                        this.devSelectShow = false;
                    });
                })
            },
            /**
             * 关联设备--列表多选框返回所选择的行信息
             */
            devRows(rows) {
                this.devList = rows;
            },
            pagClick(data) {
                this.choosedFlag = false;
            },
            /**
             * 成功后的回调
             */
            isSuccess() {
                this.choosedFlag = false;
            },
            /**
             * 更多功能
             */
            moreItem(code) {
                if (code == 'publishCallback') {//发布
                    this.publishCallback();
                } else if (code == 'cancelPublishCallback') {//取消发布
                    this.cancelPublishCallback();
                } else if (code == 'startCallback') {//启用
                    this.startCallback();
                } else if (code == 'endCallback') {//停用
                    this.endCallback();
                } else if (code == 'addBatchCallback') {//批量新增实例
                    this.addBatchCallback();
                }
            },
            handleNodeClick(data, node) {
                if (this.rootNode == null) {
                    this.rootNode = [];
                    node.childNodes.forEach(item => {
                        this.rootNode[item.data.oid] = item.data.category;
                    })
                }
                this.treeId = data;
                this.treeName = node.data.category;
            },
            addCallback() {
                this.editData = common.toInitData(this.columns, {
                    oid: null,
                    isDisabled: '1',
                    score: 0,
                    difficuty: 0,
                    isPublished: 0
                });
                this.chooseItemDev = 'multiple';
                this.devData = [];
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.isAddFlag = true;
            },
            /**
             * 打开--批量新增
             */
            addBatchCallback() {
                this.$refs.serviceBatch.openDialog();
            },
            deleteCallback() {
                if(this.checked_status.indexOf("1") != -1){
                    this.$message.warning("不能选择已发布的数据进行删除！！！");
                }else {
                    if (this.choosedFlag) {
                        this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            this.$axios.delete("/pro/ProScTechCatalog/dels", {"params": {"ids": this.checked_ids}})
                                .then(result => {
                                    this.$message.success("操作成功");
                                    this.refresh();
                                    this.refreshTree();
                                    this.choosedFlag = false;
                                }).catch(error => {
                                this.$message.error(error.msg);
                            });
                        });
                    } else {
                        this.$message.warning('请先选择需要操作的记录！');
                    }
                }
            },
            /**
             * 新增或编辑---保存
             */
            async saveData() {
                try {
                    await this.$refs.editForm.validate();
                } catch (e) {
                    return false
                }
                //基础属性保存
                const res = await this.$axios.post("/pro/ProScTechCatalog/saveOrUpdate", this.editData);
                let catalogId = res.data;
                //拿到基础属性保存后返回的oid给到每条数据的catalogId
                this.devData.forEach(item => {
                    item.catalogId = catalogId;
                    item.devId = item.oid;
                });
                if (this.devData.length == 0) {
                    let obj = {};
                    obj.catalogId = catalogId;
                    this.devData.push(obj);
                }
                //服务对象保存
                await this.$axios.post("pro/ProScTechCatalogDev/allSave", {list: JSON.stringify(this.devData)});
                this.$message.success("保存成功");
                this.refresh();
                this.refreshTree();
                return true;
            },
            /**
             * table刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
            },
            /**
             * 树形刷新
             */
            refreshTree() {
                this.$refs.mainQueryGrid.$refs.tree.refresh();
            },
            getAreaName(oid) {
                if (this.rootNode == null) {
                    return '';
                }
                let name = this.rootNode[oid];
                return name ? name : '';
            },
            /**
             * 详情
             */
            viewItem(row) {
                this.dialogEditReadonly = true;
                this.chooseItemDev = 'single';
                this.isEditItem(row);
            },
            /**
             * 编辑
             */
            editItem(row) {
                this.dialogEditReadonly = false;
                this.chooseItemDev = 'multiple';
                this.isEditItem(row);
            },
            /**
             * 编辑或详情加载数据
             */
            async isEditItem(row) {
                //获取服务分类信息
                //const res = await this.$axios.get('/pro/ProScTechCatalog/categoryAll', {"params": {"bigCategoryId": row.parentId}})

                //获取服务项信息
                // const sus = await this.$axios.get('/pro/ProScTechCatalog/catalogAll', {"params": {"categoryId": row.categoryId}});

                // const devRes = await this.$axios.get("pro/ProScTechCatalogDev/list", {params: {catalogId: row.oid}});

                const [res, sus, devRes] = await Promise.all([this.$axios.get('/pro/ProScTechCatalog/categoryAll', {"params": {"bigCategoryId": row.parentId}}),
                    this.$axios.get('/pro/ProScTechCatalog/catalogAll', {"params": {"categoryId": row.categoryId}}),
                    this.$axios.get("pro/ProScTechCatalogDev/list", {params: {catalogId: row.oid}})])


                console.log(res, sus, devRes)
                this.serviceOptionList = sus.data;
                this.serviceCategoryList = res.data;


                this.devData = devRes.data;
                this.dialogEditVisible = true;
                this.editData = Object.assign({}, row);
                this.editData.sort = this.editData.sort + '';
                this.editData.areaShortname = this.getAreaName(this.editData.areaId);
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                if (node) {
                    let level1 = [{
                        type: 'static', value: () => {
                            return null
                        }, code: 'areaId'
                    }];
                    let level2 = [{
                        type: 'static', value: () => {
                            return node.data.areaId
                        }, code: 'areaId'
                    }];
                    let level3 = [
                        {
                            type: 'static', value: () => {
                                return node.data.areaId
                            }, code: 'areaId'
                        },
                        {
                            type: 'static', value: () => {
                                return node.data.parentId
                            }, code: 'parentId'
                        },
                    ];
                    let level4 = [
                        {
                            type: 'static', value: () => {
                                return node.data.areaId
                            }, code: 'areaId'
                        },
                        {
                            type: 'static', value: () => {
                                return node.data.parentId
                            }, code: 'parentId'
                        },
                        {
                            type: 'static', value: () => {
                                return node.data.categoryId
                            }, code: 'categoryId'
                        }
                    ];
                    if (node.level == 1) {
                        this.dynamicQuery(level1);
                    } else if (node.level == 2) {
                        this.dynamicQuery(level2);
                    } else if (node.level == 3) {
                        this.dynamicQuery(level3);
                    } else if (node.level == 4) {
                        this.dynamicQuery(level4);
                    }
                }
            },
            /**
             * 动态切换查询条件
             */
            dynamicQuery(arr) {
                this.query = [];
                this.query = arr;
                this.query.push(...this.queryObj);
            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                if (rows.length > 0) {
                    let checked_ids = '';
                    let checked_status = '';
                    for (let i = 0; i < rows.length; i++) {
                        checked_ids += rows[i].oid + ','
                        checked_status += rows[i].isPublished + ',';
                    }
                    this.checked_ids = checked_ids;
                    this.checked_status = checked_status;
                    this.choosedFlag = true
                } else {
                    this.choosedFlag = false
                }
            },
            publishCallback() {
                let url = "/pro/ProScTechCatalog/modifyPublishedState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要发布当前选中记录吗?"
                let tip = "发布"
                this.confirmTemp(url, warning, tip, paramData)
            },
            cancelPublishCallback() {
                let url = "/pro/ProScTechCatalog/modifyPublishedState"
                let paramData = {"params": {"type": 0, "ids": this.checked_ids}}
                let warning = "确定要取消发布当前选中记录吗?"
                let tip = "取消发布"
                this.confirmTemp(url, warning, tip, paramData)
            },
            startCallback() {
                let url = "/pro/ProScTechCatalog/modifyDisabledState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要启用当前选中记录吗?"
                let tip = "启用"
                this.confirmTemp(url, warning, tip, paramData)
            },
            endCallback() {
                let url = "/pro/ProScTechCatalog/modifyDisabledState"
                let paramData = {"params": {"type": 0, "ids": this.checked_ids}}
                let warning = "确定要停用当前选中记录吗?"
                let tip = "停用"
                this.confirmTemp(url, warning, tip, paramData)
            },
            confirmTemp(url, warning, tip, paramData) {
                if (this.choosedFlag) {
                    this.$confirm(warning, tip, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.get(url, paramData)
                            .then(result => {
                                this.$message.success("操作成功");
                                this.refresh();
                                this.choosedFlag = false;
                            }).catch(error => {
                            this.$message.error(error.msg);
                        });
                    }).catch(() => {
                    });
                } else {
                    this.$message.warning('请先选择需要操作的记录！');
                }
            },
            moreOptionCallback() {
                if (this.choosedFlag) {
                    this.dialogVisibleProScBizCatalog = true;
                    this.$nextTick(() => {
                        this.$refs.$moreOpt.show();
                    })
                } else {
                    this.$message.warning('请先选择需要操作的记录！');
                }

            },
            closeDialog() {
                this.dialogVisibleProScBizCatalog = false;
                this.refresh();
            },
            closeBatchDialog() {
                this.refresh();
                this.refreshTree();
            },
            associateCatalog() {
                //获取服务分类信息
                let _this = this;
                this.$nextTick(() => {
                    this.$axios.get('/pro/ProScTechCatalog/categoryAll', {"params": {"bigCategoryId": _this.editData.parentId}})
                        .then(result => {
                            this.serviceCategoryList = result.data
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
                this.editData.categoryId = '';
                this.editData.templateId = '';
            },
            associateOption() {
                //获取服务项信息
                this.$axios.get('/pro/ProScTechCatalog/catalogAll', {"params": {"categoryId": this.editData.categoryId}})
                    .then(result => {
                        this.serviceOptionList = result.data
                        console.log(result.data);
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
                this.editData.templateId = '';
            },
            saveBatchData() {
                this.$refs.$serviceBatch.saveServeBatch();
            },
            saveMoreOptData() {
                this.$refs.$moreOpt.saveData();
            },
            initSelectData() {
                //获取技术服务区域
                this.$axios.get('/pro/ProScTechCatalog/areaAll')
                    .then(result => {
                        this.regionList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
                //获取服务大类
                this.$axios.get('/pro/ProScTechCatalog/bigCategoryAll')
                    .then(result => {
                        this.serviceMenuList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });

                //获取第三方技术支持方信息
                this.$axios.get('/pro/ProScTechCatalog/allThirdparty')
                    .then(result => {
                        this.thirdPartyList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
                let _this = this;
                this.columnsDev = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {
                        label: '设备名称', code: 'name', renderCell(h, data) {
                            return data.row.name;
                        }, width: 150
                    },
                    {
                        label: '设备类型', code: 'category', renderCell(h, data) {
                            return _this.onCategoryRenderer(data.row.category);
                        }, width: 120
                    },
                    {label: '设备编号', code: 'devSn', width: 100},
                    {label: '责任人', code: 'dutyName', width: 120},
                    {
                        label: '密级',
                        code: 'secretLevel',
                        width: 100,
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE
                    },
                    {
                        label: '涉密属性', code: 'secret', width: 100, renderCell(h, data) {
                            return _this.onSecretRenderer(data.row.secret);
                        }
                    },];
            },
        },
        mounted() {
            this.requestCategoryData();
            this.initSelectData();//初始化新增--服务对象--列表
        },
        watch: {},
    }
</script>

<style lang="less" scoped>

    .dev-container {
        width: 94%;
        background-color: #FFFFFF;
        overflow-y: auto;
        height: 400px;
        max-height: 400px;
    }

    .required-star {
        color: red;
    }

    .tableBtn {
        margin-bottom: 8px;
        margin-left: 8px;
    }

    .form-content {
        width: 100%;
    }
</style>