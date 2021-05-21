<template>
    <div class="ice-container">
            <ice-query-grid data-url="/pms/QisWhpSms/list"
                            :query="query"
                            :operations-width="200"
                            :columns="columns"
                            :chooseItem="chooseItem"
                            @selection-change="select"
                            ref="grid">

            </ice-query-grid>

        <el-footer>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="back">关闭</el-button>
            </div>
        </el-footer>
    </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import moment from 'moment';

    export default {
        components:{
            IceDialog,
            IceQueryGrid,
            moment,
        },
        name: "whpsms_selector",
        data(){
            return{
                items:[],
                query: [
                    {type: 'input', code: 'smsCode', label: '编号'},
                    {type: 'input', code: 'smsName', label: '名称'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '编号', code: 'smsCode', width: 200,},
                    {label: '名称', code: 'smsName', width: 200,},
                    {label: '来源', code: 'smsLy', width: 200, mapTypeCode:'SMS_LY'},
                    {label: '版本', code: 'version',  width: 200,},
                    {label: '备注', code: 'dateRemark', width: 500},
                    {label: '上传人', code: 'uploadPerson', width: 200},
                    {label: '上传时间', code: 'createDate', width: 200,formatter(row) {
                            return row.createDate === null ? null : moment(row.createDate).format('YYYY-MM-DD');
                        }},
                    {label: '密级', code: 'dataSecretLevcode', hidden: true},
                    {label: '附件ID集合', code: 'docIds', hidden: true},
                ],
            }
        },
        props: {
            chooseItem: {
                default: 'single',
            },
        },
        methods:{
            select(items) {
                this.items = items;
            },
            confirm() {
                this.$emit("select", this.items);
            },
            back() {
                this.$emit('closeVisible');
            },
            refresh(){
                if (this.$refs.gird) {
                    this.$refs.gird.refresh();
                }

            }
        },
    }
</script>

<style scoped>

</style>