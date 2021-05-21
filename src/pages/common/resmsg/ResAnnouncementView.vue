<template>
    <div class="grid-container" v-show="show">
        <el-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="show"
                   width="80%" append-to-body :close-on-click-modal="false" v-if="mode == 'dialog'">
            <div class="viewPage">
                <div class="viewTitle">{{data.title}}</div>
                <div class="viewContent" v-html="data.content"></div>
            </div>
        </el-dialog>
        <div  class="viewPage" v-if="mode == 'page'">
            <div class="viewTitle">{{data.title}}</div>
            <div class="viewContent" v-html="data.content"></div>
        </div>

        <res-announcement-view title="公告预览" ref="viewann"></res-announcement-view>
    </div>
</template>

<script>
    export default {
        name: "ResAnnouncementView",
        props:{
            data:Object,
            title:String,
            mode  :{
                type: String,
                default: 'dialog',
                validator: function (value) {
                    return ['page', 'dialog'].indexOf(value) !== -1
                }
            }
        },
        data(){
            return {
                show:false
            }
        },
        methods:{
            open(data){
                if(data){
                    this.data = data;
                }
                this.show = true;
            }
        }
    }
</script>

<style scoped>
    .viewPage{
        text-align: center;
    }
    .viewTitle{
        font-size: 18px;
    }
    .viewContent{
        text-align: left;
    }
</style>