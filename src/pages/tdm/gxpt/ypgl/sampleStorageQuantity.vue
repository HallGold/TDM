<template>
  <el-container>
    <el-aside width="200px">
      <ice-tree load-url="tdm/warehouse/listInfo"
                label-prop="name"
                value-prop="oid"
                :lazy="false"
                ref="tree"
                style="height:100%"
                @node-click="handleNodeClick">
      </ice-tree>
    </el-aside>
    <el-main>
      <div class="titleText">
        <ul>
          <li>在库样品：<span style="color:#1890FF">{{nowCapacity}} </span><span>{{unit}}</span></li>
          <li style="color:red">最大存放数量为：<span>{{maximumCapacity}} </span><span>{{unit}}</span></li>
        </ul>
      </div>
      <el-table :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px;max-height:720px"
                ref="tableRef"
                v-loading="loading">
        <el-table-column prop="sampleNumber"
                         label="样品编码"
                         align="center">
        </el-table-column>
        <el-table-column prop="sampleName"
                         label="样品名称"
                         align="center">
        </el-table-column>
        <el-table-column prop="receiptNum"
                         label="收样单号"
                         align="center">
        </el-table-column>
        <el-table-column prop="receiveSamplesTime"
                         label="收样日期"
                         align="center">
        </el-table-column>
        <el-table-column prop="warehousingNum"
                         label="收样数量"
                         align="center">
        </el-table-column>
        <el-table-column prop="warehouseName"
                         label="存放地址"
                         align="center">
        </el-table-column>
        <el-table-column prop="takeReceiptNum"
                         label="领样单号"
                         align="center">
        </el-table-column>
        <el-table-column prop="takeReceiveSamplesTime"
                         label="领样日期"
                         align="center">
        </el-table-column>
        <el-table-column prop="takeWarehousingNum"
                         label="领样数量"
                         align="center">
        </el-table-column>
        <el-table-column prop="sampleNum"
                         label="剩余数量"
                         align="center">
        </el-table-column>
        <el-table-column prop="unit"
                         label="计量单位"
                         :formatter='formatterUnit'
                         align="center">
        </el-table-column>
        <el-table-column prop="sampleAttributes"
                         label="规格型号"
                         :formatter='formatterAttributes'
                         align="center">
        </el-table-column>
        <el-table-column prop="isDynamite"
                         label="是否炸药"
                         :formatter='formatterisDynamite'
                         align="center">
        </el-table-column>
      </el-table>
    </el-main>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pageTotal">
      </el-pagination>
    </div>
  </el-container>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceTree from "@/components/common/base/IceTree"
