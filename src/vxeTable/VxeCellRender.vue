<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "VxeCellRender",
  props: {
    field: Object,
    data: Object
  },
  methods: {
    ...mapMutations("datamapStore", ["addUndoTypeCodes", 'addUndoCusTypeCodes']),
    ...mapGetters("datamapStore", ["getDataMap", 'getCusDataMap'])
  },
  render(h) {
    if (this.field.renderCell) {
      //自定义渲染
      return <div>{this.field.renderCell(h, this.data)}</div>;
    } else if (this.field.formatter) {
      //格式化内容
      return <span>{this.field.formatter(this.data.row)}</span>;
      /*return <span>{this.datamap[this.data.row[this.field.code]]}</span>*/
    } else if (this.field.mapTypeCode||this.field.cusMapTypeCode) {
      //数据字典
      return <span>{this.datamap[this.data.row[this.field.code]]}</span>;
    } else if (this.field.isShowTag) {
      //显示红色标记
      return (
        <div style="display:flex;">
          <div>{this.data.row[this.field.code]}</div>
          <el-tooltip
            class="item"
            effect="light"
            content={
              !this.field.showTagName
                ? this.data.row.labelContent
                : this.data.row[this.field.showTagName]
            }
            placement="top"
          >
            <div
              vShow={
                this.data.row[this.field.showTagName] ||
                this.data.row.labelContent
              }
              style={{
                "margin-left": "5px",
                width: 0,
                height: 0,
                "border-top": "10px solid red",
                "border-left": "10px solid transparent",
                cursor: "pointer"
              }}
            ></div>
          </el-tooltip>
        </div>
      );
    } else {
      //直接显示
      return <span>{this.data.row[this.field.code]}</span>;
    }
  },
  created() {
    this.addUndoTypeCodes(this.field.mapTypeCode);

      if (this.field.cusMapTypeCode) {
          this.addUndoCusTypeCodes(this.field.cusMapTypeCode);
      }
  },
  computed: {
    datamap() {
        if (this.field.mapTypeCode) {
            return this.getDataMap()(this.field.mapTypeCode) || {};
        }
        // 自定义的解析
        if (this.field.cusMapTypeCode) {
            return this.getCusDataMap()(this.field.cusMapTypeCode) || {};
        }

    }
  }
};
</script>


<style scoped>
</style>
