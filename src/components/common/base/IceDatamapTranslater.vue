<template>
    <div>
        <span v-if="model=='text'">
        {{translatedValue}}
        </span>
        <el-input v-if="model=='input'" disabled :value="translatedValue">
        </el-input>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "IceDatamapTranslater",

        props: {
            //数据字典编码
            mapTypeCode: {type: [Object, String], required: true},
            value: [String, Array, Number],
            //显示方式，默认纯文本
            model: {
                type: String,
                default: 'text'
            },
            //翻译后输出的文本
            text: String,
            //是否有多选值
            multiple: Boolean,
            //多选值数据模式
            valueModel: {//多选模式下返回值：[1,2,3]  "1,2,3"
                type: String,
                default: 'array',
                validator: function (value) {
                    return ['string', 'array'].indexOf(value) !== -1
                }
            },
        },
        data() {
            return {
                selectList: []
            }
        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes', 'addUndoCusTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap', 'getCusDataMap']),
        },
        computed: {
            translatedValue() {
                let map = null;
                if (this.mapTypeCode instanceof String) {
                    map = this.getDataMap()(this.mapTypeCode);
                } else {
                    if (this.mapTypeCode.mapTypeCode) {
                        if (this.mapTypeCode.type == 1) {
                            map = this.getDataMap()(this.mapTypeCode.mapTypeCode);
                        } else {
                            map = this.getCusDataMap()(this.mapTypeCode.mapTypeCode);
                        }
                    } else {
                        map = null;
                    }
                }
                if (map) {
                    if (this.multiple) {
                        const text = this.multipleValue.map(item => map[item]).join(",")
                        this.$emit("update:text", text)
                        return text
                    } else {
                        this.$emit("update:text", map[this.value])
                        return map[this.value]
                    }

                } else {
                    if (this.multiple) {
                        return this.value.join(",");
                    } else {
                        return this.value
                    }

                }
            },
            multipleValue() {
                if (!this.multiple) {
                    return [this.value]
                }
                if (this.valueModel == 'array') {
                    return this.value;
                } else {
                    return this.value ? this.value.split(",") : [];
                }
            }
        },

        created() {
            // console.log("select created")
            if (this.mapTypeCode.mapTypeCode) {
                if (this.mapTypeCode.mapTypeCode && this.mapTypeCode.type == 1) {
                    this.addUndoTypeCodes(this.mapTypeCode.mapTypeCode);
                } else {
                    this.addUndoCusTypeCodes(this.mapTypeCode.mapTypeCode);
                }
            }


        },
    }

</script>


<style scoped>

</style>
