<template>
    <div class="abb">
        <div class="ice-container">
            <div class="_top">
                <div style="width: 130px;white-space:nowrap;" class="handleItemR">
                    <el-select @change="change" v-model="yearSelect">
                        <!--<el-option value="" label="年份统查"></el-option>-->
                        <el-option :value="sy" :label="sy+'年'" v-for="sy in setYear"></el-option>
                    </el-select>
                </div>
                <div class="handleItemL">
                    <div style="display: flex;justify-content:space-around; width: 200px">
                        <el-button icon="el-icon-circle-plus" type="text" style="color: #98FB98" @click="addItem">
                            <span style="color: #222222">新增</span>
                        </el-button>
                        <el-button icon="el-icon-edit" type="text" style="color: #4027FF" @click="editOrChang" v-show="visibleEdit">
                            <span style="color: #222222">编辑</span>
                        </el-button>
                        <el-button icon="el-icon-edit" type="text" style="color: #4027FF" @click="editOrChang" v-show="visibleChange">
                            <span style="color: #222222">变更</span>
                        </el-button>
                        <el-button icon="el-icon-refresh-left" type="text" style="color: #4027FF" @click="refresh">
                            <span style="color: #222222">刷新</span>
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="grid" >
                <div class="grinmain" >
                    <ice-query-grid data-url="/pms/Jhgl/list"
                                    queryModel="quick"
                                    :pagination="false"
                                    @getData="getDataList"
                                    :query="query"
                                    :parHeight="parHeight"
                                    :gridIndex="false"
                                    chooseItem="single"
                                    @selection-change="select"
                                    :operations-width="200"
                                    :columns="columns"
                                    ref="grid">
                    </ice-query-grid>
                </div>

            </div>
        </div>


    </div>
