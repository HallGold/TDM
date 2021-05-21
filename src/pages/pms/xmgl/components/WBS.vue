<template>
    <div class="ice-container">
                <!--引用vxe组件,定义变量-->
                <vxe-toolbar :data="tableData" setting v-if="!isShow">
                    <template v-slot:buttons>
                        <div class="ice-grid-button-bar">
                            <el-button type="primary" icon="el-icon-refresh" @click="refreshGrid">刷新</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="addChild">添加子节点</el-button>
                            <el-button type="danger" icon="el-icon-delete" @click="deleteItem">删除</el-button>
                            <el-button type="success" icon="el-icon-position" @click="saveBatch">保存</el-button>
                            <!--<el-button type="primary" icon="el-icon-download" @click="exportCsvEvent">导出</el-button>-->
                            <el-button type="primary" icon="el-icon-video-play" @click="startRw">启动</el-button>
                            <el-button type="primary" icon="el-icon-sort-up" @click="rwUp">升级</el-button>
                            <el-button type="primary" icon="el-icon-sort-down" @click="rwDown">降级</el-button>
                            <div class="ice-quick-query">

                                <el-input maxlength="50" v-model="queryParam" placeholder="请输入关键字">
                                </el-input>
                            </div>
                        </div>

                    </template>
                </vxe-toolbar>
                <vxe-table
                        border
                        resizable
                        show-overflow
                        ref="xGrid"
                        highlight-current-row
                        highlight-hover-row
                        height="700"
                        @cell-dblclick="editItem"
                        :edit-rules="validRules"
                        :toolbar="toolbar"
                        :data="list"
                        :edit-config="{trigger: 'click', mode: 'row', showStatus: true, showIcon: false}"
                        :tree-config="treeConfig"
                        :keyboard-config="{isArrow: false}">
                    <vxe-table-column field="dataPxh" title="序号" width="50"></vxe-table-column>
                    <vxe-table-column field="wbscode" title="WBS编号" tree-node width="100"></vxe-table-column>
                    <vxe-table-column field="rwname" title="任务名称" :edit-render="{type: 'visible', name: 'ElInput'}" ></vxe-table-column>
                    <vxe-table-column field="qzrw" title="前置任务" :edit-render="{type: 'visible', name: 'ElInput', events: {blur: qzrwBlurEvent}}" ></vxe-table-column>
                    <vxe-table-column field="rwgq" title="工期" :edit-render="{type: 'visible', name: 'ElInputNumber', events: {change: rwgqChangeEvent}}" ></vxe-table-column>
                    <vxe-table-column field="dateJhStar" title="开始日期" :edit-render="{type: 'visible'}" >
                        <template v-slot:edit="{ row }">
                            <el-date-picker
                                    type="date"
                                    @change="dateJhStartChange(row)"
                                    :picker-options="pickerOptions"
                                    v-model="row.dateJhStar" format="yyyy/MM/dd"></el-date-picker>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dateJhEnd" title="完成日期" :edit-render="{type: 'visible'}" >
                        <template v-slot:edit="{ row }">
                            <el-date-picker
                                    type="date"
                                    @change="dateJhEndChange(row)"
                                    :picker-options="pickerOptions"
                                    v-model="row.dateJhEnd" format="yyyy/MM/dd"></el-date-picker>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="rwdept" title="部门" >
                        <template v-slot="{ row }">
                            <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="row.rwdeptName" @select-confirm="depts=>row.rwdept=depts[0].deptCode">
                            </ice-dept-selector>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="rwfzr" title="负责人" >
                        <template v-slot="{ row }">
                            <ice-persion-selector mode="onlySelect" chooseItem="single" :dept-code="row.rwdept" v-model="row.rwfzr">
                            </ice-persion-selector>
                        </template>
                    </vxe-table-column>
                </vxe-table>
        <!--弹出模态框-->
        <WbsEdit ref="myWbsEdit" @getInfoDate="getInfoDate" :pcomputeDate="computeDate"></WbsEdit>
    </div>
