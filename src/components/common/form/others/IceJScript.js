export default class IceJScript {
    constructor(editExpress, buildExpress) {
        this.editExpress = editExpress;
        this.buildExpress = buildExpress;
    }

    getFunAction() {
        // this.funaction = (0, eval)(this.buildExpress)
        if (this.buildExpress) {
            return (0, eval)(this.buildExpress);
        }
        if (this.editExpress) {
            return (0, eval)(this.editExpress);
        }
    }


}