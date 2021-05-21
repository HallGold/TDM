<template>
    <div class="ice-container"
         :style="(minHeight+'').indexOf('px')==-1?{minHeight:minHeight+'px'}:{minHeight:minHeight}">
        <div class="ice-grid-tool-bar " v-if="buttons.length>0&&!disabled">
            <div class="ice-grid-button-bar">
                <el-button :type="button.type?button.type:'primary'"
                           :icon="button.icon?button.icon:''"
                           :disabled="buttonDisabled(button)"
                           v-show="!buttonIsHidden(button)"
                           v-for="button in buttons.filter(item=>(item.type!='dropdown'))"
                           @click="buttonClick(button)" :key="button.name">{{button.name}}
                </el-button>
                <el-dropdown style="margin-left: 10px" placement="bottom"
                             :key="button.name"
                             v-for="button in buttons.filter(item=>item.type=='dropdown')"
                             @command="buttonClick(button,$event)">
                    <el-button type="primary" icon="el-icon-plus">
                        {{button.name}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in button.items" :key="item.code" :command="item.code">
                            {{item.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <ice-editable-table
                :data="gridData"
                :height="minHeight"
                :rules="rules"
                ref="detailtable">
            <el-table-column :width="50"
                             v-if="gridIndex"
                             label="序号">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
            </el-table-column>
            <template v-for="(item,index) in columns">
                <ice-editable-table-column :prop="item.code"
                                           :key="item.code"
                                           :width="isFit(item,index)?null:item.width"
                                           :min-width="isFit(item,index)?item.width:null"
                                           :fit="isFit(item,index)"
                                           :label="item.label"
                                           :disabled="disabled"
                                           v-if="item.editable"
                                           :input-type="item.type"
                                           :map-type-code="item.mapTypeCode"
                                           v-bind="item">
                </ice-editable-table-column>
                <ice-table-column :prop="item.code"
                                  :key="item.code"
                                  :fit="isFit(item,index)"
                                  :width="isFit(item,index)?null:item.width"
                                  :min-width="isFit(item,index)?item.width:null"
                                  v-if="!item.editable"
                                  :input-type="item.type"
                                  :label="item.label"
                                  :map-type-code="item.mapTypeCode"
                                  v-bind="item">>
                </ice-table-column>
            </template>
            <el-table-column
                    v-if="operations.length>0&&!disabled"
                    fixed="right"
                    label="操作"
                    :width="operationsWidth" align="center">
                <template slot-scope="scope">
                    <el-button @click.stop="columnClick(operation,scope.row,scope.$index)"
                               type="text"
                               size="small"
                               v-for="operation in operations"
                               :key="operation.name"
                               v-if="operationShowable(operation,scope.row,scope.$index)">
                        {{operation.name}}
                    </el-button>
                </template>
            </el-table-column>
        </ice-editable-table>
    </div>

</template>

<script>
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceTableColumn from "@/components/common/base/IceTableColumn";

    export default {
        name: "EditableTable",
        model: {
            prop: 'gridData',
            event: "table-change"
        },
        props: {
            minHeight: String,
            gridIndex: Boolean,
            columns: {
                type: Array,
                default: () => []
            },
            buttons: {
                type: Array,
                default: () => []
            },
            operations: {//网格行按钮清单
                type: Array,
                default: function () {
                    return []
                }
            },
            gridData: {//网格数据
                type: Array,
                default: function () {
                    return []
                }
            },
            rules: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            dataUrl: String,
            disabled: {
                type: Boolean,
                default: false
            },
            operationsWidth: {
                type: Number,
                default: 120
            },
            activeStatus: Boolean,
            primaryProp: String
        },
        data() {
            return {

                deleteData: []
                /*     gridData: this.gridData,*/
                /* detailRules: {},*/
            }
        },
        methods: {
            getItemInputType(type) {
                switch (type) {
                    /*   case "text":
                           return "input"
                       case "text":
                           return "input"*/
                }
            },
            isFit(column, index) {
                return column.fit || (this.columns.findIndex(column => column.fit) == -1 && index == this.columns.length - 1)
            },
            //toolbar按钮点击事件
            buttonClick(button, $event) {
                if (button.callback) {
                    button.callback($event);
                    return;
                }

                switch (button.commond) {
                    case 'addRow':
                        this.addRow(button.data && typeof button.data == 'function' ? button.data() : {});
                        break;
                }


            },

            //toolbar按钮隐藏判断
            buttonIsHidden(button) {
                if (typeof (button.hidden) === 'undefined') {
                    return false
                } else if (typeof (button.hidden) === 'function') {
                    return button.hidden();
                } else {
                    return button.hidden
                }
            },

            //toolbar按钮禁用判断
            buttonDisabled(button) {
                if (typeof (button.disabled) === 'undefined') {
                    return false
                } else if (typeof (button.disabled) === 'function') {
                    return button.disabled();
                } else {
                    return button.disabled
                }
            },


            //网格行按钮点击事件
            columnClick(operation, row, index) {

                switch (operation.commond) {
                    case 'moveup':
                        this.moveup(row, index);
                        break;
                    case 'movedown':
                        this.movedown(row, index);
                        break;
                    case 'deleteRow':
                        this.deleteRow(row, index);
                        break;
                    default:
                        if (operation.callback) {
                            operation.callback(row, index);
                        }

                }
            },

            //网格行按钮显示判断
            operationShowable(operation, row, index) {
                if (operation.isShow) {
                    return operation.isShow(row, index);
                }

                switch (operation.commond) {
                    case 'moveup':
                        return index != 0;
                    case 'movedown':
                        return index != this.gridData.length - 1;
                    default:
                        return true;
                }

            },

            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },

            moveup(row, index) {
                if (index != 0) {
                    this.$emit("table-change", this.swapArray(this.gridData, index, index - 1));
                }
            },
            movedown(row, index) {
                if (index + 1 != this.gridData.length) {
                    this.$emit("table-change", this.gridData = this.swapArray(this.gridData, index, index + 1));
                }
            },

            addRow(row) {
                const item = {};
                this.columns.forEach(column => {
                    item[column.code] = column.defaultValue ? column.defaultValue : '';
                })
                if (row) {
                    Object.assign(item, row)
                }
                if (this.activeStatus) {
                    item.$status = 'add'
                }
                this.$refs.detailtable.clearValidateRow(this.gridData.length);
                this.$emit("table-change", [...this.gridData, item])

            },
            deleteRow(row, index) {
                this.$refs.detailtable.deleteValidateRow(index);
                if (this.activeStatus) {
                    const deleteRow = this.gridData[index]
                    deleteRow.$status = 'delete'
                    this.deleteData.push(deleteRow);
                }
                this.$emit("table-change", this.gridData.filter((item, i) => i !== index))
            },
            refresh() {
                this.$axios.get(this.dataUrl)
                    .then(result => {
                        this.$emit("table-change", result.data);
                    })
                    .catch(e => {
                        this.$message.error("数据加载失败");
                    })
            },
            async validateAll(...params) {
                if (await this.$refs.detailtable.validateAll(...params)) {
                    return true
                } else {
                    throw '数据校验未通过'
                }
            },
            validate(...params) {
                return this.validateAll(...params)
            }
        },
        created() {

        },
        mounted() {

        },
        watch: {
            /* gridData: {
                 handler(newName, oldName) {
                     this.$emit("table-change", newName)
                 },
                 deep: true
             }*//*,
            gridData: {
                handler(newValue, oldName) {
                    newValue
                },
                deep: true
            }*/
        },
        components: {
            IceEditableTable,
            IceEditableTableColumn,
            IceTableColumn,
        }
    }
</script>

<style lang="less" scoped>

</style>