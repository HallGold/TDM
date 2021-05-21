export default {
    methods: {
        //状态的渲染
        onStateRenderer(row) {
            return this.getNameByCode(this.ENUM.APPR_STATUS.properties, row.apprStatus);
        },
        //实施状态
        onExecuteStateRenderer(row){
            return this.getNameByCode(this.ENUM.EXECUTE_STATUS.properties, row.execuStatus);
        },
        //变更类型的渲染
        onTypeRenderer(row) {
            return this.getNameByCode(this.ENUM.ALTERATION_TYPE.properties, row.alterationType);
        },
        //根据网络区域和网络类型渲染区域
        onNetAndTypeRenderer(row) {
            return this.getAreaByNetAreaAndNetType(row.netArea, row.netType);
        },
        onYesOrNoRenderer(row) {
            return this.getNameByCode(this.ENUM.YES_NO.properties, row.isAuto);
        }
    }
}