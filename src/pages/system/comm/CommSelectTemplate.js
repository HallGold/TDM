export default {
    props: {
        deptTab: {
            //部门tab
            type: Boolean,
            default: false
        },
        userTab: {
            //用户tab
            type: Boolean,
            default: true
        },
        roleTab: {
            //角色tab
            type: Boolean,
            default: false
        },
        positionTab: {
            //岗位tab
            type: Boolean,
            default: false
        },
        multiple: {
            //是否多选
            type: Boolean,
            default: false
        },
        deptOnlyLeaf: {
            //多选部门时是否只取叶子结点
            type: Boolean,
            default: false
        }, deptIncludeHalf: {
            //多选部门时是否包括半选节点
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            tabs: [],
            activeName: ``,
            dialogVisible: false,
            users: null
        };
    },
    methods: {
        initControls() {
            //初始化标签页
        },
        open(params) {
            this.dialogVisible = true;
            this.initTabs();
            this.initData(params);
        },
        initData(params) {
            if (!!params && !!params.users) {
                //[{userCode:xxx,deptCode:xxx}]
                this.users = params.users;
            }
        },
        initTabs() {
            let arr = [
                {name: "deptTab", tab: this.deptTab, position: "top"},
                {name: "userTab", tab: this.userTab, position: "right"},
                {name: "roleTab", tab: this.roleTab, position: "bottom"},
                {name: "positionTab", tab: this.positionTab, position: "left"}
            ];
            for (let i in arr) {
                if (!!arr[i].tab) {
                    this.tabs[arr[i].name] = true;
                    if (this.activeName == ``) {
                        this.activeName = arr[i].name;
                    }
                }
            }
        },
        enter() {
            let returnValue = {};
            if (this.tabs.deptTab && !!this.$refs.depts) {
                returnValue.depts = this.$refs.depts.getResult(this.deptOnlyLeaf, this.deptIncludeHalf);
            }
            if (this.tabs.userTab && !!this.$refs.users) {
                //user格式[多选] {deptCode:[{user}]}
                returnValue.users = this.$refs.users.getResult();
            }
            if (this.tabs.roleTab && !!this.$refs.roles) {
                //user格式[多选] {deptCode:[{user}]}
                returnValue.roles = this.$refs.roles.getResult();
            }
            this.closeHandler(returnValue);
            this.close();
        },
        closeHandler(data) {
            this.$emit("beforeClose", data);
        },
        close() {
            this.destroy();
            this.dialogVisible = false;
        },
        destroy() {
            this.tabs = [];
            this.activeName = ``;
        },
    },
    mounted() {
    }
}