import Vue from "vue";
import ElementUI, {
    Autocomplete,
    Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Dialog,
    Form,
    FormItem,
    Input,
    InputNumber,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    TimePicker,
    Upload,
    DropdownItem
} from "element-ui";
import {mapGetters, mapState} from "vuex";
import AsyncValidator from 'async-validator';

Vue.use(ElementUI, {
    size: 'small'
});


Vue.component(Button.name, {
    extends: Button,
    props: {
        ctrlCode: String,//按钮编码
        priorDisabled: String,//按钮优先禁用属性，设置后优先级高于disabled
        unauth: {
            type: [String, Boolean],
            default: 'false'
        }//不启用按钮权限
    },
    data() {
        return {
            isclicked: false,
        }
    },
    methods: {
        ...mapGetters('permissionStore', ['getPageFunAuth']),
        handleClick(evt) {
            let before = this.isclicked;
            this.isclicked = true;
            if (before === false) {
                this.$emit('click', evt);
                setTimeout(_ => {
                    this.isclicked = false;
                }, 800)
            }

        }
    },
    computed: {
        ...mapGetters('permissionStore', ['getPagePermission']),
        ...mapState("permissionStore", ['currentUrl']),
        buttonDisabled() {
            return this.priorDisabled ? (this.priorDisabled == 'true') : (this.disabled || (this.elForm || {}).disabled || this.isclicked);
        }
    },
    mounted() {
        if (process && process.env && process.env.NODE_ENV === 'development') {
            if ((this.unauth === 'false' || this.unauth === false) && !this.ctrlCode) {
                console.warn(`页面:${this.$route.path}存在按钮 ${this.$el.innerText} 没有维护按钮编码`)
            }
        }

        if (this.ctrlCode) {
            if (process && process.env && process.env.NODE_ENV !== 'development') {
                if ((this.unauth === 'false' || this.unauth === false) && !this.getPageFunAuth()(this.ctrlCode)) {
                    this.$nextTick(_ => {
                        this.$destroy();
                        this.$el.style.display = "none"
                    })
                }
            }

        }
        //this.$el.parentNode.removeChild(this.$el)
        //debugger
        // this.$el.parentNode.removeChild(this.$el)  //.style.display = "none"
    }
})


Vue.component(DropdownItem.name, {
    extends: DropdownItem,
    props: {
        ctrlCode: String,//按钮编码
        unauth: {
            type: [String, Boolean],
            default: 'false'
        }//不启用按钮权限
    },
    methods: {
        ...mapGetters('permissionStore', ['getPageFunAuth']),
    },
    computed: {
        ...mapGetters('permissionStore', ['getPagePermission']),
        ...mapState("permissionStore", ['currentUrl']),
    },
    mounted() {
        if (process && process.env && process.env.NODE_ENV === 'development') {
            if ((this.unauth === 'false' || this.unauth === false) && !this.ctrlCode) {
                console.warn(`页面:${this.$route.path}存在按钮 ${this.$el.innerText} 没有维护按钮编码`)
            }
        }

        if (this.ctrlCode) {
            if (process && process.env && process.env.NODE_ENV !== 'development') {
                if ((this.unauth === 'false' || this.unauth === false) && !this.getPageFunAuth()(this.ctrlCode)) {
                    this.$nextTick(_ => {
                        this.$destroy();
                        this.$el.style.display = "none"
                    })
                }
            }

        }
        //this.$el.parentNode.removeChild(this.$el)
        //debugger
        // this.$el.parentNode.removeChild(this.$el)  //.style.display = "none"
    }
})


Vue.component(Form.name, {
    extends: Form,
    data() {
        return {
            formFocused: false//每个form元素只自动定位第一个
        }
    },
    methods: {
        validate(callback) {
            if (!this.model) {
                console.warn('[Element Warn][Form]model is required for validate to work!');
                return;
            }
            this.formFocused = false;

            let promise;
            // if no callback, return promise
            if (typeof callback !== 'function' && Promise) {
                promise = new Promise((resolve, reject) => {
                    callback = function (valid) {
                        valid ? resolve(valid) : reject(valid);
                    };
                });
            }

            let valid = true;
            let count = 0;
            // 如果需要验证的fields为空，调用验证时立刻返回callback
            if (this.fields.length === 0 && callback) {
                callback(true);
            }
            let invalidFields = {};
            this.fields.forEach(field => {
                field.validate('', (message, field) => {
                    if (message) {
                        valid = false;
                    }
                    invalidFields = Object.assign({}, invalidFields, field);
                    if (typeof callback === 'function' && ++count === this.fields.length) {
                        callback(valid, invalidFields);
                    }
                });
            });

            if (promise) {
                return promise;
            }
        },
    }
})

