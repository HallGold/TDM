<template>
    <div class="msgContainer" v-if="msgdata" :style="{height: Height}">
        <div class="line"></div>
        <div class="lab">
            <div class="_right">
                <template v-for="(item, index) in bottomButtons" v-if="(item.isShow==null||item.isShow==undefined)?true:item.isShow">
                    <span v-if="item.text" :style="{color: item.color,fontSize: item.size}" @click="item.callback">{{item.text}}</span>
                    <i v-else  :style="{color: item.color,fontSize: item.size}" :class="item.icon" @click="item.callback"></i>
                </template>
            </div>
            <div class="_left">
                {{title}}
            </div>
        </div>
        <ul class="ullist">
            <li v-for="(item, index) in labelName" :key="index">
                <el-row>
                    <el-col :span="10">
                        <label for="">{{item.name}}：</label>
                    </el-col>
                    <el-col :span="14">
                        <el-progress v-if="item.isPress" :text-inside="true" :stroke-width="26" :percentage="msgdata[item.label]?msgdata[item.label]*1:0"></el-progress>
                        <span v-else-if="item.isDownload&&msgdata[item.attaId]" @click="handleDownload(msgdata[item.attaId])" class="down">{{item.label}}</span>
                        <span v-else>{{item.isZf?item.handleStr(msgdata[item.label]):(msgdata[item.label]?msgdata[item.label]:'-')}}</span>
                    </el-col>
                </el-row>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: "PmsProjectMsg",
    props: {
      msgdata: {
        required: true,
        default: function () {
          return {}
        }
      },
      labelName: {
        type: Array
      },
      bottomButtons: {
        type: Array
      },
      title: {
        type: String,
      },
        Height: {
          default: '310px'
        }
    },
    created() {
      console.log('----------', this.msgData)
    },
    watch: {
      msgData () {
        console.log('----------', this.msgData)
      }
    },
    data() {
      return {}
    },
    methods: {
      handleDownload (id) {
        this.$downloadFile(id);
      }
    }
  }
</script>

<style lang="less" scoped>
    .line {
        height: 5px;
        margin: 5px 10px;
        background: #eeeeee;
    }

    .msgContainer {
        position: absolute;
        bottom: 0;
        height: 310px;
        left: 5px;
        right: 5px;
        overflow: auto;
        z-index: 100;
    }

    .lab {
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
        background: #00D1B2;
        color: #ffffff;
        font-size: 14px;
        border-radius: 2px;
        &::after {
            content: "";
            display: block;
            clear: both;
        }
        ._right {
            float: right;
            line-height: 35px;
            cursor: pointer;
            i {
                margin-left: 10px;
                vertical-align: middle;
            }
        }
        ._left{
            overflow: hidden;
        }
    }

    .ullist {
        list-style: none;
        margin-top: 15px;
        li {
            margin-bottom: 10px;
            label {
                display: inline-block;
                width: 100%;
                text-align: right;
                font-size: 14px;
                color: #555;
            }
            span {
                font-size: 14px;
                margin-left: 5px;
            }
        }
    }
    .down {
        color: #28ceff;
        cursor: pointer;
    }
    .down:hover {
        text-decoration: underline;
    }
</style>