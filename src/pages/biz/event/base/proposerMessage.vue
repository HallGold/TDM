<template>
    <div style="width: 100%;">
        <ice-query-grid
                :columns="colunms">
        </ice-query-grid>
    </div>

</template>

<script>
    // import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid';
    export default {
        name: "proposerMessage",
        data(){
            return {
              colunms: [
                  {type: 'input', label: '申请编号', code: 'serviceTicket'},
                  {type: 'input', label: '申请人', code: 'breakdownName'},
                  {type: 'input', label: '申请单位', code: 'breakdownName'},
                  {type: 'input', label: '申请时间', code: 'userName'},
                  {type: 'input', label: '陪同人', code: 'userName'},
                  {type: 'input', label: '申请进入部位', code: 'userName'},
                  {type: 'input', label: '状态', code: 'userName'},
              ]
            }
        },
        method: {
            colunms: [
                {type: 'input', label: '申请编号', code: 'serviceTicket'},
                {type: 'input', label: '申请人', code: 'breakdownName'},
                {type: 'input', label: '申请单位', code: 'breakdownName'},
                {type: 'input', label: '申请时间', code: 'userName'},
                {type: 'input', label: '陪同人', code: 'userName'},
                {type: 'input', label: '申请进入部位', code: 'userName'},
                {type: 'input', label: '状态', code: 'userName'},
            ],

        },
        components: {
            // IceEditableTable,
            IceQueryGrid
        }
    }
</script>

<style scoped>

</style>