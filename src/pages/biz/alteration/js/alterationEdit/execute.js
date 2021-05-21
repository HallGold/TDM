export default {
    data() {
        return {};
    },
    methods: {
        /**
         * 表格的校验
         */
        onGridValidation() {
            let that = this;
            this.$refs.executeTable.validateAll((valid) => {
                for (let i = 0; i < that.executeData.alterationExecuteDetailVos.length; i++) {
                    let _detail = that.executeData.alterationExecuteDetailVos[i];
                    if (that.devMap[_detail.catalogId] == null) {
                        let num = i + 1;
                        that.$alert('请补充序号为【' + num + '】的服务目录的变更对象', '提示', {
                            confirmButtonText: '确定'
                        });
                        return false;
                    }
                }
                return valid;
            });
        },
        /**
         * 删除实施情况
         */
        deleteExecute(row) {
            let list = this.executeData.alterationExecuteDetailVos;
            this.executeData.alterationExecuteDetailVos.splice(list.indexOf(row), 1);
            if (this.devMap[row.catalogId]) {
                this.devMap[row.catalogId] = null;
            }
            if (this.executeData.alterationExecuteDetailVos.length > 0) {
                this.$refs.executeGrid.toggleSelectionByIndex(0);
            } else {
                this.setDevTableData(row.catalogId);
            }
        },
        /**
         * 表格选择行改变响应事件
         */
        executeTableChange(rows) {
            // if (row[0]) {
            this.executeSelected = rows;
            this.initQuery();
            this.setDevTableData(rows[0].catalogId);
            // }
        },
        /**
         * 选择技术服务目录后触发
         * @param datas
         */
        getTechData(data) {
            let _this = this;
            this.executeData.alterationExecuteDetailVos = this.executeData.alterationExecuteDetailVos || [];
            data.forEach(item => {
                if (_this.findSameRowByCode(_this.executeList, item.catalogId, "catalogId") == -1) {
                    let area = _this.getAreaById(item.areaId);
                    _this.executeList.push({
                        execuNum: _this.executeData.execuNum,
                        catalogId: item.catalogId,
                        categoryName: item.bigCategoryName,
                        catalogName: item.categoryName,
                        itemName: item.name,
                        netArea: area.code.split(_this.netSeparator)[0],
                        netType: area.code.split(_this.netSeparator)[1],
                        area: item.areaName
                    });
                    _this.devMap[item.catalogId] = [];
                }
            });
            this.$refs.executeGrid.toggleSelectionByIndex(0);
        },
        /**
         * 根据区域id获取区域code
         * @param areaId
         */
        getAreaById(areaId) {
            let _return = {};
            for (let i = 0; i < this.ENUM.AREA.length; i++) {
                let _area = this.ENUM.AREA[i];
                if (_area.oid == areaId) {
                    _return = _area;
                    break;
                }
            }
            return _return;
        },
        /**
         * 跟基友区域名称获取区域
         * @param area
         */
        getAreaByName(area) {
            let _return = {};
            for (let i = 0; i < this.ENUM.AREA.length; i++) {
                let _area = this.ENUM.AREA[i];
                if (_area.name == area) {
                    _return = _area;
                    break;
                }
            }
            return _return;
        },
        /**
         * 新增实施情况
         */
        addExecute() {
            let _this = this;
            this.EDIT_ENUMS.REFS.TECH_SELECT.SHOW = true;
            this.$nextTick(() => {
                _this.$refs[_this.EDIT_ENUMS.REFS.TECH_SELECT.REF].openDialog();
            });
            // this.$refs.executeGrid.toggleSelectionByIndex(0);
        },
        /**
         * 设置变更对象表格数据
         * @param id
         */
        setDevTableData(id, devList) {
            if (!this.executeSelected[0].devName || this.executeSelected[0].devName == "") {
                Object.assign(this.executeSelected[0], devList);
            } else {
                this.executeList.push({
                    execuNum: this.executeSelected[0].execuNum,
                    catalogId: this.executeSelected[0].catalogId,
                    categoryName: this.executeSelected[0].categoryName,
                    catalogName: this.executeSelected[0].catalogName,
                    itemName: this.executeSelected[0].itemName,
                    netArea: this.executeSelected[0].netArea,
                    netType: this.executeSelected[0].netType,
                    area: this.executeSelected[0].area,
                    devName: devList.devName,
                    devIp: devList.devIp,
                    devNum: devList.devNum,
                    devId: devList.devId
                });
            }
        },
        /**
         * 打开设备选择页面
         */
        openDevSelect() {
            this.EDIT_ENUMS.REFS.DEV_SELECT.SHOW = true;
            this.$nextTick(() => {
                this.$refs[this.EDIT_ENUMS.REFS.DEV_SELECT.REF].openDialog();
            });
        },
        /**
         * 选中设备以后触发
         * @param data
         */
        selectDev(data) {
            let _this = this;
            return new Promise((resolve, reject) => {
                for (let i = 0; i < data.length; i++) {
                    if (_this.findSameRowByCode(_this.devMap[_this.executeSelected[0].catalogId], data[i].oid, "devId") == -1) {
                        _this.loadDevById(data[i].oid).then(res => {
                            let _name = '';
                            if (!res.dataDTO.commDTO.masterIp || res.dataDTO.commDTO.masterIp == "") {
                                _name = res.dataDTO.commDTO.name;
                            } else {
                                _name = res.dataDTO.commDTO.name + "/" + res.dataDTO.commDTO.masterIp;
                            }
                            let devList = {
                                execuNum: _this.executeData.execuNum,
                                devName: _name,
                                devIp: res.dataDTO.commDTO.masterIp,
                                devNum: res.dataDTO.commDTO.devSn,
                                devId: res.dataDTO.commDTO.oid
                            };
                            let catalogId = _this.executeSelected[0].catalogId;
                            _this.devMap[catalogId].push(devList);
                            _this.setDevTableData(catalogId, devList);
                        });
                    }
                }
                _this.EDIT_ENUMS.REFS.DEV_SELECT.SHOW = false;
            });
        },
        /**
         * 新增变更对象
         */
        addDev() {
            let _this = this;
            if (this.executeSelected.length == 0) {
                this.$alert("请选择相关实施服务项", "提示", {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                });
            } else if (this.executeSelected.length > 1) {
                this.$alert("请选择一条实施服务项", "提示", {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                });
            } else {
                _this.openDevSelect();
            }
        },
        /**
         * 增加行
         */
        addRow() {
            if (this.executeSelected.length == 0) {
                this.$confirm('请选择相关实施对象', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                });
            } else {
                let catalogId = this.executeSelected[0].catalogId;
                if (!this.devMap[catalogId]) {
                    this.devMap[catalogId] = [{}];
                } else {
                    this.devMap[catalogId].push({});
                }
                this.setDevTableData(catalogId);
            }
        },
        /**
         * 变更对象表格选中行响应事件
         * @param rows
         */
        devTableChange(rows) {
            this.devSelected = rows;
        },
        /**
         * 删除变更对象
         */
        deleteDev() {
            this.deletes(this.devMap[this.executeSelected[0].catalogId], this.devSelected);
        },
        /**
         * 初始化按钮
         * @returns {any[]}
         */
        initExecuteButton() {
            return [
                Object.assign({}, this.ENUM.BUTTON.ADD, {callback: this.addExecute}),
                Object.assign({}, this.ENUM.BUTTON.LOAD_ALL_DEV, {callback: this.loadAllDev})
            ];
        },
        /**
         *组装实施执行的list
         */
        assembleExecuteList() {
            if (this.executeData.alterationExecuteDetailVos) {
                for (let i = 0; i < this.executeData.alterationExecuteDetailVos.length; i++) {
                    let catalogId = this.executeData.alterationExecuteDetailVos[i].catalogId;
                    if (this.devMap[catalogId]) {
                        this.executeData.alterationExecuteDetailVos[i].alterationExecuteObjVos = this.devMap[catalogId];
                    }
                }
            }
        },
        /**
         * 加载所有变更对象
         */
        loadAllDev() {
            if (this.executeData.alterationExecuteDetailVos) {
                this.executeData.alterationExecuteObjVos = [];
                if (this.executeSelected.length > 0) {
                    this.$refs.executeGrid.toggleSelectionByIndex();//取消选中的行
                }
                for (let i = 0; i < this.executeData.alterationExecuteDetailVos.length; i++) {
                    let _executeDetail = this.executeData.alterationExecuteDetailVos[i];
                    if (this.devMap[_executeDetail.catalogId]) {
                        this.executeData.alterationExecuteObjVos = this.executeData.alterationExecuteObjVos.concat(this.devMap[_executeDetail.catalogId]);
                    }
                }
            }
        },
        /**
         * 设置变更对象map
         */
        setDevMap() {
            if (this.executeData.alterationExecuteDetailVos) {
                for (let i = 0; i < this.executeData.alterationExecuteDetailVos.length; i++) {
                    let _alterationDeatilList = this.executeData.alterationExecuteDetailVos[i];
                    this.devMap[_alterationDeatilList.catalogId] = _alterationDeatilList.alterationExecuteObjVos;
                }
            }
        },
        /**
         *加载自己的实施明细和变更对象
         */
        getMyselfExcuteList() {
            let that = this;
            this.axios(this.ENUM.ACTIONS.GET_EXCUTE_LIST, {execuNum: that.executeData.execuNum}, [res => {
                if (res.data.length > 0) {
                    that.executeData.alterationExecuteDetailVos = res.data;
                    that.setDevMap();
                    that.loadAllDev();
                }
                that.isLoading = false;
            }]);
        },
        /**
         * 获取其他工程师实施详情
         */
        getOtherExecute() {
            let that = this;
            this.axios(this.ENUM.ACTIONS.GET_OTHER_EXECUTE, {
                alterationNum: that.executeData.alterationNum,
                execuNum: that.executeData.execuNum
            }, [res => {
                if (res.data.length > 0) {
                    that.setOtherExecuteList(res.data);
                }
            }]);
        },
        /**
         * 设置其他工程师实施列表
         */
        setOtherExecuteList(data) {
            for (let i = 0; i < data.length; i++) {
                let otherDevList = data[i].alterationExecuteObjVos;
                for (let j = 0; j < otherDevList.length; j++) {
                    if (!this.executeData.alterationExcuteOtherUserList) {
                        this.executeData.alterationExcuteOtherUserList = [];
                    }
                    this.executeData.alterationExcuteOtherUserList.push(Object.assign(data[i], otherDevList[j]));
                }
            }
        },
        /**
         * 初始化设别选择列
         * @return {*|Array}
         */
        initColumns() {
            let _this = this;
            this.EDIT_ENUMS.REFS.DEV_SELECT.DEV_COLUMNS = [
                {
                    label: '设备类型', code: 'category', width: 120, renderCell(h, data) {
                        return _this.onCategoryRenderer(data.row.category);
                    }
                },
                {label: '设备名称', code: 'name', width: 180},
                {
                    label: '设备子类', code: 'childType', width: 120, renderCell(h, data) {
                        return _this.onChildTypeRenderer(data.row.childType);
                    }
                }, {label: '保密编号', code: 'secretSn', width: 180},
                {
                    label: '密级', code: 'secretLevel', width: 100, formatter(data) {
                        return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, data.secretLevel);
                    }
                },
                {label: '责任人', code: 'dutyName', width: 100},
                {
                    label: '联网类型/用途', code: 'netAreaAndType', width: 150, ignore: true, formatter: row => {
                        return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                    }
                },
                {
                    label: '使用情况', code: 'state', width: 80, formatter(data) {
                        return _this.onStateRenderer(data.state, data.category);
                    }
                }
            ];
        },
        /**
         * 初始化设备查询条件
         */
        initQuery() {
            let _this = this;
            if (!this.executeSelected[0].netType) {
                let _area = this.getAreaByName(this.executeSelected[0].area).code.split(this.netSeparator);
                this.executeSelected[0].netType = _area[1];
                this.executeSelected[0].netArea = _area[0];
            }
            this.EDIT_ENUMS.REFS.DEV_SELECT.QUERY_DEV = [
                {
                    type: 'static',
                    label: '联网类型type',
                    code: 'netType',
                    width: 80,
                    value: _this.executeSelected[0].netType
                }, {
                    type: 'static',
                    label: '联网类型code',
                    code: 'netArea',
                    width: 80,
                    value: _this.executeSelected[0].netArea
                }
            ];
        }
    },
    mounted() {
        this.initColumns();
    }
}