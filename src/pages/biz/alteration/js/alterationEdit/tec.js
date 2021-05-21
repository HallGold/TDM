export default {
    data() {
        return {};
    },
    methods: {
        /**
         * 选择技术服务目录后触发
         * @param data
         */
        getTechData(data) {
            let _this = this;
            this.alterationData.alterationTichCatalogList = this.alterationData.alterationTichCatalogList || [];
            data.forEach(item => {
                if (_this.findSameRowByCode(_this.alterationData.alterationTichCatalogList, item.catalogId, "catalogId") == -1) {
                    _this.alterationData.alterationTichCatalogList.push({
                        oid: "",
                        alteratioNum: _this.alterationData.alterationNum,
                        catalogId: item.catalogId,
                        devId: "",
                        categoryName: item.bigCategoryName,
                        catalogName: item.categoryName,
                        area: _this.getNameByCode(_this.ENUM.AREA, _this.alterationData.netArea + _this.netSeparator + _this.alterationData.netType),
                        areaType: _this.alterationData.netArea,
                        areaCode: _this.alterationData.netType,
                        itemName: item.name,
                        devName: "",
                        setting: "",
                        content: "",
                        isAuto: "",
                        /*  gmtComplete: "2018-11-10",
                          endTime: "2018-12-09",*/
                        // gmtCreate: "2018-12-09"
                    })
                }
            });
        },
        /**
         * 新增技术服务目录
         */
        addTech() {
            let _this = this;
            if (this.alterationData.netArea == "") {
                this.$message.warning("请先选择区域");
                return;
            }
            this.EDIT_ENUMS.REFS.TECH_SELECT.SHOW = true;
            this.$nextTick(() => {
                _this.$refs[_this.EDIT_ENUMS.REFS.TECH_SELECT.REF].openDialog(_this.areaId);
            });
        },
        /**
         * 技术服务表格选中的行
         */
        techHandleSelectionChange(selection) {
            this.tableSelect.tec = selection;
        },
        /**
         * 删除技术服务
         */
        deleteTech() {
            this.deletes(this.alterationData.alterationTichCatalogList, this.tableSelect.tec);
        },
        /**
         * 初始化按钮
         * @returns {any[]}
         */
        initTecButton() {
            return [
                Object.assign({}, this.ENUM.BUTTON.ADD, {callback: this.addTech}),
                Object.assign({}, this.ENUM.BUTTON.DELETES, {callback: this.deleteTech})
            ];
        },
        //隐藏按钮
        hiddenTecButton(value) {
            if (value != this.ENUM.APPR_STATUS.DRAFT && value != null) {
                this.buttons.techButtons = [];
            }
        }
    },
    mounted() {
        if (this.$route.query.actionType != this.ENUM.ACTIONTYPE.VIEW) {
            this.buttons.techButtons = this.initTecButton();
        }
    }
}