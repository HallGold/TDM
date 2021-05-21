<template>
    <div>
        <el-dialog v-dialog-drag
                   title="数据隔离策略配置"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="1200px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <div class="outer">
                <div class="inner">
                    <ice-query-grid :gridData="gridData"
                                    ref="grid"
                                    chooseItem="single"
                                    :columns="columns"
                                    :pagination="false"
                                    align="left"
                                    @selection-change="selectionChangeGrid"
                                    :buttons="buttons"></ice-query-grid>
                </div>
                <div class="inner_cls">
                    <div style="margin-bottom: 6px;margin-left: 9px;">
                        <el-button @click="saveStrategyItem" type="primary">确定</el-button>
                        <el-button @click="deleteStrategyItem" type="primary" style="display: none">删除表策略配置</el-button>
                    </div>
                    <el-table :data="gridDataQ" ref="tbl" style="width: 100%" height="356px" @select="selectRow">
                        <el-table-column type="selection">
                        </el-table-column>
                        <el-table-column prop="privtypeName"
                                         label="策略分组">
                        </el-table-column>
                        <el-table-column prop="privilegeName"
                                         align="left"
                                         :width="180"
                                         :show-overflow-tooltip="true"
                                         label="隔离策略">
                        </el-table-column>
                        <!--<el-table-column prop="isDefault"-->
                                         <!--label="默认策略">-->
                        <!--</el-table-column>-->
                        <el-table-column prop="paramCfg"
                                         label="参数值">
                            <template slot-scope="scope">
                                <el-button type="text" style="margin-right: 5px"
                                           @click="paramsConfig(scope.$index,scope.row)"
                                           v-if="scope.row.paramCfg.inputType=='20' && scope.row.isAuthed === true">配置
                                </el-button>

                                <el-popover trigger="hover" placement="right">
                                    <el-input type="textarea" rows="3" v-model="scope.row.authParamValuename"
                                              :readonly="scope.row.paramCfg.inputType=='20'"></el-input>
                                    <div slot="reference">
                                        <el-button type="text" style="margin-right: 5px"
                                                   @click="paramsConfig(scope.$index,scope.row)"
                                                   v-if="scope.row.paramCfg.inputType=='90' && scope.row.isAuthed === true">配置
                                        </el-button>
                                        <el-button type="text" style="margin-right: 5px" size="medium"
                                                   v-if="scope.row.paramCfg.inputType=='20'
                                                    && scope.row.isAuthed === true">
                                            查看
                                        </el-button>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="privilegeDesc"
                                         label="策略描述">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <!--        <div class="ice-button-bar dialog_cls">-->
            <!--            <el-button type="info" @click="closeDialog">关闭</el-button>-->
            <!--        </div>-->
        </el-dialog>
        <params-select ref="paramsSelect" @chooseItem="chooseValue"></params-select>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import ParamsSelect from "../comm/paramsSelect";

    export default {
        name: "dataConfigEdit",
        components: {ParamsSelect, IceEditableTable, IceQueryGrid},
        props: {
            isChange: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                isOK: false,
                columns: [
                    {label: '表名', code: 'tableCode', align: 'left', width: 240},
                    {
                        label: '数据授权', code: 'dataAuthEnabled', width: 80, renderCell(h, data) {
                            return data.row.dataAuthEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                    {label: '中文名', align: 'left', code: 'tableName'}
                ],
                buttons: [],
                queryQ: [],
                columnsQ: [],
                buttonsQ: [],
                gridData: [],
                gridDataQ: [],
                dialogVisible: false,
                privTypeId: '',
                funcServAuthId: '',              //服务隔离策略授权Id
                pageFuncId: '',                  //页面功能Id
                roleId: '',                      //角色Id
                serviceId: '',                   //服务Id
                tableId: '',                     //数据表Id
                authFuncId: '',                  //角色页面功能授权Id
                allObj: {},                      //父页面传过来的对象
                tableIdItem: '',                 //当前页面表tableId
                copyArr: [],                     //拷贝一个父页面传来的对象里的数组，用于取消
                gridDataQindex: 0,                //策略配置下标
                gridDataQtype: '',                //策略配置的参数类型
                gridDataQvalue: '',              //策略配置的参数的值范围
                gridDataQisTrue: false,          //策略配置的参数是否可多选
            }
        },
        methods: {
            /**
             * 参数配置
             */
            paramsConfig(index, data) {
                let obj = {...data.paramCfg};
                this.$refs.paramsSelect.openDialog(obj,data);
                this.gridDataQindex = index;
                this.gridDataQtype = data.paramCfg.inputType;
                this.gridDataQvalue = data.paramCfg.valueType;
                this.gridDataQisTrue = data.paramCfg.isMulti == 'Y' ? true : false
            },
            chooseValue(data) {
                let tblDataArr = [];
                Object.assign(tblDataArr, this.gridDataQ);
                let str = '';
                let name = '';
                if (this.gridDataQtype == '20' && this.gridDataQisTrue) {//判定参数是否为弹出框，并且为多选
                    let arr = [];
                    if (this.gridDataQvalue == '10') {//判定参数是否为选择部门--部门层级码
                        data.forEach(item => {
                            arr.push(item.deptLevCode);
                            name+=','+item.deptShortName+'('+item.orgShortName+')';
                        });
                        str = arr.join(',');
                    }else if(this.gridDataQvalue == '11'){//部门编码
                        data.forEach(item=>{
                            arr.push(item.deptCode);
                            name+=','+item.deptShortName+'('+item.orgShortName+')';
                        });
                        str = arr.join(',');
                    } else if (this.gridDataQvalue == '20') {//判定参数是否为选择单位
                        data.forEach(item => {
                            arr.push(item.deptLevCode);//接口未定义，暂时取部门的值
                            name+=','+item.deptShortName;
                        });
                        str = arr.join(',');
                    } else if(this.gridDataQvalue == '21'){
                        data.forEach(item=>{
                            arr.push(item.deptCode);
                            name+=','+item.deptShortName;
                        });
                        str = arr.join(',');
                    }else{
                        str = data;
                    }
                } else if (this.gridDataQtype == '20' && !this.gridDataQisTrue) {//判定参数是否为弹出框，并且为单选
                    if (this.gridDataQvalue == '10') {//判定参数是否为选择部门
                        str = data[0].deptLevCode;
                        name=data[0].deptShortName+'('+data[0].orgShortName+')';
                    }else if(this.gridDataQvalue == '11'){
                        str = data[0].deptCode;
                        name=data[0].deptShortName+'('+data[0].orgShortName+')';
                    } else if (this.gridDataQvalue == '20') {//判定参数是否为选择单位
                        str = data[0].deptLevCode;//接口未定义，暂时取部门的值
                        name=data[0].deptShortName;
                    } else if(this.gridDataQvalue == '21'){
                        str = data[0].deptCode;//接口未定义，暂时取部门的值
                        name=data[0].deptShortName;
                    }else{
                        str = data;
                    }
                } else {
                    str = data;
                }
                // tblDataArr[this.gridDataQindex].paramValue = str;
                tblDataArr[this.gridDataQindex].authParamValue = str;
                if(this.gridDataQisTrue){
                    tblDataArr[this.gridDataQindex].authParamValuename = name.substring(1);
                }else{
                    tblDataArr[this.gridDataQindex].authParamValuename = name;
                }

                this.gridDataQ = tblDataArr;
                this.$nextTick(() => {
                    this.gridDataQ.forEach(item => {
                        this.$refs.tbl.toggleRowSelection(item, item.isAuthed);
                    });
                })
            },
            /**
             * 初始化组件部分
             */
            initComponent() {

                this.buttons = [
                    {name: '删除服务策略配置', callback: this.deleteFunctionItem}
                ];
            },
            /**
             * 删除服务策略配置
             */
            deleteFunctionItem() {
                this.$axios.delete("/permission/role/outer/del/serv_priv_auth",
                    {
                        params: {
                            funcServAuthId: this.funcServAuthId,
                            pageFuncId: this.pageFuncId,
                            roleId: this.roleId,
                            serviceId: this.serviceId
                        }
                    }).then(success => {
                    this.gridData = success.data;
                    if (this.gridData && this.gridData.length > 0) {
                        this.$nextTick(() => {
                            this.$refs.grid.$refs.eltable.setCurrentRow(this.gridData[0]);
                            this.selectionChangeGrid(this.gridData[0]);
                        })
                    } else {
                        this.gridDataQ = [];
                        this.$refs.tbl.clearSelection();
                    }
                    this.copyArr = [...this.gridData]
                    this.allObj.servTblRelInfoList = this.gridData;
                    this.$message.success("删除成功");
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**
             * 左边table列表的几点事件
             */
            selectionChangeGrid(row) {
                this.gridDataQ = Array.isArray(row)?row[0].servDefaultPrivList:row.servDefaultPrivList;
                let _this = this;
                this.funcServAuthId = row.authId;
                this.$nextTick(() => {
                    this.gridDataQ.forEach(item => {
                        _this.$refs.tbl.toggleRowSelection(item, item.isAuthed);
                    });
                });
                this.tableIdItem = row.tableId;
            },
            /**
             * 确定
             */
            saveStrategyItem() {
                this.isOk = true;
                this.allObj.servTblRelInfoList = this.gridData;
                this.dialogVisible = false;
                this.$emit('data-changed', true);
            },
            /**
             * 删除表策略配置
             */
            deleteStrategyItem() {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/role/outer/del/servtbl_priv_auth",
                        {
                            params: {
                                funcServAuthId: this.funcServAuthId,
                                pageFuncId: this.pageFuncId,
                                roleId: this.roleId,
                                serviceId: this.serviceId,
                                tableId: this.tableIdItem
                            }
                        }).then(success => {
                        this.$message.success("删除成功");
                        this.gridDataQ.forEach(item => {
                            item.isAuthed = false;
                            /*this.$refs.gridQ.$refs.eltable.toggleRowSelection(item, item.isAuthed);*/
                            this.$refs.tbl.toggleRowSelection(item, item.isAuthed);
                        });
                    }).catch(error => {
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            },
            /**
             * 取消
             */
            closeDialog() {
                this.dialogVisible = false;
                if (!this.isOk) {
                    this.allObj.servTblRelInfoList = this.copyArr;
                } else {
                    this.allObj.servTblRelInfoList = this.gridData;
                }

            },
            /**
             * 打开弹出
             */
            openDialog(obj, roleId) {
                this.isOk = false;
                this.pageFuncId = obj.dataParentKey;
                this.serviceId = obj.pageOrServiceId;
                this.authFuncId = obj.roleAuthId ? obj.authFuncId : '';
                this.tableId = obj.tableId ? obj.tableId : '';
                this.roleId = roleId;
                this.dialogVisible = true;
                this.allObj = obj;
                this.copyArr = [...obj.servTblRelInfoList];
                this.$nextTick(() => {
                    if (obj.servTblRelInfoList.length == 0) {
                        this.initData();
                    } else {
                        this.gridData = obj.servTblRelInfoList;
                        if (this.gridData && this.gridData.length > 0) {
                            this.$nextTick(() => {
                                this.$refs.grid.$refs.eltable.setCurrentRow(this.gridData[0]);
                                this.selectionChangeGrid(this.gridData[0])
                            })
                        } else {
                            this.gridDataQ = [];
                            this.$refs.tbl.clearSelection();
                        }
                    }
                });

            },
            /**
             * 列表勾选的数据
             */
            selectRow(selections, row) {
                if (selections.indexOf(row) != -1) {
                    row.isAuthed = true;
                    row.checked = true;
                } else {
                    row.isAuthed = false;
                    row.checked = false;
                }
                if (this.gridDataQ && this.gridDataQ.length > 0) {
                    for (let i = 0; i < this.gridDataQ.length; i++) {
                        let orow = this.gridDataQ[i];
                        if (orow.privilegeId == row.privilegeId) {
                            orow.isAuthed = row.isAuthed;
                            orow.checked = row.checked;
                        }
                    }
                }
            },
            initData() {
                this.$axios.get("/permission/role/outer/get/serv_priv_infos", {
                    params: {
                        pageFuncId: this.pageFuncId,
                        roleId: this.roleId,
                        serviceId: this.serviceId,
                        authFuncId: this.authFuncId,
                        tableId: this.tableId
                    }
                }).then(success => {
                    this.gridData = success.data;
                    if (this.gridData && this.gridData.length > 0) {
                        this.$nextTick(() => {
                            this.$refs.grid.$refs.eltable.setCurrentRow(this.gridData[0]);
                            this.selectionChangeGrid(this.gridData[0]);
                        })
                    } else {
                        this.gridDataQ = [];
                        this.$refs.tbl.clearSelection();
                    }
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            }
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style scoped>
    .outer {
        width: 100%;
        position: relative;
    }

    .inner {
        width: 50%;
        /*margin-right: 5px;*/
    }

    .inner_cls {
        width: 50%;
        position: absolute;
        right: -2px;
        top: 6px;
        background-color: #ffffff;
    }

    .dialog_cls {
        background-color: #ffffff;
    }
</style>
