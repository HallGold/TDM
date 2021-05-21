<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import emitter from 'element-ui/src/mixins/emitter';

    export default {
        name: "IceSelect",
        mixins: [emitter],
        model: {
            prop: 'value',
            event: 'changevalue'
        },
        props: {
            onlyShow: Boolean,//只是用来翻译数据，不可编辑
            value: [String, Array, Number],
            mapTypeCode: String,
            dataUrl: String,
            textProp: {
                type: String,
                default: 'text'
            },
            codeProp: {
                type: String,
                default: 'code'
            },
            valueModel: {//表示选择后返回值，多选模式下返回值：[1,2,3]  "1,2,3"
                type: String,
                default: 'array',
                validator: function (value) {
                    return ['string', 'array'].indexOf(value) !== -1
                }
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            options: {
                type: Array,
                default: () => {
                    return []
                }
            },
            text: {
                type: String
            },
            disabledList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            // 父密级控制子密级选择
            controlMj: {
                default: function () {
                    return []
                }
            },
            // 子密级控制父密级选择
            controlMjPar: {
                default: function () {
                    return []
                }
            },
            parentProp: String,
            parentValue: [String, Number],//父选中值*/
            disabled: Boolean
        },
        data() {
            return {
                selectValue: "",
                dataList: [],
                selectList: []
            }
        },
        watch: {
            value: {
                handler(newValue, oldValue) {
                    if (this.multiple) {
                        if (!newValue) {
                            this.selectValue = [];
                            return
                        }
                        if (this.valueModel == 'string') {
                            this.selectValue = newValue.split(",");
                        } else if (this.valueModel == 'array') {
                            this.selectValue = newValue;
                        }
                    } else {
                        if (typeof newValue != Number.name.toLocaleLowerCase() && !newValue) {
                            this.selectValue = "";
                            return
                        }
                        this.selectValue = newValue //+ "";
                    }
                    this.getLabels();


                }, immediate: true
            },
            mapTypeCode() {
                this.addUndoTypeCodes(this.mapTypeCode)
            },
            dataList() {

                /* if (this.valueModel == 'string' && this.$attrs.multiple) {
                     this.selectValue = this.value.split(",");
                 } else if (this.valueModel == 'array' && this.$attrs.multiple) {
                     this.selectValue = this.value;
                 } else {
                     this.selectValue = this.value;
                 }*/
                this.selectList = this.dataList.map(item => {
                    return {value: item[this.codeProp], label: item[this.textProp]}
                })
                /*this.$nextTick(() => {

                })*/
            },

            options() {
                if (this.parentProp && this.options) {
                    this.dataList = this.options.filter(item => item[this.parentProp] == this.parentValue);
                } else {
                    this.dataList = this.options;
                }

            },
            selectList() {
                if (this.valueModel == 'string' && this.multiple) {
                    this.selectValue = this.value ? this.value.split(",") : [];
                } else if (this.valueModel == 'array' && this.multiple) {
                    this.selectValue = this.value ? this.value : [];
                } else {
                    this.selectValue = this.value !== undefined ? this.value : "";
                }
            },
            parentValue() {
                this.initSelect();
                this.$emit('update:text', '');
                this.$emit('changevalue', '')
            },
            dataUrl() {
                this.initSelect();
                this.$emit('update:text', '');
                this.$emit('changevalue', '')
            }
        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap', 'getDataMapList', 'getReversedDataMap']),
            ...mapActions('cacheStore', ['addCache']),
            ...mapGetters('cacheStore', ['getCacheByKey']),
            changeValue(value, text) {
                if (this.multiple) {
                    this.getLabels();
                    if (this.valueModel == 'string') {
                        this.$emit('changevalue', this.selectValue.join(","))
                    } else {
                        this.$emit('changevalue', this.selectValue)
                    }
                } else {
                    this.getLabels();
                    this.$emit('changevalue', this.selectValue)
                }
                this.$nextTick(() => {
                    this.dispatch('ElFormItem', 'el.form.blur', ...arguments);
                });
                return false

            },
            getLabels() {
                this.$nextTick(_ => {
                    let labels = '';
                    if (this.multiple) {
                        labels = this.filterSelectList
                            .filter(item => this.selectValue.find(ch => ch == item.value))
                            .map(item => item.label);
                        if (this.valueModel == 'string') {
                            this.$emit('update:text', labels.join(","));
                        } else {
                            this.$emit('update:text', labels);
                        }
                    } else {
                        labels = this.filterSelectList
                            .filter(item => {
                                return item.value == this.selectValue
                            }).map(item => {
                                return item.label;
                            });
                        this.$emit('update:text', labels.join(","));
                    }
                })
            },


            async initSelect() {
                if (this.dataUrl) {
                    let params = {}
                    if (this.parentProp) {
                        if (this.parentValue == undefined || this.parentValue == null || this.parentValue == '') {
                            return
                        }
                        params[this.parentProp] = this.parentValue
                    }

                    const callback = await this.addCache(this.getCacheKey())
                    if (callback) {
                        this.$axios.get(this.dataUrl, {params: params})
                            .then(result => {
                                this.dataList = result.data;
                                this.$nextTick(_ => {
                                    /* this.selectList = this.dataList.map(item => {
                                         return {value: item[this.codeProp], label: item[this.textProp]}
                                     })*/
                                    callback(this.selectList)
                                })
                            })
                    }


                } else if (this.options) {
                    if (this.parentProp && this.options) {
                        this.dataList = this.options.filter(item => item[this.parentProp] == this.parentValue);
                    } else {
                        this.dataList = this.options;
                    }
                }
            },
            getCacheKey() {
                let params = {}
                if (this.parentProp) {
                    params[this.parentProp] = this.parentValue
                }
                return `${this.dataUrl}:${JSON.stringify(params)}`
            }
        },
        computed: {
            multiple() {
                return this.$attrs.multiple;
            },
            /*filterSelectList() {
                let disableList = this.selectList.find(item => item.value == '$$disabled');
                if (!disableList) {
                    disableList = []
                } else {
                    disableList = disableList.label;
                }

                return this.selectList.filter(item => this.disabledList.indexOf(item.value) == -1)
                    .filter(item => item.value != '$$disabled')
                    .filter(item => {
                        if (this.$attrs['disabled'] == '' || this.$attrs['disabled'] == true) {
                            return true
                        }

                        if (disableList.find(d => d == item.value)) {
                            return false
                        }
                        return true;
                    })
                    .map(item => {
                        return item
                    })
            },*/
            //附加密级列表
            userDataSecrets() {
                return this.getReversedDataMap()("USER_DATA_SECRET")
            },
            secretsMax() {

                let userDataSecrets = this.userDataSecrets
                if (!userDataSecrets) {
                    return []
                }
                const userEnabledSecret = userDataSecrets[this.$userInfo.securityLevel];
                if (!userEnabledSecret) {
                    return null
                }
                let userSecret = userEnabledSecret.split(",")

                const fileSecrets = this.getDataMap()("DATA_SECRET_LEVEL");
                if (!fileSecrets) {
                    return []
                }
                const list = [];

                for (let key in fileSecrets) {
                    list.push({
                        name: fileSecrets[key],
                        value: key,
                        sequence: Number(key),
                        disable: userSecret.indexOf(key) == -1
                    })
                }
                if (this.isPublic && list.length > 0) {//密级只展示公开，内部
                    return list.filter(item => item.value <= 2);
                }
                let values = list.filter(c => {
                    return !c.disable

                }).map(c => {
                    return c.value
                })
                return Math.max.apply(null, values);
            },
            filterSelectList() {
                if (this.mapTypeCode) {
                    // return this.getDataMapList()(this.mapTypeCode) || []
                    if (this.mapTypeCode === 'DATA_SECRET_LEVEL') {
                        let arr = this.getDataMapList()(this.mapTypeCode) || [];
                        // 获取最小密级
                        let minMj = null;
                        if (this.controlMj.length > 0) {
                            minMj = Math.min.apply(null, this.controlMj);
                        }

                        if (this.secretsMax) {
                            minMj = !minMj ? this.secretsMax : (minMj > this.secretsMax ? this.secretsMax : minMj)
                        }


                        return arr.filter(c => {
                            return !minMj || c.value <= minMj
                        })

                    } else {
                        return this.getDataMapList()(this.mapTypeCode) || []
                    }
                } else if (this.dataUrl) {
                    return this.getCacheByKey()(this.getCacheKey()) || []
                } else {
                    return this.selectList || [];
                }

            },
            // 获取最大值
            maxChildMj() {
                return this.controlMjPar.length > 0 ? Math.max.apply(null, this.controlMjPar) : 0;
            }
        },

        created() {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
            if (this.mapTypeCode === 'DATA_SECRET_LEVEL') {
                this.addUndoTypeCodes(["DATA_SECRET_LEVEL", "USER_DATA_SECRET"])
            }

        },
        mounted() {
            if (!this.parentProp) {
                this.initSelect();
            }

        },
        render(h) {
            if (this.onlyShow) {
                const option = this.filterSelectList.find(item => item.value == this.selectValue)
                return <span>{option ? option.label : ''}</span>
            } else {

                return <el-select ref="select"
                                  {...{
                                      model: {
                                          value: this.selectValue,
                                          callback: value => this.selectValue = value
                                      },
                                      on: {
                                          ...this.$listeners,
                                          change: this.changeValue
                                      },
                                      props: {
                                          ...this.$attrs,
                                          placeholder: this.placeholder
                                      }
                                  }
                                  } disabled={this.disabled}>
                    {
                        this.filterSelectList.map(item2 => {
                            item2.disabled = item2.value < this.maxChildMj ? true : false;
                            return <el-option
                                label={item2.label}
                                value={item2.value}
                                disabled={item2.disabled}>
                            </el-option>
                        })
                    }

                </el-select>
            }
        }
    }

</script>


<style scoped>

</style>
