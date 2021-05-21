<template>
    <div>
        <pms-select-tree ref="selectTree" :isemptyBtn="isemptyBtn"
                         :showChecked="showChecked"
                         :inpWidth="width"
                         :unbrid="unbrid"
                         :treeData="treeData"
                         :transfer="transferTree.treeData"
                         @handleCallback="handleCallback2">

        </pms-select-tree>
        <!--<pms-table-tree :unbrid="unbrid"-->
                        <!--:dialogConfig="dialogConfig"-->
                        <!--:tableObject="tableObject"-->
                        <!--:inpWidth="width"-->
                        <!--:transfer="transfer"-->
                        <!--@handleCallback="handleCallback"-->
                        <!--@handleClose="handleToggleDialog"-->
                        <!--ref="abbbb"-->
                        <!--@handleTreeCallback="handleTreeCallback">-->
        <!--</pms-table-tree>-->
        <!--<pms-project-tree :title="title" :buttons="buttons" :conceal="conceal" @handleCallback="handleCallback"></pms-project-tree>-->
    </div>
</template>

<script>
  import PmsSelectTree from '../pms/PmsSelectTree'
  import PmsTableTree from '../pms/group/PmsTableTree'
  import PmsProjectTree from '../pms/PmsProjectTree'
  import moment from 'moment';
  import IceDialog from "./IceDialog";

  export default {
    name: "tree",
    components: {
      PmsSelectTree,
      PmsTableTree,
      PmsProjectTree,
      IceDialog
    },
    data() {
      return {
        conceal: [],
        dialogVisible: true,
        input2: '',
        value: '',


        title: '计划信息',
        buttons: {
          topButtons: [
            {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ",size:"mini", callback: this.addXzcy},
            {name: '下发', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ",size:"mini", callback: this.addXzcy},
          ],
          bottomButtons: [
            {name: '编辑', icon: 'el-icon-edit', color: '#fff',size:"20px", callback: this.addXzcy},
            {name: '删除', icon: 'el-icon-delete', color: '#fff',size:"20px", callback: this.addXzcy},
          ]
        },

        unbrid: false,
        width: '300px',
        showChecked: true,
        isemptyBtn: true,
        transferTree: {
          treeData: {
            // 请求树接口地址
            api: '/pms/DataDictionaryType/getTree?code=XMLY',
            lazy: false,
            nodeKey: 'oid',
            // 配置字段
            props: {
              label: 'name',
              children: 'children'
            },
            // 请求传递参数
            initModel: {

            }
          },
        },
        treeData: {
          value: '',
          placeholder: '请选择'
        },

        dialogConfig: {
          title: '选择',
          width: '80%',
          height: '500px',
          visible: true,
          modal: true,

        },
        tableObject: {
          buttons: [

          ],
          query: [
            {type: 'input', code: 'htname', label: '合同名称'},
            {type: 'input', code: 'htcode', label: '合同编号'},
            {type: 'input', code: 'htjf', label: '甲方'},
            {type: 'input', code: 'htyf', label: '乙方'},
            {type: 'date', code: 'dateCreate', label: '合同签订日期', exp: '='},
            {type: 'date', code: 'dateStart', label: '合同生效日期', exp: '='},
            {type: 'date', code: 'dateEnd', label: '合同终止日期', exp: '='},
          ],
          columns: [
            {code: 'oid', hidden: true},
            {code: 'dateRemark', hidden: true},
            {label: '合同名称', code: 'htname', width: 160},
            {label: '合同', code: 'htcode', width: 140},
            {label: '甲方', code: 'htjf', width: 120},
            {label: '乙方', code: 'htyf', width: 120},
            {label: '合同金额', code: 'htje', width: 120},
            {label: '合同签订日期', code: 'dateCreate', width: 130, sortable: true, formatter(row) {
                return moment(row.dateCreate).format('YYYY-MM-DD');
              }},
            {label: '合同生效日期', code: 'dateStart', width: 130, sortable: true, formatter(row) {
                return moment(row.dateStart).format('YYYY-MM-DD');
              }},
            {label: '合同终止日期', code: 'dateEnd', width: 130, sortable: true, formatter(row) {
                return moment(row.dateEnd).format('YYYY-MM-DD');
              }},
            {label: '合同类型', code: 'htlx', width: 100, mapTypeCode: 'HTLX'},
            {label: '份数', code: 'htNum', width: 80},
            {label: '合同概要', code: 'htrw', width: 100},
            {label: '登记部门', code: 'htdept', width: 120},
            {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
          ],
          api: '/pms/PmsHtinfo/list',
          title: '表头名字',
          chooseItem: 'multiple',
          total: 10,
        }
      };
    },
    created () {
      this.getListNoAsync();
      let tid = setTimeout(()=>{
        console.log(123)
        this.transferTree.treeData.initModel= {
          'a':1

        }
        this.$refs.selectTree.refresh();
      }, 5000)
    },
    methods: {
      addXzcy () {
        console.log(this.buttons)
      },
      handleToggleDialog () {
        this.dialogConfig.visible = !this.dialogConfig.visible;
      },
      handleClick() {

      },
      // 子组件点击回调  选中的数据
      handleCallback2(data) {
        // 回调后数据操作
        console.log(data);
      },
      // 树组件选中回调
      handleTreeCallback (data) {
        console.log(data);
        this.$refs.abbbb.refresh();
      },
      getListNoAsync() {
        this.tableObject.loading = true;
        this.$axios.get('/pms/Jhgl/list', {params: {
            size:5,
            current:1,
            conditionLink:'AND',
            columns: ['oid', 'jhyear', 'jhname', 'jhcode', 'deptName','jhfzr','jhlx','jhzt','dataSecretLevcode','createDate','jhmb']
          }})
          .then(result => {
            if (result.data.records.length > 0) {
              this.tableObject.gridData = result.data.records;
              this.tableObject.loading = false;
              return false;
              this.initDefaultShow(result.data[0])
            } else {
              resolve([]);
            }
          })
          .catch(error => {
            this.$message.error("获取失败")
          })
          .finally(_ => {

          })
      },
      // 下拉框显示隐藏
      change (val) {
        if (val) {
          this.$refs.icon.style.transform = 'rotate(-180deg)';
        } else {
          this.$refs.icon.style.transform = 'rotate(0)';
        }
      }
    }
  }
</script>

<style scoped>
    .el-tabs__content {
        background: #aaa;
    }
    .icon {
        transition: all 0.3s;
    }
</style>