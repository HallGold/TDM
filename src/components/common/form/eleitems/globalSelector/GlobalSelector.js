import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import './GlobalSelector.less'
import IcePersionSelector from '@/components/common/biz/IcePersionSelector.vue'
import IceDeptSelector from '@/components/common/biz/IceDeptSelector.vue'
import IceDeptPersionSelector from '@/components/common/biz/IceDeptPersionSelector.vue'
import IcePersionByDeptSelector from '@/components/common/biz/IcePersionByDeptSelector.vue'

export default {
    meta: {
        name: 'globalSelector',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="input el-icon-edit-outline">全局选择器</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleName == 'formpanel') {
                return true
            }
            return false;
        },
        attrs() {
            return [
                ...formItemAttrs,
                ...formItemScript
            ]
        },
        basicAttrs() {
            return [
                {
                    key: 'type',
                    keylabel: '选择器类型',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'persion', text: '人员选择'},
                        {code: 'dept', text: '部门选择'},
                        {code: 'dept-persion', text: '部门人员选择'},
                        {code: 'persionByDept', text: '按部门人员选择'},
                        /*  {code: 'custom', text: '自定义'}*/
                    ]
                },
                {
                    key: 'deptCode',
                    keylabel: '部门编码',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "script",
                    initValueModel: 'function',
                    showable: attr => attr['type'] == 'persionByDept'
                }
                ,
                {
                    key: 'mode',
                    keylabel: '显示模式',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'input', text: '可输入选择'},
                        {code: 'onlySelect', text: '仅选择'},
                        /* {code: 'readonly', text: '只读'},*/
                        {code: 'hidden', text: '隐藏'}
                    ]
                },
                {
                    key: 'chooseItem',
                    keylabel: '选择模式',
                    deleteable: false,
                    keyreadonly: true,
                    valuetype: "select",
                    list: [
                        {code: 'single', text: '单选'},
                        {code: 'multiple', text: '多选'}
                    ]
                },

                {
                    key: 'extendProp',
                    keylabel: '附加参数',
                    deleteable: true,
                    keyreadonly: true,
                    valuetype: "script",
                    initValueModel: 'function'
                },

                {
                    key: 'selecteHandler',
                    keylabel: '选择事件',
                    deleteable: true,
                    keyreadonly: true,
                    valuetype: "script",
                    initScript: '(function(items,texts,values,extendParams){\n\t\n  \n  \n})\n'
                },

                {
                    key: 'selectedPersion',
                    keylabel: '已选人员',
                    deleteable: true,
                    keyreadonly: true,
                    valuetype: "script",
                    initValueModel: 'function',
                    showable: attr => attr['type'] == 'persion' || attr['type'] == 'dept-persion',
                },

                {
                    key: 'selectedDept',
                    keylabel: '已选部门',
                    deleteable: true,
                    keyreadonly: true,
                    valuetype: "script",
                    initValueModel: 'function',
                    showable: attr => attr['type'] == 'dept' || attr['type'] == 'dept-persion',
                }
            ]
        }
    },
    clazz: class GlobalSelector extends BaseFormItem {

        constructor(editor) {
            super(editor);
            this.name = 'globalSelector';
            this.type = 'eleItem';
            this.basicAttrs = {
                'type': 'persion',
                'deptCode': '(function(){\n\t\n  \n  \n})\n',
                'mode': 'onlySelect',
                'chooseItem': 'multiple'
            }
        }

        render(h) {
            return super.render(h, h => {
                if (this.basicAttrs.type == 'persion') {
                    return (<ice-persion-selector disabled={this.isDisabled()}
                                                  value={this.getValue()}
                                                  mode={this.isDisabled() ? 'readonly' : this.basicAttrs.mode}
                                                  choose-item={this.basicAttrs.chooseItem}
                                                  extend-prop={this.execFunction(this.basicAttrs['extendProp'])}
                                                  selected-persion={this.execFunction(this.basicAttrs['selectedPersion'])}
                                                  {...{
                                                      "on": {
                                                          "IcePersionSelectorchange": value => {
                                                              if (!this.isDisabled() && this.isShow()) {
                                                                  this.setValue(value);
                                                              }
                                                              this.change(value);
                                                          },
                                                          "select-confirm": (...params) => {
                                                              this.execFunction(this.basicAttrs['selecteHandler'], ...params)
                                                          }
                                                      },
                                                  }}
                                                  ref={this.getRefName()}>
                    </ice-persion-selector>)
                } else if (this.basicAttrs.type == 'dept') {
                    return (<ice-dept-selector disabled={this.isDisabled()}
                                               value={this.getValue()}
                                               mode={this.isDisabled() ? 'readonly' : this.basicAttrs.mode}
                                               choose-item={this.basicAttrs.chooseItem}
                                               extend-prop={this.execFunction(this.basicAttrs['extendProp'])}
                                               selected-dept={this.execFunction(this.basicAttrs['selectedDept'])}
                                               {...{
                                                   "on": {
                                                       "IceDeptSelectorchange": value => {
                                                           if (!this.isDisabled() && this.isShow()) {
                                                               this.setValue(value);
                                                           }
                                                           this.change(value);
                                                       },
                                                       "select-confirm": (...params) => {
                                                           this.execFunction(this.basicAttrs['selecteHandler'], ...params)
                                                       }
                                                   },
                                               }}
                                               ref={this.getRefName()}>
                    </ice-dept-selector>)
                } else if (this.basicAttrs.type == 'dept-persion') {
                    return (<ice-dept-persion-selector disabled={this.isDisabled()}
                                                       value={this.getValue()}
                                                       mode={this.isDisabled() ? 'readonly' : this.basicAttrs.mode}
                                                       choose-item={this.basicAttrs.chooseItem}
                                                       extend-prop={this.execFunction(this.basicAttrs['extendProp'])}
                                                       selected-persion={this.execFunction(this.basicAttrs['selectedPersion'])}
                                                       selected-dept={this.execFunction(this.basicAttrs['selectedDept'])}
                                                       {...{
                                                           "on": {
                                                               "IcePersionSelectorchange": value => {
                                                                   if (!this.isDisabled() && this.isShow()) {
                                                                       this.setValue(value);
                                                                   }
                                                                   this.change(value);
                                                               },
                                                               "select-confirm": (...params) => {
                                                                   this.execFunction(this.basicAttrs['selecteHandler'], ...params)
                                                               }
                                                           },
                                                       }}
                                                       ref={this.getRefName()}>
                    </ice-dept-persion-selector>)
                } else if (this.basicAttrs.type == 'persionByDept') {
                    return (<ice-persion-by-dept-selector disabled={this.isDisabled()}
                                                          value={this.getValue()}
                                                          dept-code={this.execFunction(this.basicAttrs['deptCode'])}
                                                          mode={this.isDisabled() ? 'readonly' : this.basicAttrs.mode}
                                                          choose-item={this.basicAttrs.chooseItem}
                                                          extend-prop={this.execFunction(this.basicAttrs['extendProp'])}
                                                          selected-persion={this.execFunction(this.basicAttrs['selectedPersion'])}
                                                          {...{
                                                              "on": {
                                                                  "IcePersionByDeptSelector": value => {
                                                                      if (!this.isDisabled() && this.isShow()) {
                                                                          this.setValue(value);
                                                                      }
                                                                      this.change(value);
                                                                  },
                                                                  "select-confirm": (...params) => {
                                                                      this.execFunction(this.basicAttrs['selecteHandler'], ...params)
                                                                  }
                                                              },
                                                          }}
                                                          ref={this.getRefName()}>
                    </ice-persion-by-dept-selector>)
                }


                return "";
            })
        }


        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-macro-selector ">
                    <div class="icon el-icon-edit-outline"></div>
                </div>
            )
        }

    },
    components: {
        IcePersionSelector,
        IceDeptSelector,
        IceDeptPersionSelector,
        IcePersionByDeptSelector
    }
}