export default {
  components: { IceQueryGrid, IceDialog, IceTree },
  data () {
    return {
      /* 表格数据 */
      tableData: [],
      /* 默认第一页页 */
      currentPage: 1,
      /* treeID */
      singleOid: '',
      /* 分页条数 */
      pageSize: 10,
      /* 选中当前页 */
      pagecurrent: 1,
      /* 合并返回的数组 */
      spanArr: [],
      /* 仓库总重量 */
      maximumCapacity: '',
      /* 仓库当前重量 */
      nowCapacity: '',
      /* 仓库重量单位 */
      unit: '',
      pageTotal: 0,
      loading: true,
    }
  },
  methods: {
    /* 判断请求过来数据是否相同 */
    flitterData (arr) {
      let spanOneArr = [],
        spanTwoArr = [],
        spanThreeArr = [],
        spanFourArr = [],
        spanFiveArr = [],
        spanSixArr = [],
        spanNineArr = [],
        concatOne = 0,
        concatTwo = 0,
        concatThree = 0,
        concatFour = 0,
        concatFive = 0,
        concatSix = 0,
        concatNine = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
          spanThreeArr.push(1);
          spanFourArr.push(1);
          spanFiveArr.push(1);
          spanSixArr.push(1);
          spanNineArr.push(1);
        } else {
          //第一列需合并相同内容的判断条件
          if (item.sampleNumber === arr[index - 1].sampleNumber && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          };
          //第二列需合并相同内容的判断条件
          if (item.sampleName === arr[index - 1].sampleName && item.sampleName === arr[index - 1].sampleName && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanTwoArr[concatTwo] += 1;
            spanTwoArr.push(0);
          } else {
            spanTwoArr.push(1);
            concatTwo = index;
          };
          //第三列需合并相同内容的判断条件
          if (item.receiptNum === arr[index - 1].receiptNum && item.receiptNum === arr[index - 1].receiptNum && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanThreeArr[concatThree] += 1;
            spanThreeArr.push(0);
          } else {
            spanThreeArr.push(1);
            concatThree = index;
          };
          //第四列需合并相同内容的判断条件
          if (item.receiveSamplesTime === arr[index - 1].receiveSamplesTime && item.receiveSamplesTime === arr[index - 1].receiveSamplesTime && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanFourArr[concatFour] += 1;
            spanFourArr.push(0);
          } else {
            spanFourArr.push(1);
            concatFour = index;
          };
          //第五列需合并相同内容的判断条件
          if (item.warehousingNum === arr[index - 1].warehousingNum && item.warehousingNum === arr[index - 1].warehousingNum && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanFiveArr[concatFive] += 1;
            spanFiveArr.push(0);
          } else {
            spanFiveArr.push(1);
            concatFive = index;
          };
          //第六列需合并相同内容的判断条件
          if (item.warehouseName === arr[index - 1].warehouseName && item.warehouseName === arr[index - 1].warehouseName && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanSixArr[concatSix] += 1;
            spanSixArr.push(0);
          } else {
            spanSixArr.push(1);
            concatSix = index;
          };
          //第九列需合并相同内容的判断条件
          if (item.sampleNum === arr[index - 1].sampleNum && item.sampleNum === arr[index - 1].sampleNum && item.sampleNumber === arr[index - 1].sampleNumber) {
            spanNineArr[concatNine] += 1;
            spanNineArr.push(0);
          } else {
            spanNineArr.push(1);
            concatNine = index;
          };
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr,
        three: spanThreeArr,
        four: spanFourArr,
        five: spanFiveArr,
        six: spanSixArr,
        nine: spanNineArr
      }
    },
    /* 表格合并 */
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = (this.flitterData(this.tableData).one)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 1) {
        const _row = (this.flitterData(this.tableData).two)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 2) {
        const _row = (this.flitterData(this.tableData).three)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 3) {
        const _row = (this.flitterData(this.tableData).four)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 4) {
        const _row = (this.flitterData(this.tableData).five)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 5) {
        const _row = (this.flitterData(this.tableData).six)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 9) {
        const _row = (this.flitterData(this.tableData).nine)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    /* tree点击回调 */
    handleNodeClick (data, node, item) {
      console.log(node.data);
      this.loading = true
      this.nowCapacity = node.data.nowCapacity;
      this.maximumCapacity = node.data.maximumCapacity;
      this.unit = node.data.dictionaryCategory.name;
      this.singleOid = data;
      console.log(this.singleOid);
      this, this.$nextTick(() => {
        this.$axios.get('tdm/sample/warehouseRemainingSampleRecords', {
          params: {
            singleOid: this.singleOid,
            size: this.pageSize,
            current: this.pagecurrent,
          }
        }).then(res => {
          this.pageTotal = res.data.total;
          this.tableData = res.data.records;
          this.flitterData(this.tableData)
          this.loading = false
        }).catch(err => {
          this.$message.error(err.msg)
          this.loading = false
        })
      })

    },
    /* 选中条数 */
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.$axios.get('tdm/sample/warehouseRemainingSampleRecords', {
        params: {
          singleOid: this.singleOid,
          size: this.pageSize,
          current: this.pagecurrent,
        }
      }).then(res => {
        this.loading = false
      }).catch(err => {
        this.$message.error(err.msg)
        this.loading = false
      })
    },
    /* 选中当前页 */
    handleCurrentChange (val) {
      //   console.log(`当前页: ${val}`);
      this.pagecurrent = val
      this.loading = true
      this.$axios.get('tdm/sample/warehouseRemainingSampleRecords', {
        params: {
          singleOid: this.singleOid,
          size: this.pageSize,
          current: this.pagecurrent,
        }
      }).then(res => {
        this.loading = false
      }).catch(err => {
        this.$message.error(err.msg)
        this.loading = false
      })
    },
    /* 计量单位 */
    formatterUnit (row) {
      return row.dictionaryCategory
        ? row.dictionaryCategory.name
        : "";
    },
    /* 规格型号 */
    formatterAttributes (row, column, cellValue, index) {
      let str = ''
      cellValue.forEach(e => {
        str += e.name + ';'
      });
      return str
    },
    /* 是否炸药 */
    formatterisDynamite (row) {
      if (row.isDynamite === 0) {
        return '否'
      } else {
        return "是"
      }
    }
  },

}
</script>
<style lang="less" scoped>
.el-aside {
  background-color: #fff;
  margin-right: 10px;
  margin-bottom: 37px;
}
.el-main {
  padding: 10px 10px;
  background-color: #fff;
  margin-bottom: 37px;
}
.titleText {
  ul {
    height: 40px;
    background-color: rgba(230, 247, 255, 1);
    padding: 0 20px;
    border: 1px solid rgba(145, 213, 255, 1);
    display: flex;
    align-items: center;
    li {
      margin-right: 10px;
    }
  }
}
/deep/ .cell {
  text-align: center;
}
/deep/.el-table__header .has-gutter tr th .cell {
  border-right: 1px solid #ccc;
}
/deep/.el-table__header .has-gutter tr th {
  &:nth-last-child(2) {
    .cell {
      border-right: none;
    }
  }
}
.pagination {
  position: absolute;
  width: 100%;
  bottom: 0;
  right: 0px;
  padding: 0 30px;
  z-index: 10;
  box-sizing: border-box;
  background-color: #fff;
}
</style>