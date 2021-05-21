export default {
    // computed: {
    //     filterSelectList() {
    //         if (this.mapTypeCode) {
    //             return this.getDataMapList()(this.mapTypeCode);
    //         } else {
    //             return this.selectList;
    //         }
    //
    //     }
    // },
    // created() {
    //     if (this.mapTypeCode) {
    //         this.addUndoTypeCodes(this.mapTypeCode);
    //     }
    // },
    // methods:{
    //     ...mapMutations('datamapStore', ['addUndoTypeCodes']),
    //     ...mapGetters('datamapStore', [ 'getDataMapList']),
    // },
    sbzt(row){
        var newOption = '';
        switch(row.cellValue){
            case "SBZT10":
                newOption = '未上报';
                break;
            case "SBZT20":
                newOption = '已上报';
                break;
            default:
        }
        return newOption;
    },
    spzt(row){
        var newOption = '';
        switch(row.cellValue){
            case "SPZT10":
                newOption = '未审批';
                break;
            case "SPZT20":
                newOption = '审批中';
                break;
            case "SPZT30":
                newOption = '已审批';
                break;
            case "SPZT40":
                newOption = '终止审批';
                break;
            default:
        }
        return newOption;
    },
    miji(cell){
        var newOption = '';
        switch(cell.cellValue){
            case "1":
                newOption = '公开';
                break;
            case "2":
                newOption = '内部';
                break;
            case "3":
                newOption = '密级';
                break;
            case "4":
                newOption = '机密';
                break;
            default:
        }
        return newOption;
    },
}