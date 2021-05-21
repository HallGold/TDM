export default {
    data() {
        return {
            modelName: "",
            url: ""
        }
    },
    methods: {
        /**
         * 关联单据信息点击事件
         * @param data
         */
        clcik(data) {
            let host = window.location.href.substring(0, window.location.href.indexOf("#") + 1);
            window.open(host + data.url + "?dataId=" + data.otherModelId);
            // this.$router.push(data.url + "?dataId=" + data.otherModelID);
        },
        /**
         * 选择关联单据信息时触发
         * @param data
         */
        selectRele(data, modelName, url) {
            this.releSelect = data;
            this.modelName = modelName;
            this.url = url;
        },
        /**
         * 关联单据信息确认按钮响应事件
         */
        confirmWith() {
            let _this = this;
            for (let i = 0; i < this.releSelect.length; i++) {
                let _rele = this.releSelect[i];
                this.alterationData.alterationOtherModelVoList.push({
                    oid: "",
                    alterationNum: _this.alterationData.alterationNum,
                    url: this.url,
                    otherModelName: _this.modelName,
                    otherModelId: _rele.oid
                });
            }
            this.EDIT_ENUMS.REFS.RELE_SELECT.SHOW = false;
        },
        /**
         * 关联单据信息取消按钮响应事件
         */
        close() {
            this.EDIT_ENUMS.REFS.RELE_SELECT.SHOW = false;
        },
        /**
         * 新增关联
         */
        addContact() {
            this.EDIT_ENUMS.REFS.RELE_SELECT.SHOW = true;
        },
        /**
         * 删除关联信息
         */
        deleteContact(row) {
            let list = this.alterationData.alterationOtherModelVoList;
            this.alterationData.alterationOtherModelVoList.splice(list.indexOf(row), 1)
        },
        initOtherModelButton() {
            return [Object.assign({}, this.ENUM.BUTTON.CONTACT, {callback: this.addContact})];
        },
        //隐藏按钮
        hiddenOtherButton(value) {
            if (value != this.ENUM.APPR_STATUS.DRAFT && value != null) {
                this.buttons.contactButtons = [];
                this.operations = [];
            }
        }
    },
    mounted() {
        if (this.$route.query.actionType != this.ENUM.ACTIONTYPE.VIEW) {
            this.buttons.contactButtons = this.initOtherModelButton();
        }
    }
}