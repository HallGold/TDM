export default {
    data() {
        return {};
    },
    methods: {
        /**
         * 新增业务服务目录
         */
        addBiz() {
            let _this = this;
            if (this.alterationData.netArea == "") {
                this.$message.warning("请先选择区域");
                return;
            }
            this.EDIT_ENUMS.REFS.BIZ_SELECT.SHOW = true;
            this.$nextTick(() => {
                _this.$refs[this.EDIT_ENUMS.REFS.BIZ_SELECT.REF].opendialog();
            });
        },
        /**
         * 业务服务选中后触发
         * @param data
         */
        regionNodeClick(treeId, gridRow) {
            let _this = this;
            gridRow.forEach(item => {
                if (_this.findSameRowByCode(_this.alterationData.alterationBizCatalogList, item.oid, "catalogId") == -1) {
                    _this.alterationData.alterationBizCatalogList.push({
                        oid: "",
                        alteratioNum: _this.alterationData.alterationNum,
                        catalogId: item.oid,
                        area: _this.getNameByCode(_this.ENUM.AREA, _this.alterationData.netArea + _this.netSeparator + _this.alterationData.netType),
                        areaType: _this.alterationData.netArea,
                        areaCode: _this.alterationData.netType,
                        itemName: item.categoryName,
                        catalogName: item.catalogName,
                        serviceLevel: item.lv,
                        startTime: item.gmtBegin,
                        endTime: item.gmtEnd,
                        catalogCreator: item.createUser
                    });
                }
            });
        },
        /**
         * 业务服务表格选中的行
         * @param selection
         */
        bizHandleSelectionChange(selection) {
            this.tableSelect.biz = selection;
        },
        /**
         *批量删除业务服务目录
         */
        deleteBiz() {
            this.deletes(this.alterationData.alterationBizCatalogList, this.tableSelect.biz);
        },
        /**
         *初始化按钮
         * @returns {any[]}
         */
        initBizButton() {
            return [
                Object.assign({}, this.ENUM.BUTTON.ADD, {callback: this.addBiz}),
                Object.assign({}, this.ENUM.BUTTON.DELETES, {callback: this.deleteBiz})
            ];
        },
        //隐藏按钮
        hiddenBizButton(value) {
            if (value != this.ENUM.APPR_STATUS.DRAFT && value != null) {
                this.buttons.bizButtons = [];
            }
        }
    },
    mounted() {
        if (this.$route.query.actionType != this.ENUM.ACTIONTYPE.VIEW) {
            this.buttons.bizButtons = this.initBizButton();
        }
    }
}