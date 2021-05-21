export default {
    methods: {
        /**
         * 获取设备类别的名称
         * @param code
         * @returns {null|Array}
         */
        onCategoryRenderer(code) {
            return this.ENUMS.CATEGORY_MAP[code];
        },
        /**
         * 设备类别的渲染
         * @param e
         * @returns {*}
         */
        onChildTypeRenderer(e) {
            let childTypeData = [];
            let category = Math.floor(e / (this.ENUMS.CHILD_CATEGORY_CODE_FLAG / this.ENUMS.CATEGORY_CODE_FLAG));
            if (!!this.ENUMS.CATEGORY_DATA) {
                for (let i = 0; i < this.ENUMS.CATEGORY_DATA.length; i++) {
                    if (category == this.ENUMS.CATEGORY_DATA[i].code) {
                        childTypeData = this.ENUMS.CATEGORY_DATA[i].children;
                    }
                }
                return this.getNameByCode(childTypeData, e);
            } else {
                return e;
            }
        },
        /**
         * 使用情况渲染
         * @param e
         * @returns {*}
         */
        onStateRenderer(e) {
            return this.getNameByCode(this.ENUMS.STATE_DATA.properties, e);
        },
        /**
         * 涉密属性的渲染
         * @param e
         * @returns {*}
         */
        onSecretRenderer(e) {
            return this.getNameByCode(this.ENUMS.YES_NO.properties, e);
        },
        /**
         * 是否的渲染
         * @param e
         * @returns {*}
         */
        onYesNoRenderer(e) {
            return this.getNameByCode(this.ENUMS.YES_NO.properties, e);
        },
        /**
         * 联网类型的渲染
         * @param netArea
         * @param netType
         * @param useFor
         * @returns {*}
         */
        onNetAndTypeRenderer(netArea, netType, useFor) {
            let _data = this.ENUMS.NET_AREA_TYPE_DATA;
            if (!!netArea && !!netType) {
                let _value = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                for (let i in _data) {
                    let _cur = _data[i];
                    if (_cur.code == _value) {
                        return _data[i].name;
                    }
                }
                return netArea + netType;
            } else if (useFor) {
                return useFor;
            }
        },
        /**
         * 设备形态的名称
         * @param code
         * @returns {*}
         */
        onShapeTypeRenderer(code) {
            if (this.ENUMS.SHAPE_TYPE_DATA) {
                return this.getNameByCode(this.ENUMS.SHAPE_TYPE_DATA, code);
            } else {
                return ''
            }
        },
        /**
         * 放置地点的渲染
         * @param data
         * @returns {*}
         */
        onCurrentPlaceRenderer(data) {
            let _data = "";
            if (data) {
                let place = data.split(this.ENUMS.NET_SEPARATOR());
                for (let i = 0; i < place.length; i++) {
                    if (place[i]) {
                        _data += place[i] + "-";
                    }
                }
                return _data.substring(0, _data.length - 1);
            }
        },
        /**
         * 系统级别的渲染
         * @param code
         * @return {*}
         */
        onSystemLevelRenderer(code) {
            return this.getNameByCode(this.ENUMS.SYSTEM_LEVEL_DATA, code);
        },
        /**
         * 密级渲染
         * @param code
         * @returns {*}
         */
        onSecretLevelRenderer(code) {
            return this.getNameByCode(this.ENUMS.DATA_SECRET_LEVEL_DATA, code);
        },
    }
}