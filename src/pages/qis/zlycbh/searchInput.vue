<template>
    <div>
        <!--<el-input v-model="selectText"-->
        <!--:placeholder="placeHolder"-->
        <!--@change="change"-->
        <!--:clearable = true>-->
        <!--<i class="el-icon-search el-input__icon" style="cursor: pointer" slot="suffix"-->
        <!--@click="search"></i>-->
        <!--</el-input>-->

        <div class="ice-quick-query" v-if="filterQuery.length>0&&queryModel=='quick'"
             :style="{width:quickQueryWidth?quickQueryWidth:'400px'}">
            <slot name="quick-query">
                <el-input :placeholder="quickQueryPlaceholder" v-model="quickQuery" :clearable="true"
                          maxlength="50"
                          disable-validate-state
                          @keyup.enter.native="search(true)" @input="inputSearch(true)">
                    <i class="el-icon-search el-input__icon" style="cursor: pointer" slot="suffix"
                       @click="search(true)"></i>
                    <el-button slot="append" @click="advanceQuery=!advanceQuery" v-if="hasAdvenceQuery" unauth>高级查询
                    </el-button>
                    <!---->
                </el-input>
            </slot>
        </div>
        <!--  <drawer :closable="false" width="400" v-model="advanceQuery" v-if="queryModel=='quick'">-->
        <ice-drawer :width="400" style="position: absolute" v-model="advanceQuery" v-if="queryModel=='quick'">
            <div style="display: flex;flex-direction: column;height: 100%">
                <div class="advance-query-title">
                    <div class="title">高级查询</div>
                    <i class="el-icon-close" style="cursor: pointer" @click="advanceQuery=false"></i>
                </div>
                <div style="flex-grow: 1;overflow-y: auto">
                    <ice-grid-layout :columns="1" @keyup.enter.native="search(false)" tabindex="1"
                                     class="advance-query-layout-area">
                        <ice-label :name="item.label"
                                   division=""
                                   v-for="(item,index) in filterQuery"
                                   :key="item.code+item.label">
                            <el-input v-model="item.value" v-if="item.type=='input'" placeholder="请输入"
                                      maxlength="20"
                                      clearable
                                      v-bind="item">
                            </el-input>
                            <el-input v-model="item.value"
                                      v-if="item.type=='num'"
                                      placeholder="请输入相关数值"
                                      @keyup.native="numReg(item)"
                                      v-bind="item">
                            </el-input>
                            <el-input v-model="item.value" v-if="item.type=='inputFunction'"
                                      :placeholder="item.placeholder?item.placeholder:'请输入'"
                                      maxlength="20"
                                      clearable
                                      class="inputFunctionClass"
                                      :title="item.value"
                                      v-bind="item">
                                <i slot="suffix" :title="item.title?item.title:''"
                                   :class="item.icon?item.icon:'el-input__icon el-icon-edit-outline'"
                                   @click="defineFunction(item)"></i>
                            </el-input>
                            <ice-select v-model="item.value"
                                        v-bind="item"
                                        clearable
                                        filterable
                                        :parent-value="item['parentProp']?filterQuery.find(q=>q.code==item['parentProp']).value:null"
                                        value-model="string"
                                        v-if="item.type=='select'">
                            </ice-select>
                            <ice-date-picker
                                    v-model="item.value"
                                    v-if="item.type=='date'"
                                    type="date"
                                    :clearable="false"
                                    v-bind="item"
                                    @change="changeDate(item.compare,filterQuery)"
                                    clearable
                                    placeholder="选择日期">
                                <!--    :picker-options="{disabledDate(time) {return item.timeFilter?!item.timeFilter(time):false}}"-->
                            </ice-date-picker>
                            <el-time-select
                                    v-model="item.value"
                                    v-if="item.type=='time'"
                                    :picker-options="item.list"
                                    :clearable="false"
                                    clearable
                                    placeholder="选择时间">
                            </el-time-select>
                        </ice-label>
                    </ice-grid-layout>
                </div>
                <div class="ice-center-button-bar">
                    <el-button type="primary" icon="el-icon-search" @click="search(false)" unauth>搜索</el-button>
                    <el-button plain icon="el-icon-refresh" @click="resetQuery" unauth>重置</el-button>
                </div>
            </div>
        </ice-drawer>
    </div>
</template>

