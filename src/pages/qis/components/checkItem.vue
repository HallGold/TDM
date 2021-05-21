<template>
    <div>
        <el-checkbox-group v-model="jymsTags" v-if="isArray" :disabled="formReadonly">
            <el-checkbox  v-for="(item, index) in filterSelectList" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-model="jymsTags" v-else :disabled="formReadonly">
            <el-radio  v-for="(item, index) in filterSelectList" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
    </div>

</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  export default {
    name: "checkItem",
    props: {
      mapTypeCode: '',
      value: [Array, String],
      formReadonly: false
    },
    data () {
      return {
        // jymsTags: this.value
      }
    },
    computed: {
      filterSelectList() {
        if (this.mapTypeCode) {
          return this.getDataMapList()(this.mapTypeCode);
        } else {
          return this.selectList;
        }

      },
      jymsTags: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit("input",val);
        }

      },
      isArray () {
        return Array.isArray(this.jymsTags);
      }
    },
    created() {
      if (this.mapTypeCode) {
        this.addUndoTypeCodes(this.mapTypeCode);
      }
    },
    methods:{
      ...mapMutations('datamapStore', ['addUndoTypeCodes']),
      ...mapGetters('datamapStore', [ 'getDataMapList']),
      change () {
        console.log(this.value)

      }
    },
    watch: {
      jymsTags () {
        // this.$emit('change', this.jymsTags);
      },

    }
  }
</script>

<style scoped>

</style>