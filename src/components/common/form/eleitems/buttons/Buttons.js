import BaseFormItem, {formItemAttrs, formItemScript} from "../BaseFormItem";
import './Buttons.less'
import ButtonsEditor from "./ButtonsEditor";


export default {
    meta: {
        name: 'buttons',
        type: 'eleItem',
        icon(h, dragstart, dragend) {
            return <div class="input el-icon-thumb">按钮组</div>

        },
        dragable(overEleType, overEleName) {
            if (overEleName == 'formpanel') {
                return true
            }
            return false;
        },

        attrs() {
            return [
                {key: 'isgroup', keylabel: '是否按钮组', deleteable: false, valuetype: "checkbox", keyreadonly: true},
                {
                    key: 'align',
                    keylabel: '对齐方式',
                    deleteable: false,
                    valuetype: "select",
                    keyreadonly: true,
                    list: [
                        {text: '居左', code: 'flex-start'},
                        {text: '居中', code: 'center'},
                        {text: '居右', code: 'flex-end'}
                    ]
                },
            ]
        },
    },
    clazz: class Buttons extends BaseFormItem {
        constructor(editor) {
            super(editor);
            this.name = 'buttons';
            this.type = 'eleItem';
            this.attrs = {
                isgroup: true,
                align: "flex-end"
            };
            this.layoutAttrs['maxH'] = 1
            this.basicAttrs = {}
            this.hasLabel = false;
            this.buttons = [{name: '按钮', code: 'code', type: 'primary', opType: 'custom'}];
            this.buttonsDialogVisible = false;
        }

        getSnapshot() {
            return {
                ...super.getSnapshot(),
                buttons: this.buttons.map(button => {
                    let copyButton = {...button};
                    delete copyButton.callback;
                    delete copyButton.disable;
                    delete copyButton.hidden;
                    return copyButton
                }),
            };
        }

        recoverSnapshoot(snapshoot) {
            super.recoverSnapshoot(snapshoot)
            if (snapshoot) {
                this.buttons = snapshoot.buttons.map(button => {
                    this.resolveFunctionString(button, 'buttonAction', 'callback')
                    this.resolveExpressString(button, 'disableExpress', 'disable')
                    this.resolveExpressString(button, 'hiddenExpress', 'hidden')
                    return button
                });
            }
        }

        getButtonInfo() {
            return this.buttons.map(button => {
                return {name: button.name, code: button.code}
            });
        }


        getDataControl() {
            return null;
        }

        render(h) {
            return (<div class="form-buttons"
                         style={`justify-content:${this.attrs.align};${this.getStyleString('justify-content1')}`}>
                {this.attrs.isgroup ?
                    (<el-button-group>
                        {this.renderButtons(h)}
                    </el-button-group>) :
                    this.renderButtons(h)}
            </div>)
        }

        renderButtons(h) {
            return this.buttons.map(button => {
                if (button.hidden &&
                    typeof button.hidden == 'function' &&
                    button.hidden() === true) {
                    return ""
                } else {
                    return (<el-button type={button.type}
                                       icon={button.icon}
                                       disabled={(button.disable && typeof button.disable == 'function' && button.disable() === true)}
                                       style={button.background ? `background:${button.background}` : ''}
                                       on-click={button.callback ? button.callback : _ => {
                                       }}>
                        {button.name}
                    </el-button>)
                }

            })
        }

        renderEdirtor(h) {
            return super.renderEdirtor(h, h => (
                <div class="form-buttons"
                     style={`background: #f2f6fc;position:relative;justify-content:${this.attrs.align}`}>
                    {this.attrs.isgroup ?
                        (<el-button-group>
                            {this.renderButtons(h)}
                        </el-button-group>) :
                        this.renderButtons(h)}
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:3"></div>
                </div>)
            )
        }

        additionAttrsRender(h) {
            return (<el-card header="按钮信息" class="card">
                <div style="display: flex;justify-content: center;">
                    <el-button type="text" style="margin:auto;" {...{
                        on: {
                            'click': evt => {
                                this.buttonsEdit()
                            }
                        }
                    }} >按钮维护(共{this.buttons.length}个)
                    </el-button>

                    <buttons-editor group-buttons={this.buttons}
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
                    </buttons-editor>

                </div>

            </el-card>)
        }

        buttonsEdit() {
            this.buttonsDialogVisible = true
        }


    },
    components: {
        ButtonsEditor
    }
}