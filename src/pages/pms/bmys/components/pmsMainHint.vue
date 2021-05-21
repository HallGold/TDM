<template>
    <div class="navCon">
        <div class="hint" :style="{background: bgColor, border: borderSty }">
            <template v-for="(item, index) in mannavs">
                <span class="s">{{item.name}}</span>
                <i class="el-icon-right" v-if="index<(mannavs.length-1)"></i>
            </template>
            <span style="color: red;">
                (非涉密表单请勿填写涉密信息)
            </span>


        </div>
    </div>
</template>

<script>
  export default {
    name: "pmsMainHint",
    props: {
      bgColor: {
        default: '#f2f2f2'
      },
      borderSty: {
        default: '1px solid #ddd'
      },
      mannavs: {
        default: [],
        required: true
      }
    }
  }
</script>

<style lang="less" scoped>
    .navCon {
        margin-bottom: 20px;
    }
    .hint {
        width: 100%;
        padding: 8px 16px;
        margin: 0;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        background-color: #fff;
        overflow: hidden;
        opacity: 1;
        display: flex;
        align-items: center;
        transition: opacity .2s;
        height: 40px;
        line-height: 40px;
        color: #333;
        span {
            font-size: 14px;
        }
        i {
            margin: 0 5px;
            font-size: 18px;
            color: #666;
        }
    }
</style>