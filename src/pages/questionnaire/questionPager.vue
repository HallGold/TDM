<template>
    <div class="content-filled">
        <ice-query-grid data-url="/pms/questionnaire/QuesPagers/list"
                        :query="query"
                        :operations-width="260"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <ice-dialog :visible.sync="editVisible" title="调查问卷编辑" width="900px" height="550px"
                    :buttons="[{name:'保存',click:savePager},{name:'取消',iscannel:true}]">
            <el-form :model="formData" :rules="rules" label-position="right"
                     ref="form" style="margin-top: 10px;padding: 0 20px;">
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="问卷标题:" label-width="100px" prop="title">
                            <el-input placeholder="请输入问卷标题" v-model="formData.title" :showWordLimit="true"
                                      maxlength="100"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="问卷说明:" label-width="100px" prop="preDesc">
                            <el-input placeholder="请输入问卷说明" v-model="formData.preDesc" :showWordLimit="true"
                                      maxlength="100"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="问卷后置文本:" label-width="100px" prop="postDesc">
                            <el-input placeholder="请输入问卷后置文本" v-model="formData.postDesc" :showWordLimit="true"
                                      maxlength="100"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <editable-table v-model="questions" min-height="360px" :grid-index="true" style="width: 865px"
                            :columns="[{code:'examTitle',label:'题目标题',width:500,align:'left'},{code:'required',label:'是否必填',width:120,editable:true,type:'checkbox'}]"
                            :buttons="[{code:'add',name:'新增题目',icon:'el-icon-plus',type:'dropdown',callback: addExam,items:[
                            {name:'新增',code:'add1'},
                             {name:'从题库选择',code:'add2'},
                            {name:'从题库拷贝',code:'add3'}]}]"
                            :operationsWidth="150"
                            :operations="[{code:'edit',name:'编辑',callback:editExam},{code:'delete',name:'删除',commond:'deleteRow'},{code:'moveup',name:'上移',commond:'moveup'},{code:'movedown',name:'下移',commond:'movedown'}]">

            </editable-table>
            <ice-dialog :visible.sync="editExamVisible" title="问卷题目编辑" width="1000px" remounted
                        :buttons="[{name:'确认',click:examConfirm},{name:'取消',iscannel:true}]">
                <question-editor ref="questionEditor">

                </question-editor>
            </ice-dialog>
            <ice-dialog :visible.sync="examSelectVisible" title="问卷题目选择" width="1000px" height="600px" remounted>
                <question-repository-list :single="examSelectSingle"
                                          @confirm="confirm"
                                          @cancel="examSelectVisible=false">

                </question-repository-list>
            </ice-dialog>
        </ice-dialog>
        <ice-dialog :visible.sync="viewVisible" title="调查问卷预览" width="900px" height="600px" remounted>
            <question-view :pager-id="viewPagerId" ref="questionView" answering>

            </question-view>
        </ice-dialog>
        <ice-dialog :visible.sync="publishVisible"
                    title="调查问卷发布记录查看"
                    :append-to-body="false"
                    width="1020px"
                    height="500px"
                    remounted>
            <question-published-history :pager-id="publishPagerId" @view="publishVisible=false">

            </question-published-history>
        </ice-dialog>
        <ice-dialog :visible.sync="publishDirect" width="900px" title="直接发布" remounted>
            <question-publish-direct ref="direct"></question-publish-direct>
            <div class="ice-button-bar">
                <el-button @click="submitForm" type="primary">确定发布</el-button>
                <el-button @click="publishDirect=false" type="info">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    import IceDialog from "../../components/common/base/IceDialog";
    import EditableTable from "../../components/common/form/panels/tablePanel/EditableTable";
    import QuestionEditor from "./widget/questionEditor";
    import QuestionView from "./widget/questionView";
    import QuestionPublish from "./questionPublish";
    import QuestionPublishedHistory from "./widget/questionPublishedHistory";
    import QuestionRepositoryList from "./widget/questionRepositoryList";
    import QuestionPublishDirect from "./questionPublishDirect";

    export default {
        name: "questionPager",
        components: {
            QuestionPublishDirect,
            QuestionRepositoryList,
            QuestionPublishedHistory,
            QuestionPublish, QuestionView, QuestionEditor, EditableTable, IceDialog, IceQueryGrid
        },
        data() {
            return {
                editVisible: false,
                publishDirect: false,
                query: [
                    {type: 'input', label: '调查问卷标题', code: 'title', value: '', exp: 'like'},
                    {type: 'input', label: '调查问卷描述', code: 'preDesc', value: '', exp: "like"},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '调查问卷标题', code: 'title', width: 440, align: 'left'},
                    /*  {label: '调查问卷描述', code: 'preDesc', width: 300},*/
                    {
                        label: '发布状态', code: 'status', width: 120, formatter: row => {
                            return row.status == '1' ? '已发布' : '未发布'
                        }
                    },
                    {label: '最后操作人', code: 'updateUser', width: 200},
                    {label: '最后操作时间', code: 'updateDate', width: 140, sortable: true}],
                operations: [
                    {
                        name: '修改', code: "BXZ1",ctrlCode:"BXG", callback: this.editPager, isShow: row => {
                            return true;
                        }
                    },
                    {
                        name: '删除', code: "BXZ2",ctrlCode:"BSC", callback: this.deletePager, isShow: row => {
                            return row.status != '1' && row.valid != '1'
                        }
                    },
                    /*                    {name: '送审', code: "BXZ3"},*/
                    {
                        name: '发布', code: "BXZ4",ctrlCode:"BFB", callback: this.publish, isShow: row => {
                            return row.valid != '1' && row.examnum > 0
                        }
                    },
                    {name: '预览', code: "BXZ5",ctrlCode:"BYL", callback: this.viewPager},
                    {name: '发布记录', code: "BXZ6",ctrlCode:"BFBJL", callback: this.publishedHistory},
                    {
                        name: '直接发布',ctrlCode:"BZJFB", callback: data => {
                            this.pagerId = data.oid
                            this.publishDirect = true;
                        }
                    },
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', code: "BXZ",ctrlCode:"BBC", callback: this.addPager},
                ],
                formData: {
                    oid: '',
                    title: '',
                    preDesc: '',
                    postDesc: '再次感谢您在百忙之中完成我们的调查问卷！',
                },
                rules: {
                    title: [{required: true, message: '请输入问卷标题'}]
                },
                questions: [],//题目列表
                editExamVisible: false,//编辑框
                viewVisible: false,//预览框
                viewPagerId: "",//预览页面ID
                publishVisible: false,//发布框
                quesId: '',
                publishPagerId: '',//发布页面ID
                pagerId: "",

                examSelectVisible: false,//考题选择弹框
                examSelectAction: '',
                examSelectSingle: false
            }
        },
        methods: {
            //直接发布 确认
            submitForm() {
                let data = this.$refs.direct.submit();
                // this.$axios.post("/pms/questionnaire/QuesPublishInfo/publish", data);
                if (data) {
                    data.pagerId = this.pagerId;
                    data.afStatus = "2";
                    this.$axios.post("/pms/questionnaire/QuesPublishInfo/publish", data).then(_ => {
                        this.$message.success("发布成功！");
                        this.publishDirect = false;
                    }).catch(error => {
                        this.$message.error(error);
                    })
                }
            },
            //添加问卷调查
            addPager() {
                this.formData = {
                    oid: '',
                    title: '',
                    preDesc: '',
                    postDesc: '再次感谢您在百忙之中完成我们的调查问卷！',
                }
                this.questions = []
                this.editVisible = true
            },

            //保存问卷
            async savePager() {
                await this.$refs.form.validate();
                const {data} = await this.$axios.post("/pms/questionnaire/QuesPagers/saveOrUpdate", {
                    $json: {
                        ...this.formData,
                        quesExamVos: this.questions.map((item, index) => {
                            return {
                                ...item,
                                sequence: index + 1,
                                pagerId: this.formData.oid,
                                required: item.required ? '1' : '0'
                            }
                        })
                    }
                })
                this.$message.success("保存成功")
                this.$refs.grid.refresh();
                return true;

            },
            //删除问卷
            async deletePager(pager) {

                try {
                    await this.$confirm('是否确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    const {data} = await this.$axios.delete("/pms/questionnaire/QuesPagers/del", {params: {id: pager.oid}})
                    this.$message.success("删除成功")
                    this.$refs.grid.refresh();
                } catch (e) {

                }


            },
            //编辑问卷
            async editPager(pager) {
                let {data: pagerInfo} = await this.$axios.get("/pms/questionnaire/QuesPagers/get", {params: {id: pager.oid}})
                this.formData = pagerInfo
                this.questions = pagerInfo.quesExamVos.map(item => {
                    item.required = item.required == '1' ? true : false
                    return item;
                });
                this.editVisible = true;
            },
            //新增题目
            addExam(action) {
                switch (action) {
                    case 'add1':
                        this.editExamVisible = true
                        if (this.$refs.questionEditor) {
                            this.$refs.questionEditor.setData()
                        }
                        break;
                    case 'add2':
                        this.examSelectAction = 'add2';
                        this.examSelectSingle = false;
                        this.examSelectVisible = true;
                        break;
                    case 'add3':
                        this.examSelectAction = 'add3';
                        this.examSelectSingle = true;
                        this.examSelectVisible = true;
                        break;
                }


            },
            //题目编辑确认
            async examConfirm() {
                let data;
                try {
                    data = await this.$refs.questionEditor.getData()
                } catch (e) {
                    return false;
                }
                if (data.oid) {//直接保存
                    try {
                        const result = await this.$axios.post("/pms/questionnaire/QuesExamRepository/saveOrUpdate", data)
                    } catch (e) {
                        this.$message.error(e.msg);
                        return false;
                    }

                } else {
                    if (data.$fromIndex !== undefined) {
                        this.questions[data.$fromIndex] = data;
                    } else {
                        this.questions.push(data);
                    }
                }


            },
            //编辑题目
            async editExam(data, index) {
                if (data.examId) {//已保存
                    let result = await this.$axios.get("/pms/questionnaire/QuesExamRepository/get", {params: {id: data.examId}})
                    data = result.data;
                }
                this.editExamVisible = true
                this.$nextTick(_ => {
                    this.$refs.questionEditor.setData({...data, $fromIndex: index})
                })
            },

            //预览
            viewPager(data, index) {
                this.viewVisible = true
                this.viewPagerId = data.oid;
                if (this.$refs.questionView) {
                    this.$refs.questionView.loadPager(this.viewPagerId);
                }
            },

            //发布
            publish(data, index) {
                this.$openFlow(`/questionnaire/publish?pagerId=${data.oid}`)
            },
            publishedHistory(data, index) {
                this.publishVisible = true;
                this.publishPagerId = data.oid;
            },

            //选择题目确认
            async confirm(selections) {
                switch (this.examSelectAction) {
                    case 'add2':
                        this.examSelectVisible = false;
                        const list = selections.map(item => {
                            // item.required = false;
                            item.sequence = 0;
                            item.examId = item.oid;
                            delete item.oid;
                            return item;
                        })
                        this.questions.push(...list);
                        break;
                    case 'add3'://拷贝题目，只删除oid
                        if (selections && selections.length > 0) {
                            const item = selections[0];
                            this.examSelectVisible = false;
                            if (item.oid) {
                                let {data} = await this.$axios.get("/pms/questionnaire/QuesExamRepository/get", {params: {id: item.oid}})
                                this.editExamVisible = true
                                delete data.oid;
                                data.options.forEach(item => {
                                    delete item.examId
                                    delete item.oid
                                })
                                this.$nextTick(_ => {
                                    this.$refs.questionEditor.setData({...data})
                                })
                            }


                        }
                        break;
                }
            }
        }
    }
</script>

<style scoped>

</style>
