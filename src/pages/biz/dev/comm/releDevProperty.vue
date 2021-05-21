<template>
    <div style="width: 100%">
        <ice-grid-layout :columns="1" name="承载设备">
            <div class="releContent" v-if="isMode">
                <div class="text">安装介质</div>
                <ice-query-grid :gridData="modeData"
                                :columns="columns"
                                ref="mediaGrid"
                                :minHeight="200"
                                :pagination="false"
                                :chooseItem="chooseItem"
                                @selection-change="modeRows"
                                :buttons="buttonsMode"></ice-query-grid>
            </div>
            <div class="releContent" v-if="isAddDev">
                <div class="text">承载设备</div>
                <ice-query-grid :gridData="devData"
                                :columns="columns"
                                ref="devGrid"
                                :minHeight="200"
                                :chooseItem="chooseItem"
                                :pagination="false"
                                @selection-change="devRows"
                                :buttons="buttons"></ice-query-grid>
            </div>
        </ice-grid-layout>
        <dev-select ref="devSelect" v-if="devSelectShow"
                    :multiple="true"
                    :on-close-handler="selectOverHandler"></dev-select>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import DevSelect from "../devSelect";
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "releDevProperty",
        components: {
            DevSelect,
            IceGridLayout,
            IceQueryGrid,
        },
        props: {
            isAddDev: {//是否显示关联设备
                type: Boolean,
                default: true
            },
            isMode: {//是否显示安装介质
                type: Boolean,
                default: false
            },
            /*isAdd: {//是否为新增
                type: Boolean,
                default: true,
                required: true
            },*/
            isEdit: {//是否为编辑状态
                type: Boolean,
                default: false
            },
            mainData: Object
        },
        mixins: [bizComm, devComm, renderer],
        data() {
            return {
                columns: [],
                buttonsMode: [],
                buttons:[],
                devSelectShow: false,    //设备选择弹窗的开关属性
                devList: [],             //关联设备弹窗选择的数据集合
                modeList: [],           //安装介质弹窗选择的数据集合
                dependDevId: 'dependDevId',              //用于关联设备和安装介质的参数
                modeData:[],            //安装介质table列的数据集合
                devData:[],             //关联设备table列的数据集合
                isModeData:false,       //是否为安装介质新增
                isDevData:false,        //是否为关联设备新增
                chooseItem:this.isEdit?'multiple':'single'     //是否为多选
            }
        },
        methods: {
            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        data[i].devId = _this.mainData.commDTO.oid;
                        data[i].dependDevId = data[i].oid;
                        data[i].dependDevType = data[i].category;
                        data[i].oid = null;
                        if (_this.isDevData) {
                            if (_this.findSameRowByCode(_this.devData, data[i].dependDevId, _this.dependDevId) == -1) {
                                let obj = {};
                                obj.dependType = _this.ENUMS.DEPEND_TYPE_DATA[0].code;
                                Object.assign(obj,data[i]);
                                _this.devData.push(obj);
                            }
                        } else {
                            if (_this.findSameRowByCode(_this.modeData, data[i].dependDevId, _this.dependDevId) == -1) {
                                let obj = {};
                                obj.dependType = _this.ENUMS.DEPEND_TYPE_DATA[1].code;
                                Object.assign(obj,data[i]);
                                _this.modeData.push(obj);
                            }
                        }
                    }
                    this.$nextTick(()=>{
                        this.asyncData();
                        resolve();
                        this.devSelectShow = false;
                    });
                });
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                if(this.isAddDev&&this.isEdit){
                    this.buttons = [
                        Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.addDev}),
                        Object.assign({}, this.COMM_ENUMS.BUTTON.DELETE, {callback: this.deleteDev})];
                }
                if(this.isMode&&this.isEdit){
                    this.buttonsMode = [
                        Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.addMedia}),
                        Object.assign({}, this.COMM_ENUMS.BUTTON.DELETE, {callback: this.deleteMedia})];
                }
                let _this = this;
                this.columns = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {
                        label: '设备名称', code: 'name', renderCell(h, data) {
                            return data.row.name;
                        }
                    },
                    {
                        label: '设备类型', code: 'category', renderCell(h, data) {
                            return _this.onCategoryRenderer(data.row.category);
                        }
                    },
                    {
                        label: '设备子类', code: 'childType', renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {
                        label: '资产编号', code: 'sn', renderer(h, data) {
                            return data.row.sn;
                        }
                    },
                    {
                        label: '保密编号', code: 'secretSn', renderer(h, data) {
                            return data.row.secretSn;
                        }
                    }];
                if(this.mainData.commDTO.oid){
                    this.mainDataFormat(this.mainData);
                }
                this.initPageOver();
            },
            addItem(){
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            deleteItem(){
                if(this.isDevData){
                    if (this.devList.length > 0) {
                        this.deletes(this.devData, this.devList);
                        this.devList = [];
                    } else {
                        this.$message.warning('请选择需要删除的关联设备');
                    }
                }else{
                    if (this.modeList.length > 0) {
                        this.deletes(this.modeData, this.modeList);
                        this.modeList = [];
                    } else {
                        this.$message.warning('请选择需要删除的安装介质');
                    }
                }
            },
            /**
             *
             */
            asyncData(){
                this.mainData.dependDTOList = [];
                if(this.isAddDev&&this.isMode){
                    this.mainData.dependDTOList.push(...this.devData);
                    this.mainData.dependDTOList.push(...this.modeData);
                }else if(this.isAddDev){
                    this.mainData.dependDTOList.push(...this.devData);
                }else{
                    this.mainData.dependDTOList.push(...this.modeData);
                }
            },
            /**
             * 关联设备或安装介质--删除
             * */
            deleteDev() {
                this.isDevData = true;
                this.isModeData = false;
                this.$nextTick(()=>{
                    this.deleteItem();
                });
            },
            /**
             * 关联设备或安装介质--新增
             */
            addDev() {
                this.isDevData = true;
                this.isModeData = false;
                this.$nextTick(()=>{
                    this.addItem();
                });
            },
            /**
             * 安装介质--新增
             */
            addMedia(){
                this.isDevData = false;
                this.isModeData = true;
                this.$nextTick(()=>{
                    this.addItem();
                });
            },
            /**
             * 安装介质--删除
             */
            deleteMedia(){
                this.isDevData = false;
                this.isModeData = true;
                this.$nextTick(()=>{
                    this.deleteItem();
                });
            },
            /**
             * 关联设备--列表多选框返回所选择的行信息
             */
            devRows(rows) {
                this.devList = rows;
            },
            /**
             * 安装介质--列表多选框返回所选择的行信息
             */
            modeRows(rows){
                this.modeList = rows;
            },
            /**
             * 数据格式化
             * @param data
             */
            mainDataFormat(data) {
                let _this = this;
                if (data.dependDTOList) {
                    let arrDev = [];
                    let arrMode = [];
                    data.dependDTOList.forEach(item => {
                        let obj = {};
                        if(item.dependDevDTO){
                            obj.name = item.dependDevDTO.commDTO.name;
                            obj.category = item.dependDevDTO.commDTO.category;
                            obj.childType = item.dependDevDTO.commDTO.childType;
                            obj.sn = item.dependDevDTO.commDTO.sn;
                            obj.secretSn = item.dependDevDTO.commDTO.secretSn;
                            obj.devId = item.devId;
                            obj.dependDevId = item.dependDevId;
                            obj.oid = item.oid;
                            obj.dependType = item.dependType;
                            if(_this.ENUMS.DEPEND_TYPE_DATA[0].code == item.dependType){
                                arrDev.push(obj);
                            }
                            if(_this.ENUMS.DEPEND_TYPE_DATA[1].code == item.dependType){
                                arrMode.push(obj);
                            }
                        }
                    });
                    if(this.isAddDev){
                        this.devData = arrDev;
                    }
                    if(this.isMode){
                        this.modeData = arrMode;
                    }

                }
            }
        },
        async mounted() {
            //requestCategoryData()--初始化设备类型
            Promise.all([this.requestCategoryData(), this.requestDependTypeData()]).then(this.initControls);
        }
    }
</script>

<style scoped>
    .releContent {
        display: flex;
        align-items: center;
    }

    .text {
        width: 70px;
    }
</style>