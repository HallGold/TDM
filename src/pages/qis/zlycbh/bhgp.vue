<template>
    <div class="ice-container">
        <el-select v-model="oidCp" placeholder="请选择" style="width: 350px" @change="selectChange">
            <el-option
                    v-for="item in options"
                    :key="item.oidCp"
                    :label="item.cpName"
                    :value="item.oidCp">
            </el-option>
        </el-select>
        <ice-query-grid
                :chooseItem="chooseItem"
                data-url="/pms/QisCpBhg/list"
                :operations-width="200"
                :columns="columns"
                codeProp="oid"
                :selectedCodes="sectCp.map(c=>c.oid)"
                :query="query"
                :isSelectable='isSelect'
                :selectableLabel="selectableLabel"
                :selectableCodeTrue="selectableCodeTrue"
                @selection-change="select"
                ref="grid1">
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
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';

    export default {
        name: "bhgp",
        components: {
            IceDialog,
            IceQueryGrid,
            IceSelect,
            moment,
        },
        created() {
            // console.log(this.column)
            // console.log('长度：', this.sectCp.length)
            console.log(this.sectCp, 'this.sectCp')
            this.cpList();
            if (this.sectCp.length > 0) {
                this.nonEditableItem();
                this.oidCp = this.sectCp[0].oidCp;
                this.editOidCp = this.sectCp[0].oidCp;
            } else {
              this.selectableCodeTrue = [];
                this.oidCp = '';
            }
            this.refreshGrid();
            // console.log('初始。。。')
        },
        data() {
            return {
                isSelect: true,
                selectableLabel: 'oid',
                selectableCodeTrue: [],
                dataOption: [],
                oidCp: '',
                options: [],
                items: [],
                editOidCp: '',
                staticCondition: {type: 'static', code: 'oidCp', value: '0'},
                condition:[
                    {oid:'OID_BHG', condition: {type: 'static', code: 'oidBhg', exp: 'is', value: 'null'}},
                    {oid:'OID_YC',  condition: {type: 'static', code: 'oidYc',  exp: 'is', value: 'null'}},
                    {oid:'OID_WT',  condition: {type: 'static', code: 'oidWt',  exp: 'is', value: 'null'}},
                    {oid:'OID_SG',  condition: {type: 'static', code: 'oidSg',  exp: 'is', value: 'null'}},
                ],
                query: [
                    {type: 'static', code: 'oidCp', value: '0'},
                    // {type: 'static', code: 'oidBhg', exp: 'is', value: 'null'}
                    // {type: 'input', code: 'cpCode', label: '产品编号'},
                    // {type: 'input', code: 'cpName', label: '产品名称'},
                    // {type: 'input', code: 'cpScCode', label: '产品生产流水号'},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: "所属计划", code: "scjhName", width: 200},
                    {label: "生产计划ID", code: "oidScjh", width: 200, hidden: true},
                    {label: "计划编号", code: "scjhCode", width: 200, hidden: true},
                    {label: "所属组次", code: "jhzc", width: 200},
                    {label: "所属组次ID", code: "oidzc", hidden: true},
                    {label: "生产序号", code: "cpScCode", width: 200},//产品生产流水号
                    {label: "产品ID", code: "oidCp", hidden: true},
                    {label: "产品编号", code: "cpCode", hidden: true},
                    {label: "产品名称", code: "cpName", hidden: true},
                    {label: "工序ID", code: "oidGx", hidden: true},
                    {label: "工序编号", code: "gxCode", width: 200},
                    {label: "工序名称", code: "gxName", hidden: true},
                    {
                        label: "生产日期", code: "scDate", width: 200, formatter(row) {
                            return row.scDate?moment(row.scDate).format('YYYY-MM-DD'):'';
                        }
                    },
                    {label: "发现地点", code: "fxdd", width: 200},
                    {label: "发现人", code: "fxPerson", width: 200},
                    {
                        label: "发现时间", code: "fxDate", width: 200, formatter(row) {
                            return moment(row.fxDate).format('YYYY-MM-DD');
                        }
                    },
                    {label: "与不合格处理单关联ID", code: "oidBhg", hidden: true},
                    {label: "与质量异常关联ID", code: "oidYc", hidden: true},
                    {label: "与质量问题关联ID", code: "oidWt", hidden: true},
                    {label: "与质量事故关联ID", code: "oidSg", hidden: true},
                ],
                sectCpData: this.sectCp
            }
        },
        props: {
            chooseItem: {
                default: 'multiple',
            },
            sectCp: {
                default: function () {
                    return []
                }
            },
            column :{
                default: '',
            },
        },
        methods: {
            refresh() {
                this.$refs.grid1.gridDataList = [];
            },
            select(items) {
                this.items = items;
            },
            confirm() {
                this.$emit("select", this.items);
            },
            back() {
                this.$emit('closeVisible');
            },
            cpList() {
                if (this.sectCp.length > 0) {
                    //存在已选项，产品类型唯一，不请求接口
                    // console.log('唯一产品')
                    var option = [];
                    option.push(this.sectCp[0]);
                    this.options = option;
                }else{
                    //不存在已选项，直接请求接口
                    // console.log('请求接口')
                    this.$axios.get("/pms/QisCpBhg/cplist", {params:{column: this.column}})
                        .then(result => {
                            this.options = result.data;
                        }).catch(error => {
                            this.$Message.error("获取产品分类数据失败！")
                        })
                }

                // this.$axios.get("/pms/QisCpBhg/cplist", {params:{column: column}})
                //     .then(result => {
                //         this.options = result.data;
                //         if (this.sectCp.length > 0) {
                //             let item = this.options.filter((c) => {
                //                 return c.oidCp === this.sectCp[0].oidCp;
                //             })
                //             if (item.length <= 0) {
                //                 this.options = [...this.options, ...this.sectCp]
                //             }
                //         }
                //     }).catch(error => {
                //         this.$Message.error("获取产品分类数据失败！")
                //     })
            },
            refreshGrid() {
                var newCondition = [];
                newCondition.push(this.staticCondition);
                // if (!this.editOidCp) {
                    //查全部
                    // console.log('查全部');
                // } else {
                    //查未选择的
                    // console.log('查未选择的');
                    var condition = this.getFilterCondition();
                    // console.log(condition)
                    if (condition != undefined) {
                        newCondition.push(condition.condition);
                    }
                // }
                this.query = newCondition;
                this.query[0].value = this.oidCp ? this.oidCp : '0';
                // console.log(this.query);
                this.$nextTick(() => {
                    this.$refs.grid1.refresh();
                })
            },
            selectChange() {
                if (this.sectCp.length > 0) {
                    if (this.sectCp[0].oidCp == this.oidCp) {
                        this.sectCpData = this.sectCp;
                    } else {
                        this.sectCpData = [];
                    }
                } else {
                    this.sectCpData = [];
                }
                this.refreshGrid();
            },
            getFilterCondition(){
                return this.condition.find(item => item.oid === this.column);
            },
            nonEditableItem(){
                let arr = [];
                this.sectCp.forEach((c)=>{
                    arr.push(c.oid)
                })
                this.selectableCodeTrue = arr;
            },
        },
        watch: {
            sectCp() {
                this.cpList();
                if (this.sectCp.length > 0) {//编辑
                    // console.log('编辑');
                    this.nonEditableItem();
                    this.sectCpData = this.sectCp;
                    this.editOidCp = this.sectCp[0].oidCp;
                    this.oidCp = this.sectCp[this.sectCp.length - 1].oidCp;
                    this.refreshGrid();
                } else {//新增
                  this.selectableCodeTrue = [];
                    // console.log('新增');
                    this.oidCp = '';
                    this.editOidCp = '';
                    this.sectCpData = [];
                    this.refresh();
                }
            }
        }

    }
</script>

<style scoped>

</style>