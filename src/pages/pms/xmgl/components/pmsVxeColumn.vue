<template>
    <div>
        <span v-if="datamap">{{datamap[value]}}</span>
        <span v-else>{{value}}</span>
    </div>
</template>
<script>
  import {mapMutations,mapGetters} from 'vuex'

  export default {
    name: 'IceTableColumn',
    props: {
      value: {
        default: '',
      },
      mapTypeCode: String,
      showTips: {
        type: Boolean,
        default: false
      },
      renderCell: {
        type: Function,
        default: null
      }
    },
    methods: {
      ...mapMutations('datamapStore', ['addUndoTypeCodes']),
      ...mapGetters('datamapStore', ['getDataMap']),
    },
    created () {
      this.addUndoTypeCodes(this.mapTypeCode);
    },
    computed: {
      datamap() {
        console.log(this.value)
        // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
        return this.getDataMap()(this.mapTypeCode);
      }
    },

  }

</script>
