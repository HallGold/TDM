<template>
    <span>
        <slot :oldanalysisVal="oldanalysisVal"></slot>
    </span>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: "analysisMapTypeCode",
    props: {
      // 需要解析的类型值
      mapTypeCode: {
        type: String,
        default: '',
        required: true
      },
      // 需要解析的值
      analysisValue: {
        type: String,
        default: '',
        required: true
      }
    },
    data () {
      return {

      }
    },
    computed: {
      datamap() {
        // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
        return this.getDataMap()(this.mapTypeCode);
      },
      // 解析后的值
      oldanalysisVal () {
        return this.datamap[this.analysisValue]
      }
    },
    created () {
      if (this.mapTypeCode) {
        this.addUndoTypeCodes(this.mapTypeCode);
      }
    },
    methods: {
      ...mapMutations('datamapStore', ['addUndoTypeCodes']),
      ...mapGetters('datamapStore', ['getDataMap']),
    }
  }
</script>

<style scoped>

</style>