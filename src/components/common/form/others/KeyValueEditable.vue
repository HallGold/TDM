<template>
    <div class="key-value-editable">

        <div :class='["key-value-pair",keySelectable?"key-selectable":""]' v-for="(item,index) in dataValue"
             :key="index"
             v-if="item.showable?item.showable(dataKeyValue):true">

            <div class="key readonly" v-if="item.keyreadonly">{{item.keylabel?item.keylabel:item.key}}</div>
            <el-select class="key" v-else-if="keySelectable" v-model="item.key" placeholder="请选择"
                       @change="(value)=>keySelectableChange(value,item)">
                <el-option
                        v-for="item in tattrs.filter(attr=>attr.showable?attr.showable(dataKeyValue):true)"
                        :key="item.key"
                        :label="item.keylabel"
                        :disabled="(value[item.key]!==undefined&&value[item.key]!=='')?true:false"
                        :value="item.key">
                </el-option>
            </el-select>
            <el-input class="key" v-else v-model="item.key" @change="emitChange"></el-input>
            <div class="split">:</div>
            <!--数字框-->
            <el-input-number class="value" v-model="item.value" controls-position="right"
                             v-if="item.valuetype=='number'" :min="item.valuemin"
                             @change="emitChange"></el-input-number>
            <!--checkbox-->
            <el-checkbox class="value" v-model="item.value" v-else-if="item.valuetype=='checkbox'"
                         @change="emitChange"></el-checkbox>

            <!--switch-->
            <el-switch class="value" style="height: 32px;line-height:20px;" v-model="item.value"
                       :active-text="item.activeText"
                       :inactive-text="item.inactiveText"
                       v-else-if="item.valuetype=='switch'" @change="emitChange">
            </el-switch>

            <ice-select class="value" :options="item.list" placeholder="请选择"
                        v-model="item.value" v-else-if="item.valuetype=='select'"
                        @changevalue="emitChange"></ice-select>

            <script-editor class="value" v-model="item.value" :init-value-model="item.initValueModel"
                           :init-script="item.initScript"
                           v-else-if="item.valuetype=='script'" @change="emitChange"></script-editor>

            <!--默认使用文本框-->
            <el-input class="value" v-model="item.value" v-else :title="item.value"
                      @change="(...params)=>!item.realtime&&emitChange(...params)"
                      @input="(...params)=>item.realtime&&emitChange(...params)"></el-input>

            <el-button type="text" class="button" @click="deleteItem(index)" v-if="item.deleteable!==false" unauth>删除
            </el-button>
            <div v-else class="button"></div>
        </div>

        <!-- <div>-->
        <el-button type="text" v-if="newable" @click="add" unauth>添加</el-button>

        <!--<div class="key-value-pair">
            <el-input class="key"></el-input>
            <div class="split">-</div>
            <el-input class="value"></el-input>
            <el-button type="text" class="button">删除</el-button>
        </div>
        <div class="key-value-pair">

            <div class="key">123</div>
            <div class="split">-</div>
            <el-input class="value"></el-input>
            <el-button type="text" class="button">删除</el-button>
        </div>-->
    </div>
</template>

