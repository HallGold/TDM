<template>
        <vxe-table-column show-overflow="title" :field="col.code" :title="col.label" v-if="!col.hidden" :width="col.width" :cell-render="{name: 'mapTypeCode', mapTypeCode: col.mapTypeCode?col.mapTypeCode: ''}">
            <template v-if="col.columns">
                <qis-vxe-columns v-for="(item, index) in col.columns"
                                 :key="index"
                                 :col="item"></qis-vxe-columns>
            </template>
        </vxe-table-column>

        <!--<vxe-table-column :field="col.code" :title="col.label" v-if="!col.hidden&&!col.mapTypeCode" :width="col.width">-->
            <!--<template v-if="col.columns">-->
                <!--<qis-vxe-columns v-for="(item, index) in col.columns"-->
                                 <!--:key="index"-->
                                 <!--:col="item"></qis-vxe-columns>-->
            <!--</template>-->
        <!--</vxe-table-column>-->
</template>
<script>
  export default {
    name: "qisVxeColumns",
    props: {
      col: {
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        count: 1
      }
    },
    // render: function (h) {
    //     let a = 1;
    //     let b = `<vxe-table-column field="name" title="${this.item.label}"></vxe-table-column>`
    //     let c = this.factorial(this.item.columns)
    //     console.log(c)
    //     // 循环
    //   return <vxe-table-column field="name" title={this.item.label} domPropsInnerHTML={`hello ${this.count}.`}/>
    //
    //
    // },
    created () {
      console.log(this.item, '13156');
    },
    methods:{
      factorial(n) {
        console.log(n, 'n.columns')
        // let dom = `<vxe-table-column field="`+name+`" title="`+title+`"></vxe-table-column>`
        if (n==undefined||n==null||n.length<=0) return '';
        if (n.length>=0) {
          let str = '';
          n.forEach((c)=>{
            str+=`<vxe-table-column field="`+c.code+`" title="`+c.label+`">${this.factorial(n.columns)}</vxe-table-column>`
          })
          console.log(str)
          return str;
        }
      }

    }
  }
</script>

<style lang="less">
    .vxe-table .vxe-cell div{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>