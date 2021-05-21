import {dragableAttrs} from "../../BaseDragableElement";
import BasePanel from "../BasePanel";
import IceQueryGrid from "../../../base/IceQueryGrid";
import IceDialog from "../../../base/IceDialog";
import TableColumnEditor from "./TableColumnEditor";
import TableToolBarEditor from "./TableToolBarEditor";
import TableRowButtonsEditor from './TableRowButtonsEditor'
import TableQuerysEditor from './TableQuerysEditor'
import EditableTable from "./EditableTable";
import './TablePanel.less'

export default {
    meta: {
        name: 'tablepanel',
        type: 'panel',
        icon(h, dragstart, dragend) {
            return <div class="input iconfont icon-biaoge">数据表格</div>
        },

        dragable(overEleType, overEleName) {
            if (overEleType == "layout") {
                return true
            }
            return false;
        },
        attrs() {
            return [...dragableAttrs,
                {key: 'code', keylabel: '网格编码', deleteable: false, keyreadonly: true},
                {key: 'editable', keylabel: '是否可编辑', deleteable: false, keyreadonly: true, valuetype: "checkbox"},
                {key: 'gridIndex', keylabel: '是否显示序号', deleteable: false, keyreadonly: true, valuetype: "checkbox"},
                {
                    key: 'selectable',
                    keylabel: '是否可选择',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [{code: 'none', text: '不可选择'}, {code: 'single', text: '单选'}, {code: 'multiple', text: '多选'}],
                    showable: attrs => !attrs.editable
                },
                {
                    key: 'pagination',
                    keylabel: '是否启用分页',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "checkbox",
                    showable: attrs => !attrs.editable
                },
                {
                    key: 'showable',
                    keylabel: '控件显示规则',
                    deleteable: false,
                    valuetype: "script",
                    keyreadonly: true,
                    initValueModel: 'function'
                },
                {
                    key: 'disabled',
                    keylabel: '控件禁用规则',
                    deleteable: false,
                    valuetype: "script",
                    keyreadonly: true,
                    initValueModel: 'function'
                }
            ]
        },


        basicAttrs() {
            return [
                {
                    key: 'datasource',
                    keylabel: '数据源',
                    deleteable: true,
                    valuetype: "select",
                    list: [
                        {code: 'dataurl', text: 'url服务'},
                        {code: 'formData', text: '表单内置'}
                    ]
                },
                {
                    key: 'data-url',
                    keylabel: 'url地址',
                    deleteable: true,
                    showable: (attr) => attr['datasource'] == 'dataurl'
                },
                {
                    key: 'gridAutoRefresh',
                    keylabel: '自动加载',
                    deleteable: true,
                    valuetype: "checkbox",
                    showable: (attr) => attr['datasource'] == 'dataurl'
                },
            ]
        }
    },
    clazz: class TablePanel extends BasePanel {
        constructor(editor) {
            super(editor);
            this.name = 'tablepanel';
            this.type = 'panel';
            this.attrs.title = "数据表格"//标题
            this.attrs.code = ""//标题
            this.attrs.editable = false
            this.attrs.selectable = 'none'
            this.attrs.gridIndex = true
            this.attrs.pagination = true
            this.attrs.showable = true;
            this.attrs.disabled = false;
            this.style = {'min-height': '300px'}
            this.columns = [{label: '请维护列信息', code: 'columnName', type: 'input', width: 100}]
            this.buttons = []
            this.operations = []
            this.querys = [];
            this.columnsDialogVisible = false
            this.buttonsDialogVisible = false
            this.operationsDialogVisible = false
            this.querysDialogVisible = false
            this.value = []
            this.validateTypeMessage = {
                'string': '必须输入文本',
                'number': '必须输入数字',
                'integer': '必须输入整数',
                'float': '必须输入浮点数',
                'email': '格式不正确',
                'date': '必须输入日期',
                'url': '格式不正确'
            }
            this.basicAttrs = {datasource: 'dataurl', 'data-url': '', gridAutoRefresh: true}
            this.selectedList = [];
        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                columns: this.columns.map(column => {
                    let copyColumn = {...column};
                    delete copyColumn.formatter;
                    return copyColumn
                }),
                buttons: this.buttons.map(button => {
                    let copyButton = {...button};
                    delete copyButton.callback;
                    delete copyButton.disabled;
                    delete copyButton.hidden;
                    return copyButton
                }),
                operations: this.operations.map(operation => {
                    let copyOperation = {...operation};
                    delete copyOperation.callback;
                    delete copyOperation.isShow;
                    return copyOperation;
                }),
                querys: this.querys.map(query => {
                    let copyQuery = {...query};
                    //delete copyQuery.value;
                    delete copyQuery.click;
                    return copyQuery;
                })
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            if (snapshoot) {
                this.columns = this.columns = snapshoot.columns.map(column => {
                    this.resolveExpressString(column, 'formatterExpress', 'formatter')
                    return column
                });
                this.buttons = snapshoot.buttons.map(button => {
                    this.resolveFunctionString(button, 'buttonAction', 'callback')
                    this.resolveExpressString(button, 'disableExpress', 'disabled')
                    this.resolveExpressString(button, 'hiddenExpress', 'hidden')
                    return button
                });
                this.operations = snapshoot.operations.map(operation => {
                    this.resolveFunctionString(operation, 'buttonAction', 'callback')
                    this.resolveExpressString(operation, 'showExpress', 'isShow')
                    return operation
                });
                this.querys = snapshoot.querys.map(query => {
                    if (query.type == 'static') {
                        this.resolveExpressString(query, 'valueExpress', 'value')
                    }
                    return query
                });
            }
        }


        setValue(value) {
            if (value == null) {
                return
            }
            if (!(value instanceof Array)) {
                console.error(`${this.attrs.title ? this.attrs.title : this.name} value必须是数组,请检查`)
                return;
            }
            if (!this.attrs.code) {
                console.error(`${this.attrs.title ? this.attrs.title : this.name} code是空,请维护`)
                return;
            }
            this.value = value;
            this.editor.$set(this.editor.formData, this.attrs.code, value);
        }


        setSelectedValue(value) {
            if (!this.attrs.code) {
                //console.error(`${this.attrs.title ? this.attrs.title : this.name} code是空,请维护`)
                return;
            }
            this.selectedList = value;
            this.editor.$set(this.editor.formData, `${this.attrs.code}#selected`, value);
        }

        getValue() {
            return this.editor.formData[this.attrs.code];
        }

        getDataControl() {
            return {
                name: this.attrs.title, code: this.attrs.code, columns: this.columns.map(column => {
                    return {name: column.label, code: column.code}
                })
            };
        }


        getButtonInfo() {
            const toolBarButtons = this.buttons.map(button => {
                return {name: button.name, code: button.code}
            });

            const rowButtons = this.operations.map(operation => {
                return {name: operation.name, code: operation.code}
            });
            return [...toolBarButtons, ...rowButtons]
        }


        renderEdirtor(h) {
            return super.renderEdirtor(h, h => {
                return (<ice-query-grid
                    style={this.getStyleString("min-height")}
                    min-height={this.style["min-height"]}
                    choose-item={this.attrs.selectable}
                    grid-index={this.attrs.gridIndex}
                    pagination={this.attrs.pagination && !this.attrs.editable}
                    columns={this.columns}
                    buttons={this.buttons.map(item => {
                        return {...item, unauth: true};
                    })}>

                </ice-query-grid>)
            })
        }

        render(h) {

            if (typeof this.isShow === 'function' && !this.isShow()) {
                return '';
            }

            return super.render(h, h => {

                if (this.attrs.editable) {
                    return <editable-table
                        style={this.getStyleString("min-height")}
                        min-height={this.style["min-height"] ? this.style["min-height"] : '300px'}
                        grid-index={this.attrs.gridIndex}
                        columns={this.columns}
                        buttons={this.buttons}
                        grid-data={this.getValue()}
                        operations={this.operations}
                        rules={this.loadTableValidateRules()}
                        disabled={this.isDisabled()}
                        ref={this.getRefName()}
                        {...{
                            on: {
                                'table-change': value => {
                                    this.setValue(value)
                                }
                            }
                        }}>

                    </editable-table>
                } else {
                    return (<ice-query-grid
                        style={this.getStyleString("min-height")}
                        min-height={this.style["min-height"] ? this.style["min-height"] : '300px'}
                        grid-index={this.attrs.gridIndex}
                        pagination={this.attrs.pagination}
                        columns={this.columns}
                        buttons={this.buttons}
                        query={this.querys}
                        grid-data={this.basicAttrs.datasource == 'formData' ? this.getValue() : null}
                        operations={this.operations}
                        grid-auto-refresh={this.basicAttrs.gridAutoRefresh}
                        data-url={this.basicAttrs['data-url']}
                        choose-item={this.attrs.selectable}
                        ref={this.getRefName()}
                        {...{
                            on: {
                                'table-change': value => {
                                    this.setValue(value)
                                },
                                'selection-change': value => {
                                    this.setSelectedValue(value)
                                    this.reRender();
                                }
                            }
                        }}>

                    </ice-query-grid>)
                }


            })
        }

        additionAttrsRender(h) {
            return (<div>
                <el-card header="网格列信息" class="card">
                    <div style="display: flex;justify-content: center;">
                        <el-button type="text" style="margin:auto;" {...{
                            on: {
                                'click': evt => {
                                    if (this.checkAttrsCode()) {
                                        this.columnsEdit()
                                    }

                                }
                            }
                        }} >网格列维护(共{this.columns.length}列)
                        </el-button>

                        <table-column-editor table-columns={this.columns}
                                             editable={this.attrs.editable}
                                             visible={this.columnsDialogVisible}
                                             {...{
                                                 on: {
                                                     'update:visible': value => {

                                                         this.columnsDialogVisible = value
                                                     },
                                                     'columns-update': value => {
                                                         this.columns = value
                                                         this.columnsDialogVisible = false
                                                     },
                                                 }
                                             }} >
                        </table-column-editor>

                    </div>

                </el-card>
                <el-card header="查询条件信息" class="card">
                    <div style="display: flex;justify-content: center;">
                        <el-button type="text" style="margin:auto;" {...{
                            on: {
                                'click': evt => {
                                    this.querysEdit()
                                }
                            }
                        }} >查询条件(共{this.querys.length}个)
                        </el-button>

                        <table-querys-editor table-querys={this.querys}
                                             visible={this.querysDialogVisible}
                                             {...{
                                                 on: {
                                                     'update:visible': value => {

                                                         this.querysDialogVisible = value
                                                     },
                                                     'querys-update': value => {
                                                         value.forEach(item => {
                                                             debugger
                                                             if (item.type == 'static') {
                                                                 this.resolveExpressString(item, 'valueExpress', 'value')
                                                             } else if (item.type == 'tab') {
                                                                 let itemvalue = ''
                                                                 if (item.tablist) {

                                                                     //获取默认tab
                                                                     item.tablist.forEach(tabitem => {
                                                                         if (tabitem.default) {
                                                                             itemvalue = tabitem.value;
                                                                         }
                                                                     })
                                                                     //如果没找到选第一个
                                                                     if (!itemvalue) {
                                                                         if (item.tablist.length > 0) {
                                                                             itemvalue = item.tablist[0];
                                                                         }
                                                                     }
                                                                 }
                                                                 console.log(itemvalue)
                                                                 item.value = itemvalue;
                                                             }

                                                         })
                                                         this.querys = value
                                                         this.querysDialogVisible = false
                                                     },
                                                 }
                                             }} >
                        </table-querys-editor>

                    </div>

                </el-card>

                <el-card header="ToolBar按钮信息" class="card">
                    <div style="display: flex;justify-content: center;">
                        <el-button type="text" style="margin:auto;" {...{
                            on: {
                                'click': evt => {
                                    if (this.checkAttrsCode()) {
                                        this.buttonsEdit()
                                    }
                                }
                            }
                        }} >ToolBar按钮维护(共{this.buttons.length}个)
                        </el-button>

                        <table-tool-bar-editor table-buttons={this.buttons}
                                               table-code={this.attrs.code}
                                               visible={this.buttonsDialogVisible}
                                               {...{
                                                   on: {
                                                       'update:visible': value => {
                                                           this.buttonsDialogVisible = value
                                                       },
                                                       'buttons-update': value => {
                                                           value.forEach(item => {
                                                               if (typeof item.buttonAction == 'string') {
                                                                   this.resolveFunctionString(item, 'buttonAction', 'callback')
                                                               } else if (typeof item.buttonAction == 'function') {
                                                                   item.callback = item.buttonAction
                                                               }

                                                           })
                                                           this.buttons = value
                                                           this.buttonsDialogVisible = false
                                                       },
                                                   }
                                               }} >
                        </table-tool-bar-editor>

                    </div>

                </el-card>

                <el-card header="网格行按钮信息" class="card">
                    <div style="display: flex;justify-content: center;">
                        <el-button type="text" style="margin:auto;" {...{
                            on: {
                                'click': evt => {
                                    if (this.checkAttrsCode()) {
                                        this.operationsEdit()
                                    }
                                }
                            }
                        }} >网格行按钮维护(共{this.operations.length}个)
                        </el-button>

                        <table-row-buttons-editor table-buttons={this.operations}
                                                  table-code={this.attrs.code}
                                                  visible={this.operationsDialogVisible}
                                                  {...{
                                                      on: {
                                                          'update:visible': value => {
                                                              this.operationsDialogVisible = value
                                                          },
                                                          'operations-update': value => {
                                                              value.forEach(item => {
                                                                  if (typeof item.buttonAction == 'string') {
                                                                      this.resolveFunctionString(item, 'buttonAction', 'callback')
                                                                  } else if (typeof item.buttonAction == 'function') {
                                                                      item.callback = item.buttonAction
                                                                  }
                                                                  if (typeof item.showExpress == 'string') {
                                                                      this.resolveExpressString(item, 'showExpress', 'isShow')
                                                                  }
                                                              })
                                                              this.operations = value
                                                              this.operationsDialogVisible = false
                                                          },
                                                      }
                                                  }} >
                        </table-row-buttons-editor>

                    </div>

                </el-card>

            </div>)
        }

        columnsEdit() {
            this.columnsDialogVisible = true
        }

        buttonsEdit() {
            this.buttonsDialogVisible = true
        }

        operationsEdit() {
            this.operationsDialogVisible = true
        }

        querysEdit() {
            this.querysDialogVisible = true
        }

        getRefName() {
            return this.type + ":" + this.name + ":" + this.attrs.code;
        }

        addRow(row) {
            const vueCom = this.editor.$refs[this.getRefName()]
            if (vueCom) {
                if (vueCom.addRow) {
                    vueCom.addRow(row);
                } else {
                    console.warn("addRow is not exist!")
                }

            }
        }


        validate(...params) {
            const table = this.getVueComponent(this.attrs.code);
            if (table) {
                if (table.validate) {
                    table.validate(...params);
                } else {
                    console.warn("validate is not exist!")
                }

            }
        }

        deleteRow(row, index) {
            const vueCom = this.editor.$refs[this.getRefName()]
            if (vueCom) {
                if (vueCom.deleteRow) {
                    vueCom.deleteRow(row, index);
                } else {
                    console.warn("deleteRow is not exist!")
                }
            }
        }

        //刷新数据
        refresh() {
            const vueCom = this.editor.$refs[this.getRefName()]
            if (vueCom) {
                if (vueCom.refresh) {
                    vueCom.refresh();
                } else {
                    console.warn("refresh is not exist!")
                }
            }
        }


        refreshAndPageReset() {
            console.log(this);
            const vueCom = this.editor.$refs[this.getRefName()]
            if (vueCom) {
                if (vueCom.refreshAndPageReset) {
                    vueCom.refreshAndPageReset();
                } else {
                    console.warn("refreshAndPageReset is not exist!")
                }
            }
        }


        //加载table数据校验规则
        loadTableValidateRules() {
            let rules = {}
            if (this.pageReadonly()) {
                return rules;
            }


            this.columns.forEach(item => {
                let arr = [];
                if (item.required) {
                    arr.push({required: true, message: `${item.label}不能为空`})
                }


                if (item.type == 'number') {
                    if (item.repeatable === false) {
                        arr.push({repeatable: false, type: 'number', message: `${item.label}不能重复`})
                    }
                    arr.push({type: 'number', message: `${item.label}必须是数字`})
                }

                if (item.type == 'input') {

                    if (item.repeatable === false) {
                        arr.push({repeatable: false, type: 'string', message: `${item.label}不能重复`})
                    }

                    if (!item.whitespace && item.validate == 'string') {
                        arr.push({whitespace: true, message: `${item.label}不能是空格`})
                    }
                    if (item.validate) {
                        arr.push({
                            type: item.validate,
                            message: `${item.label}${this.validateTypeMessage[item.validate]}`,
                            transform(value) {
                                if ((item.validate == 'number' ||
                                    item.validate == 'integer' ||
                                    item.validate == 'float') && typeof value == 'string') {
                                    return Number(value)
                                }
                                return value
                            }
                        })
                    }
                }


                rules[item.code] = arr
            })
            return rules;
        }


        //是否被选中
        isSelected() {
            if (this.attrs.selectable) {
                return this.selectedList.length > 0;
            }
            return false
        }

        //获取选择列表
        getSelectedList() {
            return this.selectedList;
        }


        isDisabled() {
            /*if (this.pageReadonly()) {
                return true
            }*/


            if (typeof this.attrs.disabled === 'boolean') {
                return this.attrs.disabled
            }

            if (typeof this.attrs.disabled === 'object') {
                return this.execFunction(this.attrs.disabled);
            }

            return false
        }

        isShow() {

            /*if (this.attrs.showable) {
                return true
            }*/

            if (typeof this.attrs.showable === 'boolean') {
                return this.attrs.showable
            }


            if (typeof this.attrs.showable === 'object') {
                return this.execFunction(this.attrs.showable);
            }

            return true

        }


        getPublicScope() {
            return {
                addRow: (...params) => this.addRow(...params),
                validate: (...params) => this.validate(...params),
                deleteRow: (...params) => this.deleteRow(...params),
                refresh: (...params) => this.refresh(...params),
                refreshAndPageReset: (...params) => this.refreshAndPageReset(...params),
                isSelected: (...params) => this.isSelected(...params),
                getSelectedList: (...params) => this.getSelectedList(...params),
            }
        }


    }
    ,
    components: {
        IceQueryGrid,
        IceDialog,
        TableColumnEditor,
        TableToolBarEditor,
        TableRowButtonsEditor,
        TableQuerysEditor,
        EditableTable
    }
}