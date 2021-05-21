<template>
    <el-container>
        <div class="container" style="width: 100%">
            <div class="el-button-group" style="right: 3%;position: fixed;z-index: 10;">
                <div>
                    <el-button type="info" @click="goz1Btn">返回</el-button>
                </div>
            </div>
            <div class="detail-ctx">
                <el-row class="detail-row">
                    <el-col :span="8"><div><span>模块名:</span><span>{{this.mainData.moduleName}}</span></div></el-col>
                    <el-col :span="8"><div><span>子模块名称:</span><span>{{this.mainData.subModuleName}}</span></div></el-col>
                    <el-col :span="8"><div><span>资源名:</span><span>{{this.mainData.resourceName}}</span></div></el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="8"><div><span>调用方法名:</span><span>{{this.mainData.methodName}}</span></div></el-col>
                    <el-col :span="8"><div><span>调用方法包:</span><span>{{this.mainData.methodPath}}</span></div></el-col>
                    <el-col :span="8"><div><span>请求相对路径:</span><span>{{this.mainData.requestUri}}</span></div></el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="24"><div><span>请求全路径:</span><span>{{this.mainData.requestUrl}}</span></div></el-col>
                </el-row>
                <el-row class="detail-row">
                    <el-col :span="8"><div><span>操作用户:</span><span>{{this.mainData.usercode}}</span></div></el-col>
                    <el-col :span="8"><div><span>客户端IP:</span><span>{{this.mainData.clientIp}}</span></div></el-col>
                    <el-col :span="8"><div><span>调用结果:</span><i class="el-icon-time"></i>{{this.mainData.createDate}}
                        <span v-if="this.mainData.invokeStatus == '成功'" class="el-tag el-tag--success">{{this.mainData.invokeStatus}}</span>
                        <span v-else class="el-tag el-tag--danger">{{this.mainData.invokeStatus}}</span>
                    </div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="24"><div>
                        <el-table :data="args"
                                  style="width: 100%;margin-bottom: 20px;"
                                  border
                                  row-key="id">
                            <el-table-column
                                    prop="id"
                                    label="参数临时分组序号">
                            </el-table-column>
                            <el-table-column
                                    prop="code"
                                    label="编码"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="label"
                                    label="标签"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="value"
                                    label="值">
                            </el-table-column>
                        </el-table>
                    </div></el-col>
                </el-row>
            </div>
        </div>
    </el-container>
</template>

<script>
    export default {
        name: "ResAuditLogDetail",
        data(){
            return {
                mainData:{},
                args:[]
            }
        },
        methods:{
            goz1Btn(){
                this.$router.go(-1);
            },
            pushAll(s,d){
                d.forEach(item=>{
                    s.push(item);
                });
                return s;
            },
            parseArgsType(a){
                if(typeof(a.value) == 'string'){
                    return 'string';
                }
                if(typeof(a.value) == 'object' && typeof(a.value.push) == 'function'){
                    return 'array';
                }
                if(typeof(a) == 'object' && typeof(a.value) == 'undefined'){
                    return 'object';
                }
                return 'undefined';
            },
            parseData(da){
                var ctx = [];
                var index = (da.id?da.id:1)*1000;
                for(let k in da){
                    let cd = da[k];
                    let type = this.parseArgsType(cd);
                    if(type == 'string'){
                        cd.id = index++;
                        ctx.push(cd);
                    }else if(type == 'array'){
                        cd.id = index++;
                        let cdata = {id:cd.id , code:k, label:'', value:'array', children:[]};
                        cd.value.forEach(item =>{
                            item.id = cdata.id+0.01;
                            console.log(item)
                            cdata.children = this.pushAll(cdata.children,this.parseData(item));
                        });
                        ctx.push(cdata);
                    }else if(type == 'object'){
                        console.log('=======')
                        console.log(cd)
                        console.log('=======')
                        cd.id = index++;
                        let cdata = {id:cd.id , code:k, label:'', value:'object', children:[]};
                        this.parseData(cd).forEach(item =>{
                            cdata.children.push(item);
                        });
                        ctx.push(cdata);
                    }
                }
                return ctx;
            },
            parseArgs(pArgs){
                var ctx = [];
                var index = 1;
                for(let k in pArgs){

                    let cd = pArgs[k];
                    let type = this.parseArgsType(cd);
                    if(type == 'string'){
                        cd.id = index++;
                        ctx.push(cd);
                    }
                    if(type == 'array'){
                        cd.id = index++;
                        let cdata = {id:cd.id , code:k, label:'', value:'array', children:[]};
                        cd.value.forEach(item =>{
                            item.id = cdata.id+0.01;
                            cdata.children = this.pushAll(cdata.children,this.parseData(item));
                        });
                        ctx.push(cdata);
                    }
                    if(type == 'object'){
                        cd.id = index++;
                        let cdata = {id:cd.id , code:k, label:'', value:'object', children:[]};
                        this.parseData(cd).forEach(item =>{
                            cdata.children.push(item);
                        });
                        ctx.push(cdata);
                    }
                }
                return ctx;
            }
        },
        mounted(){
            let id = this.$route.query['id'];
            if( !(id && id.length > 0) ){
                return;
            }
            this.$axios.get("/resources/ResAuditLog/get", {params: {id: id}}).then(result => {
                let data = Object.assign({},result.data);
                this.mainData = data;
                // this.$set(this.mainData,data);
                console.log(this.mainData)
                let tempArgs = JSON.parse(result.data.args);
                if(typeof(tempArgs.args) != undefined){
                    tempArgs = tempArgs.args;
                }
                this.args = this.parseArgs(tempArgs);
            });
        }
    }
</script>

<style scoped>
    .detail-row{font-size: 15px;padding: 2px;border-bottom: solid 1px #000000;margin-bottom: 15px;}
</style>