Vue.component(FormItem.name, {
    extends: FormItem,
    data() {
        return {
            /**
             * 由后台流程引擎控制是否disabled,优先级:priorDisabled  >  FormItem.disabled  >   (disabled||Form.disabled)
             */
            disabled: "unknown",
            printElement: null
        }
    },
    methods: {
        validate(trigger, callback = () => {
        }) {

            this.validateDisabled = false;
            const rules = this.getFilteredRule(trigger);
            if ((!rules || rules.length === 0) && this.required === undefined) {
                callback();
                return true;
            }

            this.validateState = 'validating';

            const descriptor = {};
            if (rules && rules.length > 0) {
                rules.forEach(rule => {
                    delete rule.trigger;
                });
            }
            descriptor[this.prop] = rules;

            const validator = new AsyncValidator(descriptor);
            const model = {};

            model[this.prop] = this.fieldValue;

            validator.validate(model, {firstFields: true}, (errors, invalidFields) => {
                this.validateState = !errors ? 'success' : 'error';
                this.validateMessage = errors ? errors[0].message : '';
                if (errors && !this.elForm.formFocused) {
                    //激活第一个未校验通过的
                    this.elForm.formFocused = true


                    //发送分组定位信息
                    //this.dispatch('IceFormGroup', 'validateGO', this.label)

                    //发送表单元素信息
                    //this.dispatch('IceFormScroll', 'form-scroll', this.$el)


                    //定位未校验通过的元素，向下广播focus事件
                    this.broadcast(Input.name, "doFocus", "")
                    this.broadcast(Autocomplete.name, "doFocus", "")
                    this.broadcast(Select.name, "doFocus", "")
                    this.broadcast(Cascader.name, "doFocus", "")
                    this.broadcast(InputNumber.name, "doFocus", "")
                    this.broadcast(DatePicker.name, "doFocus", "")
                    this.broadcast(TimePicker.name, "doFocus", "")

                    this.broadcast(Radio.name, "doFocus", "")
                    this.broadcast(Checkbox.name, "doFocus", "")
                }
                callback(this.validateMessage, invalidFields);
                this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
            });
        },
        getPrintItemInfo() {

            if (this.printElement) {
                return {
                    label: this.label,
                    value: this.printElement.getShowValue()
                }
            }
            //console.log(this.printInfo)

        }
    },
    created() {
        this.$on('ice-flow-form-ready', data => {
            if (data[this.prop]) {
                //debugger
                const rule = data[this.prop];
                if (rule.isHidden == "0") {
                    if (this.form.rules) {
                        delete this.form.rules[this.prop]
                    }
                    this.$el.style.display = 'none'
                } else {
                    this.$el.style.display = 'block'
                }
                if (rule.isDisabled == "0") {
                    if (this.form.rules) {
                        delete this.form.rules[this.prop]
                    }
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }

            }
        })


        this.$on('ice-form-group-invalid', data => {
            this.disabled = true;
            if (this.form.rules) {
                delete this.form.rules[this.prop]
            }
        })

        this.$on('ice-flow-form-disabled', data => {
            if (data[this.prop]) {
                if (rule.isDisabled == "0") {
                    this.disabled = true;
                }

            }
        })

        this.$on('ice-flow-form-item-go', data => {
            this.dispatch('IceFlowForm', 'validateGOItemEl', this.$el)
        })

        this.$on('ice-flow-form-print', _ => {
            this.dispatch('IceFlowForm', 'printElementInfo', this.getPrintItemInfo())
        })

        this.$on('printItemRegist', item => {
            this.printElement = item;
        })
        if (this.prop) {
            this.dispatch("IceFlowForm", 'printFormItemRegist', {key: this.prop, ref: this})
        }


        this.$on("el.form.change", payload => {
            this.dispatch("IceFlowForm", 'page-item-modified')
        })
        //this.$emit("el.form.change", "hah")
    }
})


Vue.component(Input.name, {
    extends: Input,
    props: {
        priorDisabled: Boolean,
        disableValidateState: Boolean
    },
    computed: {
        inputDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled);
        },
        validateState() {
            return this.disableValidateState === true ? '' : this.elFormItem ? this.elFormItem.validateState : '';
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(newValue) {
                if (this.inputDisabled) {
                    this.$attrs.title = newValue;
                }
            }
        }
    },
    methods: {
        getShowValue() {
            return this.value;
        },

    },
    created() {
        this.$on("doFocus", _ => {
            this.focus()
        })
        this.dispatch(FormItem.name, 'printItemRegist', this)
    },
    mounted() {
        if (this.showWordLimit && this.type == 'text') {
            if (this.$el) {
                const input = this.$el.querySelector("input")
                if (input) {
                    input.style.paddingRight = '46px'
                }
            }
        }
    }
})


