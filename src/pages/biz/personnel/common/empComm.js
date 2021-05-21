export default {
    data(){
        return{

            typeId:'',//获取数据字典值的参数
            isTrue:true,
            code:'',

            EMP:{
                //系统名称
                sysCodeArr:[],
                //角色
                roleCodeArr:[],
                //系统权限
                sysPermissionArr:[],
                //数据字典树形数据
                treeData:[],
                //特殊字符
                reg:/[\\$@#%&\\*`~!\\^\\(\\)\\[\\}<>《》_——：；“”‘’'":;！\\{【】￥……，。||、、.,/\]?？+=\-]/
            }
        }
    },
    methods:{
        /**
         * 初始化权限列表字段数组
         */
        initPermissionList(){
            this.$axios.get("/biz/bizEmpAuthorized/list?current=1&size=10000").then(res => {
                if (res.data.records && res.data.records.length > 0) {
                    res.data.records.forEach(item => {
                        let sysCodeArr = {};
                        let roleCodeArr = {};
                        let sysPermissionArr = {};
                        sysCodeArr.label = item.systemName;
                        sysCodeArr.value = item.systemCode;
                        roleCodeArr.label = item.roleName;
                        roleCodeArr.value = item.roleCode;
                        sysPermissionArr.label = item.authorized;
                        sysPermissionArr.value = item.authorized;
                        this.EMP.sysCodeArr.push(sysCodeArr);
                        this.EMP.roleCodeArr.push(roleCodeArr);
                        this.EMP.sysPermissionArr.push(sysPermissionArr);
                    })
                }
            });
        },
        /**
         * 获取系统名称
         * @param code
         * @returns {*}
         */
        getSystemName(code){
            for(let i=0;i<this.EMP.sysCodeArr.length;i++){
                if(this.EMP.sysCodeArr[i].value==code){
                    return this.EMP.sysCodeArr[i].label;
                }
            }
            return '';
        },
        /**
         * 获取角色名称
         * @param code
         * @returns {*}
         */
        getRoleName(code){
            for(let i=0;i<this.EMP.roleCodeArr.length;i++){
                if(this.EMP.roleCodeArr[i].value==code){
                    return this.EMP.roleCodeArr[i].label;
                }
            }
            return '';
        },
        /**
         * 初始化数据字典树
         */
        initDatamapListTree(){
             this.$axios.get("/permission/dataDictionary/get_by_tree").then(res=>{
                this.EMP.treeData = res.data;
            })
        },
        /**
         * 获取typeId--用于加载数据字典数据值
         * @param code
         * @returns {*}
         */
        getTypeId(arr){
            if(this.isTrue){
                for(let i=0;i<arr.length;i++){
                    if(arr[i].code == this.code){
                        this.typeId = arr[i].oid;
                        this.isTrue = false;
                        return this.typeId;
                    }else{
                        if(arr[i].children && arr[i].children.length>0){
                            this.getTypeId(arr[i].children);
                        }
                    }
                }
            }
            return this.typeId;
        },
        async getDataMapListData(code){
            try {
                this.isTrue = true;
                this.code = code;
                this.getTypeId(this.EMP.treeData);
                const res = await this.$axios.get("/permission/dataDictionary/listByTypeId",{params:{typeId:this.typeId}});
                return res.data;
            }catch (e) {
                if(e.msg){
                    this.$message.error(e.msg);
                }else{
                    this.$message.error(e);
                }
                return [];
            }
        },
        /**
         * 批量获取名称
         * @param arr
         */
        getName(arr){
            arr.forEach(item=>{
                if(!item.systemName){
                    item.systemName = this.getSystemName(item.systemCode);
                }
                if(!item.roleName){
                    item.roleName = this.getRoleName(item.roleCode);
                }
            });
        },
        /**
         * 删除
         * @param arr
         * @param targetList
         */
        delList(arr,targetList){
            for (let i = 0; i < targetList.length; i++) {
                arr.splice(arr.indexOf(targetList[i]), 1);
            }
        },
        /**
         * 数组去重，注意--数组push进去的字段顺序要一致，如:arr:[{a:1,b:2}],push时对象不可为{b:2,a:1}
         * @param arr
         * @returns {boolean}
         */
        listDistinct(arr) {
            if (arr.length > 1) {
                let arrCopy = JSON.stringify(arr);
                for (let i = 0; i < arr.length; i++) {
                    if (arrCopy.replace(JSON.stringify(arr[i]), '').indexOf(JSON.stringify(arr[i])) > -1) {
                        return false
                    }
                }
                return true;
            }
            return true;
        },
    }
}