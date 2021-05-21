<template>
    <div>
        <el-dropdown @visible-change="change" placement="bottom-start" :trigger="trigger" style="width: 100%;"
                     ref="dropdown">
          <span class="el-dropdown-link">
              <div ref="treeinp" :style="{width: inpWidth}" abb="1">
                  <el-input
                          :disabled="disabled"
                          :placeholder="treeData.placeholder"
                          v-model="input2">
                    <i slot="suffix" ref="icon" class="el-input__icon el-icon-arrow-down icon"></i>
                  </el-input>
              </div>
          </span>
            <div>
                <el-dropdown-menu :slot="dropdown">
                    <div class="dropSty" :style="{width: Width, maxHeight: maxHeight}"
                         style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"
                         ref="hei">
                        <pms-custom-tree :defaultExpandAll=true ref="haha" :defaultValue="defaultValue" v-bind="$attrs"
                                         v-on="$listeners" :transfer="transfer"
                                         @handleCallback="handleCallback"></pms-custom-tree>
                    </div>
                </el-dropdown-menu>
            </div>
        </el-dropdown>
    </div>
</template>

<script>
    import pmsCustomTree from '@/components/common/pms/IceCustomTree'
    //
    export default {
        name: "PmsSelectTree",
        model: {
            prop: 'value',
            event: 'returnData'
        },
        props: {
            value: [String],
            transfer: {
                required: true,
                type: Object
            },
            treeData: {
                required: true,
                type: Object
            },
            // 下拉框最大高度
            maxHeight: {
                default: '500px'
            },
            // 选择框 input宽度
            inpWidth: {
                default: 'auto'
            },
            // 触发下拉行为 两个值 默认 hover  / click
            trigger: {
                default: 'hover'
            },
            unbrid: {
                default: true
            },
            disabled: false
        },
        components: {
            pmsCustomTree
        },
        data() {
            return {
                dropdown: 'dropdown',
                input2: '',
                labelMsg: {},
                Width: 0
            };
        },
        computed: {
            defaultValue() {
                // console.log(this.value, 'this.value')
                if (this.value) {
                    return [this.value]
                } else {
                    return []
                }
            }
        },
        created() {
            this.$nextTick(_ => {
                this.Width = this.$refs.treeinp.offsetWidth + 'px'
            })

        },
        mounted() {
            window.onresize = () => {
                this.$nextTick(_ => {
                    if (this.$refs.treeinp) {
                        this.Width = this.$refs.treeinp.offsetWidth + 'px'
                    }

                })
            }
        },
        methods: {
            refresh() {
                this.$refs.haha.refresh();
            },
            // 子组件点击回调// 选择改变
            handleCallback(data) {

                if (data.length <= 0) {
                    this.input2 = '';
                }
                // 回调后数据操作
                if (this.unbrid) {
                    this.input2 = data[this.transfer.props.label] ? data[this.transfer.props.label] : '';
                    this.labelMsg = data;
                    this.returnData(data[this.transfer.code] ? data[this.transfer.code] : '');
                    if (this.$refs.dropdown) {
                        this.$refs.dropdown.visible = false;
                    }

                } else {
                    let msg = '';
                    if ((data instanceof Array)) {
                        data.forEach((c) => {
                            msg += ',' + c[this.transfer.props.label];
                        })
                    } else {
                        if (!data) {
                            return
                        }
                        this.returnData(data[this.transfer.code]);
                        this.input2 = data[this.transfer.props.label];
                        if (this.$refs.dropdown) {
                            this.$refs.dropdown.visible = false;
                        }
                        return
                    }
                    this.input2 = msg.substr(1);
                }
                this.$emit('select-xmly', data)
            },
            // 返回个父组件的数据
            returnData(data) {
                if (data) {
                    this.$emit('returnData', data);
                }
            },
            // 下拉框显示隐藏
            change(val) {
                if (this.disabled) {
                    if (this.$refs.dropdown) {
                        this.$refs.dropdown.visible = false;
                    }
                    return;
                }
                if (val) {
                    this.$refs.icon.style.transform = 'rotate(-180deg)';
                } else {
                    this.$refs.icon.style.transform = 'rotate(0)';
                    // this.$emit('handleCallback', this.labelMsg);
                }
            }

        }
    }
</script>

<style scoped>
    .el-tabs__content {
        background: #aaa;
    }

    .icon {
        font-size: 13px;
        transition: all 0.3s;
        transform-origin: center center;
    }

    .dropSty {
        padding: 15px;
        overflow: auto;
    }
</style>