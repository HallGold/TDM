<template>
    <div class="content-filled">
        <ice-query-grid data-url="/pms/questionnaire/QuesExamRepository/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">

        </ice-query-grid>
        <ice-dialog title="问卷题目编辑"
                    :visible.sync="visible"
                    width="1000px"
                    remounted
                    :buttons="[{name:'保存',click:examConfirm},{name:'取消',iscannel:true}]">
            <question-editor ref="questionEditor"></question-editor>
        </ice-dialog>
        <ice-dialog title="问卷题目查看"
                    :visible.sync="viewVisible"
                    width="1000px"
                    remounted
                    :buttons="[{name:'取消',iscannel:true}]">
            <question-editor ref="questionView" readonly></question-editor>
        </ice-dialog>
    </div>

</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    import IceDialog from "../../components/common/base/IceDialog";
    import IceSelect from "../../components/common/base/IceSelect";
    import IceEditableTable from "../../components/common/base/IceEditableTable";
    import IceTableColumn from "../../components/common/base/IceTableColumn";
    import IceEditableTableColumn from "../../components/common/base/IceEditableTableColumn";
    import EditableTable from "../../components/common/form/panels/tablePanel/EditableTable";
    import QuestionEditor from "./widget/questionEditor";

    export default {
        name: "questionRepository",
        data() {
            return {
                visible: false,
                viewVisible: false,
                query: [
                    {type: 'input', label: '题目标题', code: 'examTitle', value: '', exp: 'like'},
                    {type: 'input', label: '题目描述', code: 'examDesc', value: '', exp: "like"},
                ],
                examTypeMap: {
                    textQuestion: '文本题',
                    singleQuestion: '单选题',
                    multiQuestion: '多选题',
                    scoreQuestion: '打分题',
                    singleGroupQuestion: '单选分组题',
                    multiGroupQuestion: '多选分组题',
                    scoreGroupQuestion: '打分分组题',
                },
                columns: [
                    {code: 'oid', hidden: true},
                    {
                        label: '题目类型', code: 'examType', width: 140, sortable: true, formatter: row => {
                            return this.examTypeMap[row['examType']]
                        }
                    },
                    {label: '题目标题', code: 'examTitle', width: 340, align: "left"},
                    {label: '题目描述', code: 'examDesc', width: 340, align: "left"},
                    {
                        label: '是否生效中', code: 'publishNum', width: 100, formatter: row => {
                            return row['publishNum'] > 0 ? '是' : '否'
                        }
                    }],
                operations: [
                    {
                        name: '修改', code: "BXZ1", isShow: row => {
                            return row['publishNum'] <= 0;
                        }, callback: this.editExam
                    },
                    {
                        name: '删除', code: "BXZ2", isShow: row => {
                            return row['useNum'] <= 0;
                        }, callback: this.deleteExam
                    },
                    {
                        name: '查看', code: "BXZ3", callback: this.viewExam
                    }
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', code: "BXZ", callback: this.addExam},
                ],

            }
        },
        methods: {
            addExam() {
                this.visible = true
            },
            async editExam(row) {
                this.visible = true
                if (row.oid) {
                    let {data} = await this.$axios.get("/pms/questionnaire/QuesExamRepository/get", {params: {id: row.oid}})
                    this.$nextTick(_ => {
                        this.$refs.questionEditor.setData({...data})
                    })
                }

            },
            async deleteExam(row) {
                try {
                    if (row.oid) {
                        await this.$confirm('是否确认删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        try {
                            await this.$axios.delete("/pms/questionnaire/QuesExamRepository/del", {params: {id: row.oid}})
                            this.$refs.grid.refresh();
                        } catch (e) {
                            console.error(e)
                            this.$message.error("删除失败")
                        }

                    }
                } catch (e) {

                }


            },
            async examConfirm() {
                let data;
                try {
                    data = await this.$refs.questionEditor.getData()
                    this.$refs.grid.refresh();
                } catch (e) {
                    return false;
                }
                //直接保存
                try {
                    const result = await this.$axios.post("/pms/questionnaire/QuesExamRepository/saveOrUpdate", data)
                    this.$message.success("保存成功")
                    this.$refs.grid.refresh();
                } catch (e) {
                    this.$message.error(e.msg);
                    return false;
                }
            },
            async viewExam(row) {
                this.viewVisible = true
                if (row.oid) {
                    let {data} = await this.$axios.get("/pms/questionnaire/QuesExamRepository/get", {params: {id: row.oid}})
                    this.$nextTick(_ => {
                        this.$refs.questionView.setData({...data})
                    })
                }
            }
        },
        components: {
            QuestionEditor,
            EditableTable,
            IceEditableTableColumn, IceTableColumn, IceEditableTable, IceSelect, IceDialog, IceQueryGrid
        }
    }
</script>

<style scoped>

</style>
