<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid data-url="/biz/BoxAf/list"
                        :query="query"
                        title="建议与咨询"
                        chooseItem="multiple"
                        :operations="operations"
                        @selection-change="handleSelectionChange"
                        ref="grid"
                        :buttons="buttons"
                        :columns="columns">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceForm from "../../../components/common/base/IceForm";
    export default {
        name: "SysBoxAf",
        components: {IceForm, IceDialog, IceQueryGrid},
        data(){
            return{
                visibleDialog:false,
                visibleDialogLook:false,
                checked_ids: '',
                choosedFlag: false,
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'afStatus',
                        value: 'all',//[-1:草稿,1:运行中,2:已完成,3驳回]
                        tablist: [{label: '全部', value: 'all'},
                            {label: '草稿', value: '-1', hiddenColumns: ['afStatus']},
                            {label: '运行中', value: '1', hiddenColumns: ['afStatus']},
                            {label: '驳回', value: '3', hiddenColumns: ['afStatus']},
                            {label: '已完成', value: '2', hiddenColumns: ['afStatus']}
                        ]
                    },
                    {type: 'input', label: '单号', code: 'afNo',value:""},
                    {type: 'input', label: '主题', code: 'complaintTitle',value:""},
                    {type: 'input', label: '提交人', code: 'afUserName',value:""},
                    {type: 'input', label: '提交部门', code: 'afDepartmentName',value:""},
                    {type: 'select', label: '反馈项目', code: 'sysType',mapTypeCode: "sys_type_",value:""},
                    {type: 'select', label: '分类', code: 'type',mapTypeCode: "SYS_TYPE",value:""},

                    {type: 'date', label: '提交时间从', code: 'afDate', value: '', exp: '>=',value:""},
                    {type: 'date', label: '至', code: 'afDate', value: '', exp: '<=',value:""},
                ],
                columns:[//列表展示列
                    {code: 'oid', hidden: true},
                    {label:'单号',code:'afNo', width: 120,sortable: true},
                    {label:'主题',code:'complaintTitle', width: 200,sortable: true},
                    {label:'内容',code: 'complaintContent', hidden:true,export:true},
                    {label:'提交人',code:'afUserName', width: 120,sortable: true},
                    {label:'提交部门',code:'afDepartmentName', width: 120,sortable: true},
                    {label:'提交时间',code:'afDate', width: 150,sortable: true},
                    {label:'回复部门',code:'replyDept',sortable: true},
                    {label:'反馈项目',code:'sysType', width: 120, mapTypeCode: "sys_type_",sortable: true},
                    {label:'分类',code:'type', mapTypeCode: "SYS_TYPE", width: 80,sortable: true},
                    {label:'是否发布',code:'ispublished', mapTypeCode: "YES_NO", width: 100,sortable: true},
                   {label:'状态',code:'afStatus', mapTypeCode: "flow_af_status", width: 80}
                ],
                buttons: [
                    {name: '建议',ctrlCode:"BJY",icon: 'el-icon-plus', type: 'primary', callback:()=>{
                            this.$router.push("/biz/sys/SysBoxAf?type=1")}},
                    {name: '咨询',ctrlCode:"BZX",icon: 'el-icon-plus', type: 'primary', callback:()=>{
                            this.$router.push("/biz/sys/SysBoxAf?type=2")}},
                    {name: '发布',disabled:true,ctrlCode:"BFB",type:0,callback:this.publishCallback},
                    {name: '取消发布',disabled:true,ctrlCode:"BQXFB",type:0,callback:this.cancelPublishCallback},
                    {name: '导出',ctrlCode:"BTS",icon: 'el-icon-plus', type: 'export'}
                ],
                operations: [
                    {
                        name: '详情', callback: (row) => {
                            this.$router.push("/biz/sys/SysBoxAf?type="+row.type+"&dataId="+row.oid)
                        }
                    }
                ]
            }
        },
        methods:{
            handleSelectionChange(rows){
                if (rows.length > 0) {
                    let checked_ids = ''
                    for (let i = 0; i < rows.length; i++) {
                        checked_ids += rows[i].oid + ','
                    }
                    this.publicBtn(rows);//控制发布按钮是否可用
                    this.checked_ids = checked_ids
                    this.choosedFlag = true
                } else {
                    this.choosedFlag = false
                }

            },
            publicBtn(rows){
                if(this.buttons.length>=4){
                    let publicBtn=false,cancelBtn=false;
                    for (let i = 0; i < rows.length; i++) {
                        if(rows[i].afStatus!=2||rows[i].ispublished==1){
                            publicBtn=true;
                        }
                        if(rows[i].afStatus!=2||rows[i].ispublished==0){
                            cancelBtn=true;
                        }
                    }
                    this.buttons[2].disabled=publicBtn;
                    this.buttons[3].disabled=cancelBtn;
                }
            },
            publishCallback() {
                let url = "/biz/BoxAf/modifyPublishedState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要批量发布当前选中记录吗?"
                let tip = "发布"
                this.confirmTemp(url, warning, tip, paramData)
            },
            cancelPublishCallback() {
                let url = "/biz/BoxAf/modifyPublishedState"
                let paramData = {"params": {"type": 0, "ids": this.checked_ids}}
                let warning = "确定要批量取消发布当前选中记录吗?"
                let tip = "取消发布"
                this.confirmTemp(url, warning, tip, paramData)
            },
            confirmTemp(url, warning, tip, paramData) {
                if (this.choosedFlag) {
                    this.$confirm(warning, tip, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type:"info"
                    }).then(() => {
                        this.$axios.get(url, paramData)
                            .then(result => {
                                this.$message.success("操作成功");
                                this.refresh();
                                this.choosedFlag = false;
                            }).catch(error => {
                            this.$message.error(error.msg);
                        });
                    }).catch(() => {
                    });
                } else {
                    this.$message.warning('请先选择需要操作的记录！');
                }
            },
            refresh() {
                this.$refs.grid.refresh();
            },
        }
    }
</script>