<script>
    import IceLabel from "../../base/IceLabel";
    import IceSelect from "../../base/IceSelect";
    import ScriptEditor from "./ScriptEditor";

    export default {
        name: "KeyValueEditable",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            tattrs: {
                type: Array,
                default: function () {
                    return []
                }
            },
            newable: {
                type: Boolean,
                default: false
            },
            keySelectable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dataValue: [],
                dataKeyValue: {}
                // attrs: ['border', {key: 'height', keyreadonly: true}, 'width']
            }
        },
        methods: {
            add() {
                this.dataValue.push({key: '', value: ''})
            },
            deleteItem(index) {
                this.dataValue.splice(index, 1);
                this.emitChange();
            },
            loadAttrs() {
                const attrsMap = {};
                const dataValue = [];
                this.tattrs.forEach(item => {
                    let key = "";//keycode
                    let value = "";//输入值
                    let keyreadonly = false;//key是否只读
                    let realtime = false;//是change事件触发改变还是input，主要针对input输入框
                    let keylabel = "";//key说明
                    let valuetype = 'text';//value类型
                    let valuemin = 1;//value最小值，用于数字
                    let deleteable = true;//是否可删除
                    let showable = undefined;//是否可显示
                    let activeText = undefined;//已激活的文本
                    let inactiveText = undefined;//未激活的文本
                    let list = undefined;//select的list数据
                    let initValueModel = "null"//脚本编辑器初始脚本类型
                    let initScript = ""//脚本编辑器初始脚本
                    if (typeof item === 'string') {
                        key = item;
                    } else if (typeof item === "object") {
                        key = item.key;
                        keyreadonly = item.keyreadonly === undefined ? keyreadonly : item.keyreadonly;
                        realtime = item.realtime === undefined ? realtime : item.realtime;
                        keylabel = item.keylabel === undefined ? keylabel : item.keylabel;
                        valuetype = item.valuetype === undefined ? valuetype : item.valuetype;
                        valuemin = item.valuemin === undefined ? valuemin : item.valuemin;
                        deleteable = item.deleteable === undefined ? deleteable : item.deleteable;
                        showable = item.showable === undefined ? showable : item.showable;
                        activeText = item.activeText === undefined ? activeText : item.activeText;
                        inactiveText = item.inactiveText === undefined ? inactiveText : item.inactiveText;
                        list = item.list === undefined ? list : item.list;
                        initValueModel = item.initValueModel === undefined ? initValueModel : item.initValueModel;
                        initScript = item.initScript === undefined ? initScript : item.initScript;
                    }
                    let obj = {
                        key: key,
                        value: value,
                        keyreadonly: keyreadonly,
                        realtime: realtime,
                        keylabel: keylabel,
                        valuetype: valuetype,
                        valuemin: valuemin,
                        deleteable: deleteable,
                        showable: showable,
                        activeText: activeText,
                        inactiveText: inactiveText,
                        list: list,
                        initValueModel: initValueModel,
                        initScript: initScript
                    };
                    if (this.value[key] != undefined) {

                        obj.value = this.value[key];
                    }
                    if (this.keySelectable) {
                        if (obj.value !== undefined && obj.value !== null && obj.value !== "") {
                            dataValue.push(obj)
                        }
                    } else {
                        dataValue.push(obj)
                    }

                    attrsMap[key] = "flag"
                })


                for (let key in this.value) {
                    if (!attrsMap[key]) {
                        let obj = {
                            key: key,
                            value: this.value[key],
                            keyreadonly: false,
                            realtime: false,
                            valuetype: 'text',
                            deleteable: true
                        }
                        if (this.keySelectable) {
                            obj.showable = () => false;
                        }
                        dataValue.push(obj)
                    }
                }

                this.dataValue = dataValue;
                this.getDataKeyValue();
            },
            getDataKeyValue() {
                const result = {};
                this.dataValue.forEach(item => {
                    result[item.key] = item.value
                })
                this.dataKeyValue = result;
            },
            emitChange(value) {
                const result = {};
                this.dataValue.forEach(item => {
                    if (item.key && (item.value !== undefined && item.value !== null)) {
                        result[item.key] = item.value;
                    }

                })
                this.$emit("change", result);
            },
            keySelectableChange(value, item) {
                const attr = this.tattrs.find(attr => attr.key == value);
                if (attr) {
                    Object.assign(item, attr);
                }
                this.getDataKeyValue()
            }
        },

        watch: {
            /*dataValue: {
                handler(newName, oldName) {
                    this.emitChange();
                },
                deep: true
            },*/
            value(newName, oldName) {

                for (let key in newName) {
                    if (newName[key] != oldName[key]) {
                        this.loadAttrs()
                        return
                    }
                }
                for (let key in oldName) {
                    if (newName[key] != oldName[key]) {
                        this.loadAttrs()
                        return
                    }
                }

            },
            tattrs(newName, oldName) {
                //if()
                if (newName.length != oldName.length) {
                    this.loadAttrs()
                    return
                } else {
                    newName.forEach((item, index) => {
                        if (item != oldName[index]) {
                            this.loadAttrs()
                            return
                        }
                    })
                }
                //
            }
        },
        created() {
            this.loadAttrs()
        },
        mounted() {

        },
        components: {ScriptEditor, IceSelect, IceLabel}
    }
</script>

<style lang="less" scoped>
    .key-value-editable {
        display: flex;
        flex-direction: column;

        .key-value-pair {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-bottom: 10px;

            .key {
                width: 90px;
                /*  line-height: 32px;
                  text-align: center;*/
            }

            .key.readonly {
                line-height: 32px;
                text-align: right;
            }

            .split {
                line-height: 32px;
            }

            .value {
                width: 120px;
                margin-right: 0;
                line-height: 32px;
            }

            .button {
                width: 40px
            }

        }

        .key-value-pair.key-selectable .key {
            width: 120px;
        }

        .key-value-pair.key-selectable .value {
            width: 110px;
        }
    }
</style>