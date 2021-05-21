<template>
    <div class="ice-container">
        <el-container>
            <el-header>
                <el-page-header @back="goBack" content="计划编制" style="margin: 5px 0px;"></el-page-header>
                <el-steps :active="active" finish-status="success" simple>
                    <el-step title="计划信息"></el-step>
                    <el-step title="选择产品"></el-step>
                    <el-step title="工艺工序"></el-step>
                </el-steps>
            </el-header>
            <el-main>
                <div v-show="active===0">
                    <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading" style="margin-top: 20px;">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="选择项目" label-width="110px" prop="oidXm">
                                    <el-input placeholder="请选择项目" v-model="formModel.xmname" readonly>
                                        <el-button slot="append" icon="el-icon-search"
                                                   @click="showProjectDialog"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计划名称" label-width="110px" prop="scJhname">
                                    <el-input v-model="formModel.scJhname"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计划编码" label-width="110px" prop="scJhcode">
                                    <el-input v-model="formModel.scJhcode" readonly="readonly" placeholder="自动生成编码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="计划类型" label-width="110px" prop="scJhlx">
                                    <ice-select v-model="formModel.scJhlx" map-type-code="JHLX"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="紧急程度" label-width="110px" prop="jjcd">
                                    <ice-select v-model="formModel.jjcd" map-type-code="JJCD"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="外部计划文号" label-width="110px" prop="scJhwhWb">
                                    <el-input v-model="formModel.scJhwhWb"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                                        <ice-select v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16">
                                    <div style="display: flex; flex-direction: row">
                                        <ice-single-upload :on-success="fileUploadSuccess"
                                                           ref="fileUpload"></ice-single-upload>
                                        <el-input v-model="formModel.filename" style="margin-left: 10px;"
                                                  disabled></el-input>
                                    </div>
                                </el-col>
                            </el-row>
                    </el-form>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="计划分组" name="first">
                            <el-button type="primary" @click="addPlanBatch(-1)">添加分组</el-button>
                            <vxe-table border show-overflow
                                       ref="planBatchTable"
                                       max-height="200"
                                       auto-resize
                                       size="small"
                                       :edit-rules="validRules"
                                       :edit-config="{trigger: 'click', mode: 'cell'}"
                                       :data="planBatchTableData">
                                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                                <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                <vxe-table-column field="jhpc" title="组次"
                                                  :edit-render="{name: 'input'}"></vxe-table-column>
                                <vxe-table-column field="jhsl" title="数量"
                                                  :edit-render="{name: 'input', attrs: {type: 'number'}}">

                                </vxe-table-column>
                                <vxe-table-column field="jhdateQt" title="齐套时间"
                                >
                                    <template v-slot="{ row, rowIndex }">
                                        <el-date-picker
                                                v-model="row.jhdateQt"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="jhdateJf" title="交付时间"
                                >
                                    <template v-slot="{ row, rowIndex }">
                                        <el-date-picker
                                                v-model="row.jhdateJf"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column title="操作">
                                    <template v-slot="{ row }">
                                        <el-link type="primary" :underline="false"
                                                 @click="$refs.planBatchTable.remove(row)">删除
                                        </el-link>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div v-if="active>0">
                    <table width="100%" style="margin: 15px 0px 5px 0px;">
                        <tr>
                            <td>项目信息：{{formModel.xmname}}（{{formModel.xmcode}}）</td>
                            <td>计划信息：{{formModel.scJhname}}（{{formModel.scJhlx}}）</td>
                        </tr>
                    </table>
                    <el-tabs v-model="product_activeName" @tab-click="groupTabClick">
                        <template v-for="(batch, index) in planBatchTableData">
                            <el-tab-pane :label="batch.jhpc" :name="batch.jhpc+index"></el-tab-pane>
                        </template>
                    </el-tabs>
                </div>
                <div v-show="active===1">
                    <el-container>
                        <el-aside>
                            <CP_LIST @select="productSelect" :sectitem="productData" ref="cplist"></CP_LIST>
                        </el-aside>
                        <el-main style="padding: 0 0 0 20px">
                            <CP_EDIT :tableData="productData" :sectGroupData="sectGroupData" ref="cpEdit" @removeRow="removeRow"></CP_EDIT>
                        </el-main>
                    </el-container>
                </div>
                <div v-show="active===2">
                    <el-container>
                        <el-aside>
                            <CP_LIST_SHOW :product-data="productData" @select="selectProduct"></CP_LIST_SHOW>
                        </el-aside>
                        <el-main style="padding: 0 0 0 20px">
                            <div class="msg">
                                <div class="item">
                                    <label for="">
                                        {{currentProduct.cpName}}（{{currentProduct.cpCode}}）
                                    </label>
                                    <span></span>
                                </div>
                                <div class="item">
                                    <label for="">
                                        开始时间：
                                    </label>
                                    <span>{{startTime}}</span>
                                </div>
                                <div class="item">
                                    <label for="">
                                        结束时间：
                                    </label>
                                    <span>{{endTime}}</span>
                                </div>
                                <div class="item">
                                    <label for="">
                                        交付：
                                    </label>
                                    <span>{{currentProduct.cpjfsl?currentProduct.cpjfsl:'-'}}</span>
                                </div>
                                <div class="item">
                                    <label for="">
                                        备件：
                                    </label>
                                    <span>{{currentProduct.cpbjsl?currentProduct.cpbjsl:'-'}}</span>
                                </div>
                            </div>
                            <el-select v-model="gylxValue" placeholder="请选择工艺路线" @change="selectGylx">
                                <el-option
                                        v-for="item in gylxListData"
                                        :key="item.cpgyCode"
                                        :label="item.cpgyName"
                                        :value="item.cpgyCode">
                                </el-option>
                            </el-select>
                            <CP_GX :src-data="currentProduct.gylx?currentProduct.gylx.gxes:[]" ref="cpGxEdit"></CP_GX>
                        </el-main>
                    </el-container>
                </div>
            </el-main>
            <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
                <XM_SELECT @select="selectProject" @closeVisible="closeProject" choose-item="single"></XM_SELECT>
            </ice-dialog>

            <el-footer>
                <el-button style="margin-top: 12px;" @click="prev" :disabled="active==0">上一步</el-button>
                <el-button style="margin-top: 12px;" @click="next" :disabled="active==2">下一步</el-button>
                <el-button @click="save">保存</el-button>
                <el-button @click="save2">保存2</el-button>
                <el-button @click="look">查看数据</el-button>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XM_SELECT from "../common/XM_SELECT";
    import CP_LIST from "../common/CP_LIST";
    import CP_EDIT from "../common/CP_EDIT";
    import CP_LIST_SHOW from "../common/CP_LIST_SHOW";
    import CP_GX from "../common/CP_GX";
    import moment from 'moment'

    export default {
        name: "SCJHBZ",
        components: {
            CP_GX,
            CP_LIST_SHOW, CP_EDIT, CP_LIST, XM_SELECT, IceSingleUpload, IceSelect, IceDialog, IceDatePicker
        },
        data() {
            return {
                loading: false,
                active: 0,
                visibleProject: false,
                activeName: 'first',
                product_activeName: '',

                currentProduct: {},
                gylxValue: '',

                formModel: {
                    oid: '',
                    oidXm: '',
                    xmcode: '',
                    xmname: '',
                    scJhname: '',
                    scJhcode: '',
                    scJhlx: '',
                    dataSecretLevcode: '2',
                    jjcd: '',
                    scJhwhWb: '',
                    oidFj: '',
                    filename: '',

                    pscs: [],
                },
                planBatchTableData: [],
                rules: {
                    oidXm: [
                        {required: true, whitespace: true, message: '请选择项目', trigger: 'blur'}
                    ],
                    scJhname: [
                        {required: true, whitespace: true, message: '请输入计划名称', trigger: 'blur'}
                    ],
                    scJhlx: [
                        {required: true, whitespace: true, message: '请选择计划类型', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                },

                validRules: {
                    jhpc: [
                        {required: true, message: '请输入组次'},
                    ],
                    jhsl: [
                        {required: true, message: '请输入数量'}
                    ]
                },

                gylxListData: [
                    {
                        'label': '工艺路线01',
                        'value': '1'
                    },
                    {
                        'label': '工艺路线02',
                        'value': '2'
                    },
                ],

                productListData: [
                    {
                        'jhdateStart': '2019-10-10',
                        'jhdateEnd': '2019-11-12',
                        'cpjfsl': '20',
                        'cpbjsl': '50',
                        'cpName': '产品一',
                        'cpCode': 'CP1',
                        'oid': '11',
                        childrens: [
                            {
                                'jhdateStart': '2019-10-10',
                                'jhdateEnd': '2019-11-12',
                                'cpjfsl': '50',
                                'cpbjsl': '100',
                                'cpName': '部件一',
                                'cpCode': 'CP1',
                                'oid': '100',
                            }
                        ]
                    },
                    {
                        'jhdateStart': '2019-10-12',
                        'jhdateEnd': '2019-11-22',
                        'cpjfsl': '22',
                        'cpbjsl': '80',
                        'cpName': '产品十',
                        'cpCode': 'CP10',
                        'oid': '22',
                        childrens: []
                    }
                ],
                productGxData: [],
                productData: [],
                tabActiveIndex: 0,

                // 保存后返回的数据
                saveLastData: null,
                // 删除的产品数据
                removeCpData: {},
                // 选中的分组
                sectGroupData: {}
            }
        },
        computed: {
            startTime() {
                if (this.currentProduct.jhdateStart) {
                    return moment(this.currentProduct.jhdateStart).format('YYYY-MM-DD');
                } else {
                    return '';
                }

            },
            endTime() {
                if (this.currentProduct.jhdateEnd) {
                    return moment(this.currentProduct.jhdateEnd).format('YYYY-MM-DD');
                } else {
                    return '';
                }
            },
            oidScjh() {
                return this.$route.query.oid ? this.$route.query.oid : ''
            },
            NewplanBatchTableData () {
              return this.planBatchTableData.filter((o)=>{
                return o.version!=-1;
              })
            }
        },
        created() {
            if (localStorage.listdata) {
              let result = JSON.parse(localStorage.listdata);
              this.formModel = result;
              this.saveLastData = result;
              localStorage.listdata = JSON.stringify(this.formModel);
              this.formModel.pscs.map(o => {
                // o.jhdateQt = o.jhdateQt ? o.jhdateQt.substring(0, 10) : o.jhdateQt;
                // o.jhdateJf = o.jhdateJf ? o.jhdateJf.substring(0, 10) : o.jhdateJf;

              });
              this.planBatchTableData = this.formModel.pscs;

              let psccps = this.planBatchTableData[0].psccps;
              this.productData = psccps ? psccps : [];

              this.active = this.active++;
              this.product_activeName = '0';
              return;
            }
            if (this.oidScjh) {
                this.getDetail();
            }
        },
        methods: {
            // tab标签被选中是触发
            groupTabClick(data) {
                let index = data.index;
                this.tabActiveIndex = index;
                // this.product_activeName = index;
              if (!this.planBatchTableData[index].psccps) {
                this.planBatchTableData[index].psccps = [];
              }
                let psccps = this.planBatchTableData[index].psccps;
                this.sectGroupData = this.planBatchTableData[index];
                this.productData = psccps ? psccps : [];
                // 清空行选中
                this.$refs.cplist.clearCheckboxRow();
            },
            goBack() {
                this.$router.go(-1)
            },
            next() {
              // this.savePlanInfo(1);
              if (this.active==0) {
                let showData = this.$refs.planBatchTable.getTableData().visibleData;
                // 删除的分组
                // let delGroup = this.clearupGroupRemoveData();
                // let groups = showData.concat(delGroup);

                if (showData.length <= 0) {
                  this.$message.error('你还未选择分组，不能进入下一步！');
                  return;
                }
                this.formModel.pscs = showData;
                this.planBatchTableData = this.formModel.pscs;
                this.product_activeName = this.planBatchTableData.length > 0 ? this.planBatchTableData[0].jhpc+'0' : '';
                let psccps = this.planBatchTableData[0].psccps;
                this.productData = psccps ? psccps : [];
                this.sectGroupData = this.planBatchTableData[0];
              }



              this.active++;
              this.handleResetTable();

            },
            prev() {
                this.active--;
                this.handleResetTable();
            },

            showProjectDialog() {
                this.visibleProject = true;
            },
            selectProject(item) {
                this.formModel.oidXm = item[0].oid;
                this.formModel.xmcode = item[0].xmcode;
                this.formModel.xmname = item[0].xmname;
                this.visibleProject = false;
            },
            closeProject() {
                this.visibleProject = false;
            },

            fileUploadSuccess(response, file) {
                let fileId = response.data;
                //this.$downloadFile(fileId);
                this.$refs.fileUpload.reset();
                this.formModel.oidFj = fileId;
                this.formModel.filename = file.name;
            },

            save() {
                this.savePlanInfo();
                return
                if (this.active == 0) {
                    // 保存计划信息
                    this.savePlanInfo(0);
                } else if (this.active == 1) {
                    // 保存产品信息
                    // this.saveProductInfo(0);
                }
            },

            save2() {
                let data = this.$refs.cpGxEdit.getAllData();
            },
            // 获取详情数据
            getDetail() {
                this.$axios.get("/pms/PmsScJh/detail", {params: {id: this.oidScjh}})
                    .then(result => {
                        this.assignment(result);
                    })
                    .catch(error => {
                        this.$message.error("查询生产计划详情失败")
                    })
                    .finally(_ => {

                    })
            },
            // 获取详情数据后赋值
            assignment(result) {
                this.formModel = result.data;
                this.saveLastData = result.data;
                localStorage.listdata = JSON.stringify(this.formModel);
                this.planBatchTableData = this.formModel.pscs;
                this.product_activeName = this.planBatchTableData.length > 0 ? this.planBatchTableData[0].oid : '';
                let psccps = this.planBatchTableData[0].psccps;
                this.productData = psccps ? psccps : [];
                // 清空行选中
                this.$refs.cplist.clearCheckboxRow(this.productData);
            },
            /**
             * 保存计划信息
             * @param next 0、保存，1、下一步
             */
            savePlanInfo(next) {
              let showData = this.$refs.planBatchTable.getTableData().visibleData;
              // 删除的分组
              let delGroup = this.clearupGroupRemoveData();
              let groups = showData.concat(delGroup);
              this.formModel.pscs = groups;
                this.formModel.pscs.map(o => {
                    o.psccps = o.psccps ? o.psccps : [];
                    if (o.psccps) {
                        o.psccps.map((p) => {
                            p.gylx = p.gylx ? p.gylx : {}
                        })
                    }
                });
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$refs.planBatchTable.validate(valid => {
                            if (valid) {
                                this.loading = true
                                this.$axios.post("/pms/PmsScJh/saveScjh", this.formModel)
                                    .then(result => {
                                        this.$message.success('保存成功');
                                        this.formModel = result.data;
                                        this.saveLastData = result.data;

                                        localStorage.listdata = JSON.stringify(this.formModel);
                                        this.formModel.pscs.map(o => {

                                        });
                                        this.planBatchTableData = this.formModel.pscs;
                                    })
                                    .catch(error => {
                                        this.$message.error("保存失败")
                                    })
                                    .finally(_ => {
                                        this.loading = false;
                                    })
                            }
                        })
                    }
                })
            },
            // 整理数据，找到删除的分组
            clearupGroupRemoveData() {
                if (!this.saveLastData) {

                    return [];
                }
                let showData = this.$refs.planBatchTable.getTableData().visibleData;
                let gather = {
                    ids: [],
                };
                showData.forEach((c) => {
                  if (c.oid) {
                    gather.ids.push(c.oid);
                  }
                });

                let delData = this.saveLastData.pscs.filter((c) => {
                    if (c.oid) {
                        return gather.ids.indexOf(c.oid) < 0;
                    }
                })
                delData.map((c) => {
                    c.version = -1;
                });

                return delData;
            },
            // 整理选择产品数据
            clearupCpData() {

            },
            // 移除行
            removeRow(row) {
                this.getDataByeva();
                // if (row.oid) {
                //   this.removeCpData[this.product_activeName] = [...[], row]
                // }
                this.$refs.cplist.cancelCheckbox(row);
            },

            addPlanBatch(row) {
                let record = {};
                this.$refs.planBatchTable.insertAt(record, row)
                    .then(({row}) => this.$refs.planBatchTable.setActiveCell(row))
            },

            productSelect(item) {
                item.oidCpk = item.oid;
                item.oid = null;
                this.$refs.cpEdit.loadTableData(item);
                this.getDataByeva();
                // psccp.map(p => {
                //   p.oidPjh = this.product_activeName
                // });
                // this.productData = items;
                // this.planBatchTableData.map(o => {
                //   if (o.oid == this.product_activeName) {
                //     o.psccp = items;
                //   }
                // });
            },
            // 获取表格数据并且赋值
            getDataByeva() {
                let psccps = this.$refs.cpEdit.getCpData();
                console.log(psccps, 'psccps615615')
                let ids = [];
                psccps.forEach((c) => {
                    if (c.oid) {
                        ids.push(c.oid);
                    }
                })
                this.planBatchTableData.map((o, index) => {
                    if ((o.jhpc+index) == this.product_activeName) {
                      if (o.psccps) {
                        let removeItems = o.psccps.filter((c) => {
                          if (c.oid) {
                            return ids.indexOf(c.oid) < 0;
                          } else {
                            return false;
                          }
                        })
                        removeItems.map((p) => {
                          p.version = -1;
                        })
                        let arr = psccps.concat(removeItems);
                        o.psccps = arr;
                        this.productData = arr;
                      } else {
                        o.psccps = psccps;
                      }

                    }
                });
            },
            selectProduct(val) {
                this.currentProduct = val;
                this.gylxValue = '';
                if (val.oid == "794451e2896d1323eea94328ed751327") {
                    this.gylxListData = [
                        {
                            'cpgyName': '工艺路线01',
                            'cpgyCode': '1'
                        },
                        {
                            'cpgyName': '工艺路线02',
                            'cpgyCode': '2'
                        },
                    ];
                } else {
                    this.gylxListData = [
                        {
                            'cpgyName': '工艺路线03',
                            'cpgyCode': '3'
                        },
                    ];
                }
                if (this.currentProduct.gylx) {
                    this.gylxValue = this.currentProduct.gylx.cpgyCode;
                }

            },

            selectGylx(value) {
                let val = this.gylxListData.filter((c) => {
                    return value == c.cpgyCode
                })
                val = val[0];
                let index = val.cpgyCode
                if (index == 1) {
                    let data = [
                        {
                            gxCode: 'GX1',
                            gxName: '工序一',
                            czdw: '单位一',
                            startTime: '',
                            endTime: '',
                            jhsl: '',
                            cpdw: '',
                        },
                        {
                            gxCode: 'GX2',
                            gxName: '工序二',
                            czdw: '单位二',
                            startTime: '',
                            endTime: '',
                            jhsl: '',
                            cpdw: '',
                        }
                    ];
                    this.productGxData = data;
                } else if (index == 2) {
                    let data = [
                        {
                            gxCode: 'GX3',
                            gxName: '工序三',
                            czdw: '单位三',
                            startTime: '',
                            endTime: '',
                            jhsl: '',
                            cpdw: '',
                        }
                    ];
                    this.productGxData = data;
                } else if (index == 3) {
                    let data = [
                        {
                            gxCode: 'GX4',
                            gxName: '工序四',
                            czdw: '单位四',
                            startTime: '',
                            endTime: '',
                            jhsl: '',
                            cpdw: '',
                        }
                    ];
                    this.productGxData = data;

                }
                val['gxes'] = this.productGxData;
                this.currentProduct['gylx'] = val;
                this.planBatchTableData[this.tabActiveIndex].psccps.map((c, i) => {
                    if (c.oid == this.currentProduct.oid) {
                        c.gylx = val;
                    }
                })
            },
            look() {
                // this.productData.map((c)=>{
                //   c.gylx = ['1'];
                // })
              let showData = this.$refs.planBatchTable.getTableData().visibleData;
              this.planBatchTableData = showData;
                console.log(this.formModel, this.planBatchTableData)
            },
            // 表格重新计算
            resize() {
                this.$nextTick(() => {
                    this.$refs.planBatchTable.recalculate();
                })
            },
            // 切换tab后重新计算表格
            handleResetTable() {
                let index = this.active;
                if (index == 0) {
                    this.resize();
                }
                if (index == 1) {
                    this.$refs.cplist.resize();
                    this.$refs.cpEdit.resize();
                }
            }
        },

        watch: {
            product_activeName() {
                this.planBatchTableData.map(o => {
                    if (o.oid == this.product_activeName) {

                    }
                });
            }
        }

    }
</script>

<style lang="less" scoped>
    .msg {
        margin-bottom: 10px;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        .item {
            float: left;
            font-size: 14px;
            white-space: nowrap;

            label {
                color: #555;
            }

            span {
                font-size: 14px;
                margin-right: 20px;
                white-space: nowrap;
            }
        }

    }
</style>