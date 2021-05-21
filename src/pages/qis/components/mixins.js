export default {
    data() {
        return {
            jhFormModel: {
                oidZljh: '',
                zljhCode: '',
                oidDepRel: '',
                depRelCode: '',
                depRelName: '',
            },
            appQuery: [
                {
                    type: 'static', code: 'oidZljh', exp: '=', value: () => {
                        return this.jhdata.oid
                    }
                },
                {
                    type: 'static', code: 'depRelCode', exp: '=', value: () => {
                        return this.jhdata.depCode
                    }
                },
            ],
            // 加载的表格数据
            loadTabData: []
        }
    },
    methods: {
        // 表格加载数据
        beforeBindData(data) {
            this.loadTabData = data;
            return data;
        },
        // 给formModel 赋值
        fuzhiData() {
            if (this.jhdata.jhCode) {
                this.jhFormModel.oidZljh = this.jhdata.oid;
                this.jhFormModel.zljhCode = this.jhdata.jhCode;
                this.jhFormModel.oidDepRel = this.jhdata.depOid;
                this.jhFormModel.depRelCode = this.jhdata.depCode;
                this.jhFormModel.depRelName = this.jhdata.depName;
            } else {
                // 如果没有传值就重置
                this.jhFormModel = {
                    oidZljh: '',
                    zljhCode: '',
                    oidDepRel: '',
                    depRelCode: '',
                    depRelName: '',
                };

            }
            this.formModel = {...this.formModel, ...this.jhFormModel};
            console.log(this.formModel, 'formmodel赋值');

            console.log(this.jhFormModel, 'jh')

        },
        // 计划选择确认
        jhConfirm(data) {
            this.formModel.jhName = data[0].jhName;
            this.formModel.oidZljh = data[0].oid;
            this.formModel.zljhCode = data[0].jhCode;
            this.formModel.depRelCode = "";
            this.formModel.depRelName = "";
            this.formModel.oidDepRel = "";
            console.log(this.formModel, 'formmodel');
        },
        // 部门选择确认
        bmConfirm(data) {
            this.formModel.depRelCode = data[0].depCode;
            this.formModel.depRelName = data[0].depName;
            this.formModel.oidDepRel = data[0].oid;
        },
        // 选择计划弹窗展示
        showSectJh() {
            this.$nextTick(_ => {
                this.$refs.jhcommon.showSectJh();
            })
        },
        // 展示选择部门
        showSectBm() {
            this.$nextTick(_ => {
                this.$refs.jhcommon.showSectBm();
            })
        },
    },
    computed: {
        jhdata() {
            if (this.$route.query.jhdata) {
                return JSON.parse(this.$route.query.jhdata);
            } else {
                return {}
            }
        },
        // 是否禁用计划和选中
        sectDisabled() {
            if (this.jhdata.jhCode) {
                return true;
            } else {
                return false;
            }
        },
        // 判定表单是否已填写
        isExist() {
            return (this.jhdata.oid && this.loadTabData.length >= 1) ? true : false
        }

    },
    watch: {
        jhdata() {
            this.$nextTick(_ => {
                this.$refs.grid.refresh();
            })
        }
    },
    mounted() {
        console.log('加载')
        if (!this.isFlow) {

            this.query = [...this.query, ...this.appQuery];
        }
    },

}