</template>

<script>
  import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
  import IceSelect from "../../../../components/common/base/IceSelect";
  import IceTree from "../../../../components/common/base/IceTree";
  import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
  import IcePersionByDeptSelector from "../../../../components/common/biz/IcePersionByDeptSelector";
  import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
  import IcePopSelector from "../../../../components/common/base/IcePopSelector";
  import WbsEdit from "../wbsEdit";

  export default {
    props: {
      transferWbsTreeData: {
        default: function () {
          return {}
        }
      },
      isShow: false
    },
    watch: {
      transferWbsTreeData () {
        if (this.transferWbsTreeData.id) {
          this.xmkNodeClick();
        }
      }
    },
    name: "wbs",
    //为了不让多处的组件共享同一data对象，只能返回函数。
    data() {
      return {
        queryParam: '',
        //调用页面网格数据
        tableData: [],
        removeList: [],
        toolbar: {
          id: 'toolbar_demo_2',
          refresh: false,
          setting: {
            storage: true
          }
        },
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        },
        treeConfig: {
          trigger: 'default',
          children: 'children',
          indent: '1',
          expandAll: true
        },
        validRules: {
          rwname: [
            {required: true, message: '任务名称必须填写'}
          ],
          rwjd: [
            {type: 'number', min: 0, message: '任务进度必须大于0'}
          ],
          rwgq: [
            {type: 'number', min: 1, message: '任务工期必须大于0'}
          ],
          rwgs: [
            {type: 'number', min: 1, message: '任务工时必须大于0'}
          ],
        },
        rules: {
          rwname: [
            {required: true, whitespace: true, message: '请输入任务名称', trigger: 'blur'}
          ],
          wbscode: [
            {required: true, whitespace: true, message: '请输入WBS编号', trigger: 'blur'}
          ],
          version: [
            {required: true, whitespace: true, message: '请输入版本', trigger: 'blur'}
          ],
          dataSecretLevcode: [
            {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
          ],
        },
        //定义弹出框为false，隐藏状态
        visible: false,
        title: '',
        insertRecord: {
          oid: this.getRandomId(),
          oidXm: '',
          pid: '0',
          wbscode: '0',
          rwname: '',
          rwms: '',
          rwlx: '',
          qzrw: '',
          rwjd: '0',
          rwgq: '1',
          rwgs: '1',
          rwms: 'RWMS01',
          rwzt: 'RWZT01',
          xzlx: 'XZLX01',
          dataSecretLevcode: '2',
          dateJhStar: this.defaultDate(),
          dateJhEnd: this.defaultDate(),
          rwdept: '',
          rwdeptName: '',
          rwfzr: '',
          dataPxh: '',
          rwtj: 'FS',
          fileList: [],
          isNew: true
        },
        dataPxh: 0,
        //定义模态框 转圈加载过程
        loading: false,
        pickerOptions: {}
      }
    },
    created () {
      this.pickerOptions = {
        disabledDate(time) {
          if(new Date(time).getDay() == 0 || new Date(time).getDay() == 6){
            return true
          }
          return false;
        }
      }
    },
    //触发事件方法
    methods: {
      query() {
        //获取查询框的值
        const queryParam = this.queryParam
        let iceQueryCondition = [{
          column: 'oidXm',
          exp: '=',
          value: this.insertRecord.oidXm
        }]
        if(queryParam != '') {
          iceQueryCondition.push({
            column: 'rwname',
            exp: 'like',
            value: queryParam
          })
        }
        let columns = Object.keys(this.$refs.myWbsEdit.formModel)
        columns.splice(columns.findIndex(item => item === 'rwdeptName'), 1)
        if(columns.findIndex(item => item ==='_XID') != -1) {
          columns.splice(columns.findIndex(item => item === '_XID'), 1)
        }
        if(columns.findIndex(item => item ==='isNew') != -1) {
          columns.splice(columns.findIndex(item => item === 'isNew'), 1)
        }
        if(columns.findIndex(item => item ==='children') != -1) {
          columns.splice(columns.findIndex(item => item === 'children'), 1)
        }
        if(columns.findIndex(item => item ==='fileList') != -1) {
          columns.splice(columns.findIndex(item => item === 'fileList'), 1)
        }
        if(columns.findIndex(item => item ==='insertList') != -1) {
          columns.splice(columns.findIndex(item => item === 'insertList'), 1)
        }
        if(columns.findIndex(item => item ==='updateList') != -1) {
          columns.splice(columns.findIndex(item => item === 'updateList'), 1)
        }
        if(columns.findIndex(item => item ==='deleteList') != -1) {
          columns.splice(columns.findIndex(item => item === 'deleteList'), 1)
        }
        const query = {columns, conditions: iceQueryCondition}
        this.pageList(query)
      },
      pageList(queryParam) {
        let {currentPage, pageSize} = this.tablePage
        this.$axios.get("/pms/PmsWbs/treeList", {params: queryParam})
          .then(result => {
            const data = result.data
            this.tableData = data
            this.$nextTick(()=>{
              console.log('this.refs.xGrid')
              console.log('this.refs.xGrid', this.$refs.xGrid)
              this.$refs.xGrid.recalculate();
            })
          })
      },
      // 清空tabledata
      emptyTable () {
        this.tableData = [];
      },
      addItem() {
        this.insertRecord.pid = "0"
        let xGrid = this.$refs.xGrid
        this.insertRecord.oid = this.getRandomId()
        xGrid.createRow(this.insertRecord).then(newRow => {
          //计算wbs编码
          newRow.wbscode = this.tableData.length + 1
          this.tableData.push(newRow)
          this.dataPxh=0
          this.computePxh(this.tableData)
          this.updateFlage()
          xGrid.refreshData().then(() => xGrid.setActiveRow(newRow))
        })
      },

      refresh () {
        this.$nextTick(()=>{
          console.log('this.refs.xGrid')
          console.log('this.refs.xGrid', this.$refs.xGrid)
          this.$refs.xGrid.recalculate();
        })
      },
      editItem() {
        this.title="修改"
        //获取选中的数据
        let selectRecords = this.$refs.xGrid.getCurrentRow()
        if(!selectRecords) {
          this.$message.warning("请选择一条数据！")
          return
        }
        let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
        let { item } = matchObj
        this.$refs.myWbsEdit.getParentParams(this.title, item, this.tableData)
      },
      getInfoDate(tableData) {
        console.log(tableData)
        let xGrid = this.$refs.xGrid
        this.tableData = tableData
        xGrid.refreshData()
      },
      deleteItem() {
        //获取选中的数据
        let xGrid=this.$refs.xGrid
        let selectRecords = xGrid.getCurrentRow()
        if(!selectRecords) {
          this.$message.warning("请选择一条数据！")
          return
        }
        //从列表中移除
        let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
        if (matchObj) {
          let { items, index, item, parent } = matchObj
          //如果存在子节点，提示用户先删除子节点
          if(item.children && item.children.length > 0) {
            this.$message.warning("该任务存在子任务，请先删除子任务！")
            return
          }
          // 从树节点中移除
          let restRow = items.splice(index, 1)[0]
          this.removeList.push(restRow)
          if(parent) {
            this.cumpteWbsCode(parent, items)
          }else {
            this.cumpteWbsCode(null, items)
          }
          //删除后，如果存在后置节点，则将后置节点的前置任务设置为空
          //根据旧序号，得到所有后置任务
          let rowNodes = this.$utils.filterTree(this.tableData, itemf => Number(itemf.qzrw) === item.dataPxh, this.treeConfig)
          if(rowNodes && rowNodes.length>0) {
            rowNodes.forEach(item => {
              item.qzrw = ''
              item.dateJhStar = this.defaultDate()
              //计划开始日期改变
              this.dateJhStartChange(item)
            })
          }
          //重新计算树节点序号
          this.dataPxh=0
          this.computePxh(this.tableData)
          xGrid.refreshData()
        }
      },
      addChild() {
        let xGrid = this.$refs.xGrid
        let selectRecords = xGrid.getCurrentRow()
        if(!selectRecords) {
          this.$message.warning("请选择一条数据！")
          return
        }
        this.insertRecord.pid = selectRecords.oid
        this.insertRecord.oid = this.getRandomId()
        xGrid.createRow(this.insertRecord).then(newRow => {
          // 插入到 选中节点的子节点
          let rowNode = this.$utils.findTree(this.tableData, item => item.oid === selectRecords.oid, this.treeConfig)

          if (rowNode) {
            if(!rowNode.item.children) {
              rowNode.item.children = []
            }
            //wbscode
            //判断父节点有几位小数
            const arrNum = rowNode.item.wbscode.toString().split(".")
            let fixnum = 0
            if(arrNum.length > 1) {
              fixnum = rowNode.item.wbscode.toString().split(".")[1].length
            }
            newRow.wbscode = rowNode.item.wbscode + '.' + (rowNode.item.children.length + 1)
            rowNode.item.children.push(newRow)
            //计算序号,获取列表全部列数
            this.dataPxh=0
            this.computePxh(this.tableData)
            this.updateFlage()
            xGrid.setTreeExpansion(selectRecords, true)
            xGrid.refreshData().then(() => xGrid.setActiveRow(newRow))
          }
        })
      },
      getData () {
            let xGrid = this.$refs.xGrid
            // 三组数据 新增、删除、修改
            let insertRecords = this.$utils.filterTree(this.tableData, item => item.isNew, this.treeConfig)
            let removeRecords = this.removeList
            let updateRecords = updateRecords = this.$utils.filterTree(this.tableData, item => !item.isNew, this.treeConfig)
            let entities = {insertEntity: insertRecords, updateEntity: updateRecords, deleteEntity: removeRecords, xmOid: this.insertRecord.oidXm}
            return entities;
      },
      saveBatch() {
        let xGrid = this.$refs.xGrid
        // 三组数据 新增、删除、修改
        let insertRecords = this.$utils.filterTree(this.tableData, item => item.isNew, this.treeConfig)
        let removeRecords = this.removeList
        let updateRecords = updateRecords = this.$utils.filterTree(this.tableData, item => !item.isNew, this.treeConfig)


        let entities = {insertEntity: insertRecords, updateEntity: updateRecords, deleteEntity: removeRecords, xmOid: this.insertRecord.oidXm}
        this.$axios.post("/pms/PmsWbs/saveBatch", {$json: entities})
          .then(result => {
            this.$message.success("保存成功");  //保存完毕之后的提示
            this.query()
          })
          .catch(error => {
            this.$message.error("保存失败");
          })
          .finally(_ => {
            this.loading = false;
          })
      },
      //刷新按钮方法
      refreshGrid() {
        this.query()
      },
      //随机数做为临时id
      getRandomId() {
        return new Date().getTime()
      },
      rwmsChangeEvent ({ row }, evnt) {
        // 由于重写了内部的 model 事件，所以需要自行处理赋值相关的逻辑
        row.rwms = evnt
      },
      //项目树点击
      xmkNodeClick() {
        const {data} = this.transferWbsTreeData.obj;
        this.insertRecord.oidXm = this.transferWbsTreeData.id;
        this.insertRecord.dataSecretLevcode = data.dataSecretLevcode
        this.insertRecord.version = data.version
        this.query()
      },
      startRw() {
        let xGrid = this.$refs.xGrid
        let selectRecords = xGrid.getCurrentRow()
        if(!selectRecords) {
          this.$message.warning("请选择一条数据！")
          return
        }
        this.$confirm('确定启动任务：'+selectRecords.rwname+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectRecords.rwzt = 'RWZT02'
          this.$axios.post("/pms/PmsWbs/startRw", {$json: selectRecords})
            .then(result => {
              this.$message.success("启动成功")
              this.query()
            })
            .catch(error => {
              this.$message.error(error.msg)
            })
        }).catch(_ => {

        })
      },
      rwUp() {
        let xGrid = this.$refs.xGrid
        let selectRecords = xGrid.getCurrentRow()
        let rowNode = this.$utils.findTree(this.tableData, item => item.oid === selectRecords.oid, this.treeConfig)
        console.log(rowNode)
        if(rowNode) {
          //获取到父节点
          let parentNode = rowNode.parent
          //从父节点中移除该节点
          if(parentNode) {
            rowNode.item.pid = parentNode.pid
            let { items, index } = rowNode
            // 从树节点中移除
            items.splice(index, 1)[0]
            //重新计算兄弟节点的编码
            //this.cumpteWbsCode(parentNode, items)
            //将该节点放到与父节点同一级，即和父节点变成兄弟节点
            //从tableData中找到父节点
            let rowNode1 = this.$utils.findTree(this.tableData, item => item.oid === parentNode.oid, this.treeConfig)
            if(rowNode1) {
              //找到父节点的父节点
              let parentNode1 = rowNode1.parent
              if(parentNode1) {
                if(!parentNode1.children) {
                  parentNode1.children = []
                }
                parentNode1.children.push(rowNode.item)
                this.cumpteWbsCode(parentNode1, parentNode1.children)
              } else {
                this.tableData.splice(rowNode1.index+1, 0, rowNode.item)
                this.cumpteWbsCode(null, this.tableData)
              }
              //重新计算树节点序号
              this.dataPxh=0
              this.computePxh(this.tableData)
              this.updateFlage()
            }
          } else {
            //已经是最顶层
            this.$message.success(rowNode.item.rwname+"已是最顶级")
          }
        }
      },

      rwDown() {
        let xGrid = this.$refs.xGrid
        let selectRecords = xGrid.getCurrentRow()
        let rowNode = this.$utils.findTree(this.tableData, item => item.oid === selectRecords.oid, this.treeConfig)
        if(rowNode) {
          //获取选中节点的上一个兄弟节点
          if(rowNode.index == 0) {
            this.$message.success(rowNode.item.rwname+"已是最后一级")
          } else {
            let { items, index } = rowNode
            // 从树节点中移除
            items.splice(index, 1)[0]
            let preNode = items[index - 1]
            if(!preNode.children) {
              preNode.children = []
            }
            rowNode.item.pid = preNode.oid
            preNode.children.push(rowNode.item)
            //重新计算wbscode
            if(rowNode.parent) {
              this.cumpteWbsCode(rowNode.parent, items)
            }else{
              this.cumpteWbsCode(null, items)
            }
            xGrid.setTreeExpansion(preNode, true)
            //重新计算树节点序号
            this.dataPxh=0
            this.computePxh(this.tableData)
            this.updateFlage()
          }
        }
      },
      cumpteWbsCode(parentNode, items) {
        let pWbsCode = 0
        for(let i = 0; i < items.length; i++) {
          if(parentNode) {
            pWbsCode = parentNode.wbscode
            items[i].wbscode = pWbsCode + '.' + (i + 1)
          }else{
            items[i].wbscode = pWbsCode + (i + 1)
          }
          if(items[i].children) {
            this.cumpteWbsCode(items[i], items[i].children)
          }
        }
      },
      /**
       * items 需要该表序号的
       */
      computePxh(items) {
        //重新计算树节点的序号
        if(items) {
          items.forEach(element => {

            //获取重新计算之前的序号
            const oldPxh = element.dataPxh
            const newPxh = this.dataPxh+1
            //根据旧序号，得到所有后置任务
            let rowNodes = this.$utils.filterTree(this.tableData, item => Number(item.qzrw) === oldPxh&&!item.flag, this.treeConfig)
            if(rowNodes && rowNodes.length>0) {
              rowNodes.forEach(item=>{
                item.qzrw=newPxh
                //标记本次前置任务已经更新
                item.flag=true
              })
            }
            this.dataPxh = newPxh
            element.dataPxh=this.dataPxh
            this.computePxh(element.children)
          });
        }
      },
      //每次序号重新排序后，调用，将flag改为false，方便下次排序
      updateFlage() {
        let rowNodes = this.$utils.filterTree(this.tableData, item => item.flag, this.treeConfig)
        if(rowNodes && rowNodes.length>0) {
          rowNodes.forEach(item=>{
            item.flag=false
          })
        }
      },
      //计划开始日期改变，根据工期计算计划结束日期
      dateJhStartChange(row) {
        if(row) {
          //获取前置任务，计划开始日期必须大于前置任务的结束日期
          let rowNodes = this.$utils.filterTree(this.tableData, item => row.qzrw==null?false: row.qzrw.indexOf(item.dataPxh) != -1, this.treeConfig)
          if(rowNodes) {
            rowNodes.sort(this.arraySort('dateJhEnd'))
            let diffDayObj = this.$utils.getDateDiff(rowNodes[0].dateJhEnd, row.dateJhStar)
            if(!diffDayObj.done || diffDayObj.dd==0) {
              row.dateJhStar = this.computeDate(rowNodes[0].dateJhEnd, 1)
            }
          }
          //计算结束日期
          row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq)-1)
          //获取该任务的后置任务
          this.changeHzrw(row)
        }
      },
      //计划结束日期改变，根据计划开始日期计算工期
      dateJhEndChange(row) {
        if(row) {
          //计算结束日期
          let diffDayObj = this.$utils.getDateDiff(row.dateJhStar, row.dateJhEnd)
          if(diffDayObj.done) {
            let day = 0
            const diffDay=diffDayObj.dd
            //找出结束日期与开始日期之间的周末
            for(let i = 0; i < diffDay; i++) {
              let nextDate = this.$utils.getWhatDay(row.dateJhStar, i + 1)
              if(new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6){
                day++
              }
            }
            row.rwgq = diffDay - day + 1
            //获取该任务的后置任务
            this.changeHzrw(row)
          }
        }
      },

      arraySort(field) {
        return (a, b) => {
          const datea = a[field]
          const dateb = b[field]
          if(this.$utils.getDateDiff(datea, dateb).done) {
            return 1
          } else {
            return -1
          }
        }
      },
      //修改前置任务，联动
      qzrwBlurEvent({ row }, evnt) {
        if(row.qzrw) {
          let qzrwArr = row.qzrw.split(',');
          let qzrwNodes = []
          qzrwArr.forEach(qzrw => {
            let rowNode = this.$utils.findTree(this.tableData, item => item.dataPxh === Number(qzrw), this.treeConfig)
            if(rowNode){
              qzrwNodes.push(rowNode.item)
            }
          })
          if(qzrwNodes.length > 0) {
            qzrwNodes.sort(this.arraySort('dateJhEnd'))
            row.dateJhStar = this.computeDate(qzrwNodes[0].dateJhEnd, 1)
            row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq)-1)
            //获取该任务的后置任务
            this.changeHzrw(row)
          }
        }
      },
      rwgqChangeEvent({ row }, evnt) {
        if(this.$utils.isInteger(row.rwgq) && Number(row.rwgq) > 0) {
          row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq)-1)
          this.changeHzrw(row)
        }
      },
      changeHzrw(row) {
        let rowNodes = this.$utils.filterTree(this.tableData, item => item.qzrw==null?false: item.qzrw.indexOf(row.dataPxh) != -1, this.treeConfig)
        if(rowNodes && rowNodes.length>0) {
          rowNodes.forEach(item=>{
            //找到后置任务的所有前置任务，然后计算前置任务中结束日期最大的
            let qzrwArr = item.qzrw.split(',');
            let qzrwNodes = []
            qzrwArr.forEach(qzrw => {
              let rowNode = this.$utils.findTree(this.tableData, item => item.dataPxh === Number(qzrw), this.treeConfig)
              if(rowNode){
                qzrwNodes.push(rowNode.item)
              }
            })
            if(qzrwNodes.length > 0) {
              qzrwNodes.sort(this.arraySort('dateJhEnd'))
              item.dateJhStar = this.computeDate(qzrwNodes[0].dateJhEnd, 1)
              item.dateJhEnd = this.computeDate(item.dateJhStar, Number(item.rwgq)-1)
              this.changeHzrw(item)
            }
          })
        }
      },
      /**
       * startDate 日期计算的起始值·
       * rwgq 需要增加的天数，工期减1
       * return 返回计算后的日期
       */
      //根据日期和工期，返回真实的工作日，排除周末
      computeDate(startDate, rwgq) {
        let day = rwgq
        //包含周末的结束日期
        let endDate = this.$utils.getWhatDay(startDate, rwgq)
        //开始日期和结束日期之间存在多少需要屏蔽的天数
        let diffDayObj = this.$utils.getDateDiff(startDate, endDate)
        if(diffDayObj.done) {
          const diffDay = diffDayObj.dd
          for(let i = 0; i < diffDay; i++) {
            let nextDate = this.$utils.getWhatDay(startDate, i + 1)
            if(new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6){
              day++
            }
          }
        }
        //工期内的屏蔽日期已经过滤，特例情况，c此时结束日期正好是需要屏蔽的日期，需要找到紧邻的第一天工作日
        endDate = this.$utils.getWhatDay(startDate, day)
        if(new Date(endDate).getDay() == 0 || new Date(endDate).getDay() == 6){
          console.log(this.hasShieldDate(endDate, 1))
          endDate = this.hasShieldDate(endDate, 1)
        }
        return endDate
      },
      hasShieldDate(date, day) {
        let nextDate = this.$utils.getWhatDay(date, day)
        if(new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6){
          nextDate = this.hasShieldDate(nextDate, day)
        }
        return nextDate
      },
      defaultDate(){
        return new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate() +" 00:00:00")
      } ,
      getRowsData(data,tableData) {
        tableData.forEach(row => {
          row.dateJhStar = this.$utils.toDateString(row.dateJhStar, 'yyyy-MM-dd')
          row.dateJhEnd = this.$utils.toDateString(row.dateJhEnd, 'yyyy-MM-dd')
          data.push(row)
          if(row.children && row.children.length>0) {
            this.getRowsData(data, row.children);
          }
        });
      },
      exportCsvEvent() {
        let data = []
        this.getRowsData(data, this.tableData);
        console.log(data)
        this.$refs.xGrid.exportCsv({
          filename: 'wbs任务分解',
          original: true,
          data
        })
      }
    },
    computed: {
      list() {
        let filterName = this.$utils.toString(this.queryParam).trim().toLowerCase()
        if (filterName) {
          let searchProps = ['rwname', 'rwdept', 'rwfzr']
          let rest = this.$utils.searchTree(this.tableData, item => searchProps.some(key => this.$utils.toString(item[key]).toLowerCase().indexOf(filterName) > -1), this.treeConfig)
          return rest
        }
        return this.tableData
      }
    },
    //这个是你引用插件生成的,不用管它
    components: {
      IceSelect,
      IceQueryGrid,
      IceTree,
      IceDeptSelector,
      IcePersionByDeptSelector,
      IcePersionSelector,
      IcePopSelector,
      WbsEdit
    }
  }
</script>
<style>
    .ice-container /deep/ table {
        /*width: 100%!important;*/
    }
</style>
