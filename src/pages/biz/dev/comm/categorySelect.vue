<template>
    <div>
        <el-dialog v-dialogDrag
                   title="选择设备类别"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="30%"
                   append-to-body
                   :close-on-click-modal="false">
            <el-radio-group v-model="radio">
                <div v-for="item in ENUMS.CATEGORY_DATA"
                     :key="item.code"
                     class="select_cls">
                    <el-radio :label=item.code>{{item.name}}</el-radio>
                </div>
            </el-radio-group>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">确定</el-button>
                <el-button type="info" @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"

    export default {
        name: "categorySelect",
        mixins: [bizComm, devComm],
        props: {
            closeHandler: {
                type: Function,
                required: true,
                default: function () {
                    alert("请在父页面传入close-handler属性实现关闭按钮回调方法!");
                }
            }
        },
        data() {
            return {
                dialogVisible: false,                     /*弹框的开关属性*/
                radio: '',                               /*选中的值*/
            }
        },
        methods: {
            /**打开弹窗*/
            openDialog() {
                this.dialogVisible = true;
            },
            /**保存--传出选择的值*/
            save() {
                this.$props.closeHandler(this.radio);
                this.dialogVisible = false;
            },
            /**关闭--弹窗*/
            closeDialog() {
                this.dialogVisible = false;
            }
        },
        mounted() {
            //初始化设备类型枚举
            let _this = this;
            Promise.resolve(this.requestCategoryData()).then(() => {
                _this.radio = _this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE;
            });

        }
    }
</script>

<style scoped>
    .select_cls {
        margin-top: 15px;
        margin-left: 35px;
    }

    .select_outer {
        width: 100%;
        height: 300px;
        position: relative;
        overflow: hidden
    }

    .select_inner {
        position: absolute;
        right: -17px;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 300px
    }
</style>