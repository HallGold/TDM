import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import './Input.less'

export default {
    meta: {
        name: 'input',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="input iconfont icon-input">文本输入框</div>

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
                {
                    key: 'type',
                    keylabel: '校验类型',
                    deleteable: false,
                    valuetype: "select",
                    keyreadonly: true,
                    list: [{text: '文本', code: 'string'},
                        {text: '数字', code: 'number'},
                        {text: '整数', code: 'integer'},
                        {text: '浮点数', code: 'float'},
                        {text: '邮件', code: 'email'},
                        {text: 'URL', code: 'url'},
                        {text: '正则表达式', code: 'pattern'},
                        {text: '远程校验', code: 'remote'}]
                },
                {
                    key: 'pattern',
                    keylabel: '正则表达式',
                    deleteable: true,
                    keyreadonly: true,
                    showable: attr => attr['type'] == 'pattern',
                },
                {
                    key: 'url',
                    keylabel: '校验URL',
                    deleteable: true,
                    keyreadonly: true,
                    showable: attr => attr['type'] == 'remote',
                },
                {
                    key: 'keyCode',
                    keylabel: '参数KEY编码',
                    deleteable: true,
                    keyreadonly: true,
                    showable: attr => attr['type'] == 'remote',
                },
                {
                    key: 'message',
                    keylabel: '错误提示',
                    deleteable: true,
                    keyreadonly: true,
                    showable: attr => attr['type'] == 'pattern' || attr['type'] == 'remote',
                },
                {key: 'whitespace', keylabel: '是否可为空格', deleteable: false, valuetype: "checkbox", keyreadonly: true},
                ...formItemScript
            ]
        },
        basicAttrs() {
            return [
                {key: 'maxlength', keylabel: '最大长度', deleteable: true, valuetype: "number"},
                {key: 'clearable', keylabel: '是否可清空', deleteable: true, valuetype: "checkbox"},
                {key: 'suggestions', keylabel: '启用搜索建议', deleteable: true, valuetype: "checkbox"},
                {
                    key: 'suggestions-url',
                    keylabel: '远程搜索URL',
                    deleteable: true,
                    showable: attr => attr['suggestions'],
                },
                {key: 'suggestions-key', keylabel: '搜索参数编码', deleteable: true, showable: attr => attr['suggestions'],},
            ]
        }
    },
    clazz: class Input extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'input';
            this.type = 'eleItem';
            this.basicAttrs = {}
            this.validateEvent = 'blur';
            this.attrs.whitespace = false;
            this.attrs.type = 'string';
            /* this.layoutAttrs.w = 2*/
        }

        render(h) {
            return super.render(h, h => {
                    if (this.basicAttrs.suggestions) {
                        return (<el-autocomplete type="text"
                                                 disabled={this.isDisabled()}
                                                 value={this.getValue()}
                                                 trigger-on-focus={false}
                                                 placeholder={this.isDisabled() ? '' : `请输入${this.attrs.label}`}
                                                 {...{
                                                     "attrs": this.getBasicAttrs(),
                                                     "on": {
                                                         "input": value => {
                                                             if (!this.isDisabled() && this.isShow()) {
                                                                 this.setValue(value);
                                                             }
                                                             this.change(value);
                                                         },
                                                         "change": value => {
                                                             this.blur(value);
                                                         }
                                                     },
                                                 }}
                                                 ref={this.getRefName()}></el-autocomplete>)
                    } else {
                        return (<el-input type={this.layoutAttrs.h > 1 ? "textarea" : 'text'}
                                          rows={this.layoutAttrs.h > 1 ? Math.round((this.layoutAttrs.h - 1) * 2.6 + 1) : 1}
                                          disabled={this.isDisabled()}
                                          value={this.getValue()}
                                          placeholder={this.isDisabled() ? '' : `请输入${this.attrs.label}`}
                                          {...{
                                              "attrs": this.getBasicAttrs(),
                                              "on": {
                                                  "input": value => {
                                                      if (!this.isDisabled() && this.isShow()) {
                                                          this.setValue(value);
                                                      }
                                                      this.change(value);
                                                  },
                                                  "change": value => {
                                                      this.blur(value);
                                                  }
                                              },
                                          }}
                                          ref={this.getRefName()}></el-input>)
                    }


                }
            )
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h =>
                <div class="form-input">
                </div>
            )
        }


        setBasicAttrs(attrs) {
            super.setBasicAttrs(attrs);
            if (this.basicAttrs['maxlength']) {
                this.basicAttrs['show-word-limit'] = true
            } else {
                this.basicAttrs['show-word-limit'] = false
            }


        }

        getBasicAttrs() {
            const attrs = {...super.getBasicAttrs()};
            if (attrs.suggestions &&
                attrs['suggestions-url'] &&
                attrs['suggestions-key']) {
                const attrsBak = {...attrs}
                attrs['fetch-suggestions'] = (queryKey, resolve) => {
                    const params = {};
                    params[attrsBak['suggestions-key']] = queryKey;
                    const {$axios, $message} = this.getScriptContext()
                    $axios.get(attrsBak['suggestions-url'], {params})
                        .then(result => {
                            resolve(result.data);
                        })
                        .catch(error => {
                            $message.error(error.msg || '出错啦');
                        })
                }
            }
            delete attrs['suggestions-url'];
            delete attrs['suggestions-key'];
            delete attrs['suggestions'];

            return attrs;
        }


    }
}