</template>
<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import {isLetterAndNumber} from "@/pages/biz/js/Validator";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import moment from 'moment'
    import {defineJhStatusColor, SPZT, JHZT, SBZT} from "../../../utils/constant";

    // 定义计划状态颜色
    let defineXmStatusColor = defineJhStatusColor;

    export default {
        name: "JHGL",
        data() {
            return {
                mapTypeCode: 'JHZT',
                item: [],
                editText: '编辑',
                setYear: {},
                yearSelect: moment(new Date()).format('YYYY'),
                visible: false,
                visibleEdit: false,
                visibleChange: false,
                title: '',
                jhyearSelect: '',
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'deptName', hidden: true},
                    {code: 'jhfzr', hidden: true},
                    {code: 'jhjd', hidden: true},
                    {code: 'jhlx', hidden: true},
                    {code: 'jhmb', hidden: true},
                    {code: 'sbzt', hidden: true},
                    {code: 'spzt', hidden: true},
                    {code: 'jjcd', hidden: true},
                    {code: 'businessDataId', hidden: true},
                    {code: 'dataSecretLevcode', hidden: true},
                    {label: '计划编码', code: 'jhcode', width: 110},
                    {label: '计划名称', code: 'jhname', width: 120},
                    {label: '计划状态', code: 'jhzt', width: 100, mapTypeCode: 'JHZT', renderCell: (h, data)=> {
                            let obj = {
                                color: '#fff',
                                background: defineXmStatusColor[data.row.jhzt],
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '2px'
                            }
                            return <span style={obj}>{this.datamap?this.datamap[data.row.jhzt]:''}</span>
                        }
                    },
                    {code: 'jhyear', hidden: true}
                ],
                query: [
                    {
                        type: 'static', code: 'jhyear', exp: '=', value: () => {
                            return this.jhyearSelect
                        }
                    },
                ],
            }
        },
        methods: {
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            change(data) {
                this.jhyearSelect = data
                this.$refs.grid.refresh();
            },
            getDataList(data) {
                //     let yearList = []
                //     data.map(o=>{
                //         yearList.push(o.jhyear)
                //         this.setYear = [...new Set(yearList)].sort().reverse();
                //     })
            },
            selectDept(depts) {
                this.formModel.deptCode = depts[0].deptCode
                this.formModel.deptId = depts[0].oid
            },
            addItem() {
                this.$router.push({name: "/pms/jhgl/jhgl_add_flow"})
            },
            editOrChang() {
                console.log(this.item[0])
                if (this.item.length <= 0) {
                    this.$message.error("请点击你要" + this.editText + "的计划")
                    return
                } else {
                    if(this.item[0].jhzt == JHZT.WKS && this.item[0].sbzt == SBZT.WSB){
                        //申请
                        this.$router.push("/pms/jhgl/jhgl_add_flow?oid="+this.item[0].oid)

                    }else if(this.item[0].jhzt == JHZT.JXZ && this.item[0].spzt == SPZT.YSP){
                        //变更
                        this.$router.push("/pms/jhgl/jhgl_add_flow?oid=" + this.item[0].oid)

                    }else{
                        this.$message.error("流程进行中无法操作")
                    }
                }
            },
            async openApp(appcode, indexUrl) {

                // this.setActiveApp(appcode);
                const menus = await this.setActiveApp(appcode);

                if (menus) {

                    const loadFirstMenu = (menusList) => {
                        if (menusList && menusList.length > 0) {
                            const firstMenu = menusList[0];
                            if (firstMenu.children && firstMenu.children.length > 0) {
                                return loadFirstMenu(firstMenu.children)
                            } else {
                                return firstMenu
                            }
                        }
                    }

                    const firstMenu = loadFirstMenu(menus);

                    if (firstMenu) {
                        this.openPageById({
                            id: firstMenu.pageId, next: pageInfo => {
                                this.collapseChage(false);
                                this.$router.push(pageInfo.$url);
                            }
                        });

                    }

                }

            },
            select(item) {
                console.log(item, 'item')
                this.$emit("select", item)
                this.item = item
                if (item[0].jhzt == "JHZT20" && (item[0].spzt == "SPZT10" || item[0].spzt == null) ) {
                    this.visibleEdit = true;
                    this.visibleChange = false;
                } else if (item[0].jhzt == "JHZT30" && item[0].spzt == "SPZT30") {
                    this.visibleEdit = false;
                    this.visibleChange = true;
                } else if(item[0].spzt == 'SPZT20') {
                    this.visibleEdit = false;
                    this.visibleChange = false;
                }
                if(this.jhStatus){
                    console.log(this.jhStatus)
                }
            },
            refresh() {
                this.$refs.grid.refresh();
            },
        },
        created() {
            this.$axios.get("/pms/Jhgl/listAll")
                .then(result => {
                    let yearList = []
                    result.data.map(o => {
                        yearList.push(o.jhyear)
                        this.setYear = [...new Set(yearList)].sort().reverse();
                    })
                })
                .catch(error => {
                    this.$message.error("初始化失败")
                })
                .finally(_ => {
                })

            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }

        },
        props:['jhStatus', 'parHeight'],
        computed:{
            datamap() {
                return this.getDataMap()(this.mapTypeCode);
            }
        },
        components: {
            IcePersionSelector,
            IceDeptSelector,
            IceSelect,
            IceDialog,
            IceQueryGrid
        }
    }

</script>


<style lang="less" scoped>
    ._top {
        margin: 5px 0;
        &::after {
            content: '';
            display: block;
            clear: both;
        }
        .handleItemR {
            float: right;
        }
        .handleItemL {
            float: left
        }
    }
    .abb {
        position: absolute;
        top: 0;
        bottom: 330px;
        left: 0;
        right: 0;
        .grid {
            -ms-flex-positive: 1;
            flex-grow: 1;
            -ms-flex-negative: 1;
            flex-shrink: 1;
            position: relative;
            .grinmain {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
        }
    }
</style>
