export default {
    props: {
        //是否可编辑
        isEdit: {
            type: Boolean,
            default: false
        },
        //设备数据
        mainData: {
            type: Object,
        },
    }, watch: {
        mainData(newData) {
            this.$emit("update:mainData", newData);
        }
    },
    methods: {
        /**
         * 组装需要校验的组件数组
         */
        assembleValidateArr() {
            let arr = [];
            for (let i in this.PAGE_ENUM.REFS) {
                if (typeof i == "string") {
                    let validateData = this.$refs[this.PAGE_ENUM.REFS[i]].validateData;
                    if (!!validateData && typeof validateData == "function") {
                        arr.push(validateData());
                    }
                }
            }
            return arr;
        },
        /**
         * 数据校验
         */
        validateData() {
            let validateArr = this.assembleValidateArr();
            return Promise.all(validateArr);
        },
        /**
         * 是否编辑页面加载完成
         */
        isInitEditPageOver() {
            for (let i in this.PAGE_ENUM.REFS) {
                if (typeof i == "string") {
                    let isInitPageOver = this.$refs[this.PAGE_ENUM.REFS[i]].isInitPageOver;
                    if (!!isInitPageOver && typeof isInitPageOver == "function") {
                        if (isInitPageOver() == false) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }
}