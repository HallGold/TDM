<template>
    <el-cascader v-model="selected"
                 :options="options"
                 expand-trigger="hover"
                 change-on-select
                 :show-all-levels="false"
                 :props="classifyIdProps"
                 @change="change"
                 @blur="e=>$emit('blur',e)"
                 :disabled="disabled">
    </el-cascader>
</template>

<script>
    export default {
        name: "ApplicationClassifySelector",
        model: {
            prop: 'value',
            event: 'changevalue'
        },
        props: {
            region: {
                type: Number,
                default: 1
            },
            level: String,
            value: Array,
            disabled: Boolean
        },
        data: function () {
            return {
                selected: this.value,
                options: [],
                classifyIdProps: {
                    value: 'oid',
                    label: 'classifyName',
                    children: 'children'
                },
            }
        },
        methods: {
            loadPickList() {
                this.options = [];
                this.$axios.get("/biz/BizSoftwareClassify/tree?topId=" + this.level + "&region=" + this.region).then(success => {
                    this.options = success.data[0].children;
                    if (this.selected != null && this.selected.length > 0) {
                        this.changeText(this.selected);
                    }
                }).catch(error => {
                    this.$message.error("分类信息加载失败")
                })
            },
            change(event) {
                this.$emit("changevalue", event)
                this.changeText(event);
            },
            changeText(event) {
                let options = this.options;
                let item;
                for (let i = 0; i < event.length; i++) {
                    item = options.find(item => item.oid == event[i]);
                    if (!item) {
                        return;
                    }
                    options = item ['children'];
                }
                this.$emit("textvalue", item.classifyName)
            }
        },
        watch: {
            level() {
                this.loadPickList();
            },
            region() {
                this.loadPickList();
            },
            selected(newValue, oldValue) {
                if (!oldValue && newValue) {
                    this.$emit("changevalue", this.selected)
                }
            },
            value(newValue, oldValue) {
                this.selected = this.value;
                if (oldValue.length == 0 && newValue.length > 0) {
                    this.changeText(this.value)
                }
            }
        },
        mounted() {
            // if (this.level) {
            // this.loadPickList();
            // }
        }
    }
</script>

<style scoped>

</style>