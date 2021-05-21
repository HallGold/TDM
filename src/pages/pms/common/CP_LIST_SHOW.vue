<template>
    <div>
        <div class="cpItem" v-for="item in list">
            <el-collapse v-if="item.childrens"  v-model="activeNames" accordion @change="handleChange" :accordion="true">
                <template >
                    <el-collapse-item :name="JSON.stringify(item)" >
                        <template slot="title" :class="{active: currentChildCp.oidCpk==item.oidCpk}">
                            <i class="el-icon-position"></i>{{item.cpName}}（{{item.cpCode}}）
                        </template>
                        <ul class="bj" v-if="item.childrens">
                            <li :class="{active: currentChildCp.oidCpk===bitem.oidCpk}" @click="handleChange(bitem, 1)" v-for="(bitem, index) in item.childrens">{{bitem.cpName}}</li>
                        </ul>
                    </el-collapse-item>
                </template>
            </el-collapse>
            <div v-else class="other" @click="handleChange(item, 1)" :class="{active: currentChildCp.oidCpk==item.oidCpk}">
                <i class="el-icon-position"></i>{{item.cpName}}（{{item.cpCode}}
            </div>
        </div>
        <div class="cpItem">
        </div>
    </div>
</template>

<script>
    export default {
        name: "CP_LIST_SHOW",
        data () {
            return {
              activeNames1: '',
              currentCp: {},
              currentChildCp: {

              }
            }
        },
      computed: {
        activeNames () {
          return this.productData&&this.productData.length>0?this.productData[0].oid: '';
        },
        list () {
          let list = this.productData.filter((c)=>{
            return c.version!=-1;
          })
          return list
        }
      },
        methods: {
            handleChange (val, type) {
              if (type) {
                this.$emit("select", val);
                this.currentChildCp = val;
              } else {
                if (val) {
                  this.currentCp = JSON.parse(val);
                }
                this.currentChildCp = {};
                this.$emit("select", this.currentCp);
              }

            },

        },
      created () {
        this.currentChildCp = (this.productData&&this.productData.length>0)? this.productData[0]:{};
        this.$emit("select", this.currentChildCp);
      },
        watch: {
          productData () {
            this.currentChildCp = (this.productData&&this.productData.length>0)? this.productData[0]:{};
            this.$emit("select", this.currentChildCp);
          }
        },
        props: ['productData']
    }
</script>

<style lang="less" scoped>
    .bj {
        list-style: none;
        li {
            cursor: pointer;
            padding: 10px 0 10px 20px;
        }

    }
    .active {
        color: #00D1B2;
        border-right: 2px solid #0000ff;
    }
    .other {
        cursor: pointer;
        height: 48px;
        line-height: 48px;
    }
</style>