<script>
    import IceDrawer from "../../../components/common/base/IceDrawer";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceLabel from "../../../components/common/base/IceLabel";

    export default {
        name: "searchInput",
        components: {
            IceDrawer,
            IceGridLayout,
            IceSelect,
            IceDatePicker,
            IceLabel
        },
        computed: {},
        created() {
            this.initPlaceHolder();
            this.search();
        },
        props: {
            quickQueryWidth: {
                default: "400px"
            },
            query: {
                type: Array,
                default: () => {
                    return []
                }
            },
            initQuickQueryValue: String,//快速搜索初始值
            queryType: "remote"
        },
        data() {
            return {
                selectText: '',
                placeHolder: '',
                advanceQuery: false,//是否有高级查询
                quickQuery: this.initQuickQueryValue ? this.initQuickQueryValue : '',
                queryModel: "quick",
            }
        },
        computed: {
            filterQuery() {
                return this.query.filter(item => item.type != 'static' && item.type != 'tab' && typeof item.value !== 'function');
            },
            hasAdvenceQuery() {
                if (this.quickQueryColumns.length <= 4 && this.filterQuery.length == this.quickQueryColumns.length) {
                    return false
                } else {
                    return true;
                }
            },
            quickQueryPlaceholder() {
                let placeholder = [];
                placeholder = this.quickQueryColumns.map(item => item.label);
                let pp = "关键字：" + placeholder.join("/")
                return pp;
            },
            quickQueryColumns() {
                return this.filterQuery.filter(item => item.type == 'input')
                    .filter((_, index) => index <= 3)
            },
        },
        methods: {
            search(isQuick) {
                // this.isPagination = this.advanceQuery;
                // if(this.isPagination){
                //     this.quickQuery = '';
                // }
                // this.pageNum = 1;
                // if (isQuick) {
                //     this.isQuickQuery = true;
                // } else {
                //     this.isQuickQuery = false;
                // }
                // this.advanceQuery = false;
                // this.refresh();
                let conditionLink = "OR";
                let querys = this.filterQuery;
                let conditions = [];
                querys.forEach(c => {
                    let exp = "="
                    if (c.type == "input") {
                        exp = c.exp ? c.exp : "like";
                    } else {
                        exp = c.exp ? c.exp : "=";
                    }
                    if (isQuick && c.type == "input") {
                        let obj = {
                            column: c.code,
                            exp: exp,
                            value: this.quickQuery ? this.quickQuery : ""

                        }
                        conditions.push(obj);
                    } else {
                        if (c.value) {
                            let obj = {
                                column: c.code,
                                exp: exp,
                                value: c.value

                            }
                            conditions.push(obj);
                        }

                    }

                })

                if (isQuick) {
                    conditionLink = "OR";
                } else {
                    conditionLink = "AND";
                }
                let obj = {
                    conditionLink,
                    staticConditions: this.staticQuerys,
                    conditions
                }
                this.$emit('search', obj);
                this.advanceQuery = false;

            },
            inputSearch(isQuick) {
                if (this.queryType === 'local') {
                    this.search(isQuick);
                }
            },
            // 重置
            resetQuery() {
                this.filterQuery.forEach(item => {
                    item.value = null;
                });
                this.search();//重置后刷新
            },

            // search(){
            //     this.$emit('search', this.selectText);
            // },
            change() {
                this.search();
            },
            changeDate(compare, list) {
                let index = list.findIndex(item => item.compare == compare);
                list.forEach(item => {
                    //判断当前是否存在比较的属性compare，根据比较值的大小来判定谁的时间应该比谁大，并且要比较的值不为空，compareKey属性来判断他们是否为一组
                    //注意：同为一组的compare属性值不可相等，如果相等，则他们的时间先后判定将无效
                    if (item.compare && Number(item.compare) > Number(compare) && list[index].value > item.value && list[index].value != '' && item.compareKey == list[index].compareKey) {
                        item.value = '';
                    } else if (item.compare && Number(item.compare) < Number(compare) && list[index].value < item.value && list[index].value != '' && item.compareKey == list[index].compareKey) {
                        item.value = '';
                    }
                })
            },
            initPlaceHolder() {
                var text = '关键字：';
                if (this.query.length != 0) {
                    this.query.map(item => {
                        if (item === this.query[this.query.length - 1]) {
                            text = text + item.label;
                            return;
                        }
                        text = text + item.label + '/';
                    });
                }
                this.placeHolder = text === '关键字：' ? '' : text;
            },
        },
        watch: {
            query() {
                this.initPlaceHolder();
            }
        },
    }
</script>

<style lang="less" scoped>
    .advance-query-title {
        margin: 0px 10px;
        display: flex;
        padding-bottom: 10px;
        justify-content: space-between;
        border-bottom: 1px solid #dee1eb;
        margin-bottom: 20px;
        flex: 0 0 auto;

    .title {
        color: rgb(83, 168, 255);
    }

    }
</style>