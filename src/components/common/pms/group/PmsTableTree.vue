<template>
    <div>
        <el-dialog
                :append-to-body="true"
                :center="true"
                v-dialogDrag
                :visible.sync="dialogConfig.visible"
                :title="dialogConfig.title"
                :width="dialogConfig.width"
                :modal="dialogConfig.modal"
                :height="dialogConfig.height"
                :before-close="handleClose">
            <el-container>
                <el-aside width="250px">
                    <el-card class="box-card">
                        <ice-custom-tree :unbrid="unbrid" :transfer="transfer.treeData" @handleCallback="handleCallbackTree"></ice-custom-tree>
                    </el-card>
                </el-aside>
                <el-main class="main">
                    <ice-query-grid :data-url="tableObject.api"
                                    :exportTitle="tableObject.title"
                                    :query="tableObject.query"
                                    :operations-width="200"
                                    :columns="tableObject.columns"
                                    :buttons="tableObject.buttons"
                                    :operations="tableObject.operations"
                                    :chooseItem="tableObject.chooseItem"
                                    :total="tableObject.total"
                                    @selection-change="handleSectRow"
                                    ref="grid">
                    </ice-query-grid>
                </el-main>
            </el-container>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button @click="handleClose">关闭</el-button>
                <el-button type="primary" v-if="this.tableObject.chooseItem!=='single'" @click="handleConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import IceCustomTree from '../IceCustomTree';
    import IceQueryGrid from '../../base/IceQueryGrid';
    import IceDialog from "../..//base/IceDialog";
  export default {
    name: "PmsTableTree",
    props: {
      transfer: {
        required: true,
        type: Object
      },
      // 下拉框宽度
      Width: {
        default: '200px',
      },
      // 下拉框最大高度
      maxHeight: {
        default: '350px'
      },
      // 选择框 input宽度
      inpWidth: {
        default: '200px'
      },
      // 触发下拉行为 两个值 默认 hover  / click
      trigger: {
        default: 'hover'
      },
      tableObject: {
        type: Object,
        required: true
      },
      dialogConfig: {
        type: Object,
        required: true
      },
      unbrid: {
        default: false,
      }
    },
    data () {
      return {
        visible: false,
        title: '123',
        data: []
      }
    },
    methods: {
      refresh () {
        this.$refs.grid.refresh();
      },
      handleSectRow (data, hah) {
        console.log('handleSectRow')
        if (this.tableObject.chooseItem==='single') {
          this.$emit('handleCallback', data);
          this.handleClose();
        } else {
          this.data = data;
        }
      },
      handleCallbackTree (data) {
        this.$emit('handleTreeCallback', data);
      },
      handleClose () {
        console.log('close')
        this.$emit('handleClose')
      },
      handleConfirm () {
        console.log('handleConfirm')
        this.handleClose();
        this.$emit('handleCallback', this.data)
      }
    },
    components: {
      IceCustomTree,
      IceQueryGrid,
      IceDialog
    }
  }
</script>

<style lang="less" scoped>
    .tree {
        padding: 20px;
    }
    .main {
        padding: 0 20px;
    }
</style>