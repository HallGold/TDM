<template>

    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%"><!-- :gridData="ccc" -->
        <ice-query-grid
                data-url="biz/enthetic/searchByTypePage"
                chooseItem="single"
                @selection-change="trace"
                :query="queryMap"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                export-title="非授权人员进入"
                ref="grids">
        </ice-query-grid><!-- data-url="biz/ProEvtWorkTicket/workOrderHandleList" -->
    </div>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout'
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import positionComm from "./../position/positionComm.js"

    export default {
        name: 'bizApplyinNoImpower',
        mixins: [positionComm],
        data() {

            return {
                opinionData: "",
                rowItem: [],
                mainData: {
                    serviceTicket: "",
                    serviceStatus: "",
                    oid: "",
                },
                queryMap: [
                    {type: "input", label: '申请单号', code: 'applyNum', value: ''},
                    {type: "input", label: '进入人员名称', code: 'name', value: ''},
                    {type: "input", label: '密级', code: 'denseLv', value: ''},
                    {type: "input", label: '单位', code: 'unit', value: ''},
                    {type: "input", label: '陪同人员', code: 'escort', value: ''},
                    {type: "input", label: '部门名称', code: 'deptName', value: ''},
                    {type: "input", label: '部门类型', code: 'type', value: ''},
                    {type: "select", label: '是否要害部位', code: 'isCrucial', value: '', mapTypeCode: 'YES_NO'},
                    {type: "date", label: '实际进入时间（开始）', code: 'actualIntoDate', exp: '>=', value: '',compare:1},
                    {type: "date", label: '实际进入时间（结束）', code: 'actualIntoDate', exp: '<=', value: '',compare:2},
                    {type: "date", label: '实际离开时间（开始）', code: 'actualOutDate', exp: '>=', value: '',compare:3},
                    {type: "date", label: '实际离开时间（结束）', code: 'actualOutDate', exp: '<=', value: '',compare:4},
                ],
                num: [],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '申请单号', code: 'applyNum', width: 120},
                    {code: 'applyId', hidden: true},
                    {label: '进入人员名称', code: 'name', width: 140},
                    {label: '单位', code: 'unit', width: 120},
                    {label: '密级', code: 'denseLv', width: 100, mapTypeCode: "OR_SECRET_LEVEL"},
                    {label: '陪同人员', code: 'escort', width: 100},
                    {label: '部门名称', code: 'deptName', width: 100},
                    {label: '受控类型', code: 'manageType', width: 90, mapTypeCode: "controlledType"},
                    {label: '部位类型', code: 'type', width: 90, mapTypeCode: "specificType"},
                    {label: '是否要害部位', code: 'isCrucial', width: 100, mapTypeCode: 'YES_NO'},
                    {label: '实际进入时间', code: 'actualIntoDate', width: 150},
                    {label: '实际离开时间', code: 'actualOutDate', width: 150},
                ],
                operations: [
                    {name: '查看', type: 'primary', callback: this.particular}
                ],
                buttons: [
                    {name: '导出', type: "export", icon: 'el-icon-upload2'}
                ],
                dialogVisible: false,
                mainDataForm: {},
                tittle: ''
            }
        },
        methods: {
            particular(data) {
                this.$router.push("/biz/applyin/applyInManage/addNew?dataId=" + data.oid + "&button=look");
            },
            /*列表选中的信息*/
            trace(rows) {
                this.rowItem = rows;
            },
        },
        components: {
            IceSelect,
            IceQueryGrid,
            IceGridLayout,
            IceDialog,
            IceEditableTable,
            IceEditableTableColumn,
            IceMultipleUpload,

        },
    }

</script>


<style scoped>

</style>