Vue.component(Autocomplete.name, {
    extends: Autocomplete,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        inputDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled);
        }
    },
    methods: {
        getShowValue() {
            return this.value;
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.focus()
        })
        this.dispatch(FormItem.name, 'printItemRegist', this)
    }
})


Vue.component(Select.name, {
    extends: Select,
    props: {
        priorDisabled: Boolean,
    },
    computed: {
        selectDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled);
        }
    },
    methods: {
        getShowValue() {
            return this.selectedLabel;
        }
    },
    watch: {
        placeholder: {
            immediate: true,
            handler(newValue) {
                if (!this.selectDisabled) {
                    this.cachedPlaceHolder = this.currentPlaceholder = newValue;
                } else {
                    this.cachedPlaceHolder = this.currentPlaceholder = "";
                }
            }
        }
    },
    created() {
        if (!this.selectDisabled) {
            this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
        } else {
            this.cachedPlaceHolder = this.currentPlaceholder = "";
        }
        this.$on("doFocus", _ => {
            this.focus()
        })
        this.dispatch(FormItem.name, 'printItemRegist', this)
    }
})


Vue.component(Radio.name, {
    extends: Radio,
    computed: {
        isDisabled() {
            let source = (this.isGroup
                ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
                : this.disabled || (this.elForm || {}).disabled);
            return (this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? source : (this.elFormItem || {}).disabled
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.dispatch(FormItem.name, "ice-flow-form-item-go");
        })
    }
})

Vue.component(Checkbox.name, {
    extends: Checkbox,
    computed: {
        isDisabled() {
            let source = this.isGroup
                ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled || this.isLimitDisabled
                : this.disabled || (this.elForm || {}).disabled
            return (this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? source : (this.elFormItem || {}).disabled
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.dispatch(FormItem.name, "ice-flow-form-item-go");
        })
    }
})


Vue.component(InputNumber.name, {
    extends: InputNumber,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        inputNumberDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled);
        }
    },
    methods: {
        getShowValue() {
            return this.value;
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.focus()
        })
    }
})


Vue.component(Cascader.name, {
    extends: Cascader,
    componentName: Cascader.name,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        isDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        }
    },
    created() {
        this.$on("doFocus", _ => {
            //不支持focus方法
            //  this.$refs.input ? this.$refs.input.focus() : ""
            //发送分组定位信息
            // this.dispatch('IceFormGroup', 'validateGO', this.elFormItem ? this.elFormItem.label : '')
            this.dispatch(FormItem.name, "ice-flow-form-item-go");
            //发送表单元素信息
            this.dispatch('IceFormScroll', 'form-scroll', this.$el)
        })
    }
})

Vue.component(Switch.name, {
    extends: Switch,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        switchDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.dispatch(FormItem.name, "ice-flow-form-item-go");
        })
    }
})

Vue.component(Slider.name, {
    extends: Slider,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        sliderDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.dispatch(FormItem.name, "ice-flow-form-item-go");
        })
    }
})

Vue.component(TimePicker.name, {
    extends: TimePicker,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        pickerDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        },

    },
    created() {
        this.$on("doFocus", _ => {
            this.focus()
        })
    }
})

Vue.component(DatePicker.name, {
    extends: DatePicker,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        pickerDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        },

    },
    methods: {
        getShowValue() {
            return this.displayValue;
        }
    },
    created() {
        this.$on("doFocus", _ => {
            this.focus()
        })
        this.dispatch(FormItem.name, 'printItemRegist', this)
    }
})

Vue.component(Upload.name, {
    extends: Upload,
    props: {
        priorDisabled: Boolean
    },
    inject: {
        elFormItem: {
            default: ''
        }
    },
    computed: {
        uploadDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        }

    }
})

Vue.component(Rate.name, {
    extends: Rate,
    props: {
        priorDisabled: Boolean
    },
    computed: {
        rateDisabled() {
            return this.priorDisabled ||
                ((this.elFormItem || {disabled: 'unknown'}).disabled === 'unknown' ? (this.disabled || (this.elForm || {}).disabled) : (this.elFormItem || {}).disabled)
        }

    },

    created() {
        this.$on("doFocus", _ => {
            this.dispatch(FormItem.name, "ice-flow-form-item-go");
        })
    }
})

Vue.component(ColorPicker.name, {
    extends: ColorPicker,
    computed: {
        colorDisabled() {
            return this.disabled || (this.elForm || {}).disabled || (this.elFormItem || {}).disabled;
        }
    }
})


Vue.component(Dialog.name, {
    extends: Dialog,
    //防止dialog中分组信息往上层传递
    componentName: 'IceFlowForm',
    created() {
        //忽略弹出层内部分组注册信息
        this.$on("ice-flow-group-regist", data => {

        })
    }
})
