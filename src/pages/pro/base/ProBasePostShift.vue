<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title=""
                        data-url="/pro/ProBasePostShift/list"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';

    export default {
        name: "ProBasePostShift",
        props: {
            tendId: {
                type: String,
                default: '0'
            }
        },
        components: {IceQueryGrid},
        data() {
            /*let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '用户代码', code: 'usercode', hidden: true},
                {label: '运维组织ID', code: 'tendId', hidden: true},
                {label: '运维组织', code: 'tendName', width: 100},
                {label: '用户名称', code: 'username', width: 180},
                {label: '担岗时间', code: 'gmtStart', width: 160},
                {label: '离岗时间', code: 'gmtEnd', width: 160},
                {label: '创建人', code: 'createUser', width: 120},
                {label: '创建时间', code: 'createDate', width: 160}];*/
            return {
                /*query:common.toQuery(ncolumns, [{
                    type: 'static', value: () => {
                        return this.tendId == '0' ? null : this.tendId
                    }, code: 'tendId'
                },{
                    type: 'date', exp: '>=',code:'gmtStart',label:'担岗时间'
                },{
                    type: 'date', exp: '>=',code:'gmtEnd',label:'离岗时间'
                },{
                    type: 'date', exp: '>=',code:'createDate',label:'创建时间'
                },]),
                columns:ncolumns,*/
                query: [
                    {label: '运维组织', code: 'tendName', type: 'input',},
                    {label: '用户名称', code: 'username', value: '', type: 'input'},
                    {
                        type: 'static', value: () => {
                            return this.tendId == '0' ? null : this.tendId
                        }, code: 'tendId'
                    }, {
                        type: 'date', exp: '>=', code: 'gmtStart', label: '担岗时间'
                    }, {
                        type: 'date', exp: '>=', code: 'gmtEnd', label: '离岗时间'
                    }, {
                        type: 'date', exp: '>=', code: 'createDate', label: '创建时间'
                    },
                    /*{label: '用户名称', code: 'username',type:'input'},*/
                    /*{label: '创建人', code: 'createUser',type:'input'},*/
                ],
                columns: [{label: 'oid', code: 'oid', hidden: true},
                    {label: '用户代码', code: 'usercode', hidden: true},
                    {label: '运维组织ID', code: 'tendId', hidden: true},
                    {label: '运维组织', code: 'tendName', width: 220},
                    {label: '用户名称', code: 'username', width: 220},
                    {label: '担岗时间', code: 'gmtStart', width: 220, sortable: true,},
                    {label: '离岗时间', code: 'gmtEnd', width: 220, sortable: true,},
                    {label: '创建人', code: 'createUser', width: 220},
                    {label: '创建时间', code: 'createDate', width: 160, sortable: true,}]
            }
        },
        methods: {
            show() {
                this.$refs.mainQueryGrid.refresh();
            },
            refresh() {
                this.$refs.mainQueryGrid.refresh();
            }
        }
    }
</script>

<style scoped>

</style>