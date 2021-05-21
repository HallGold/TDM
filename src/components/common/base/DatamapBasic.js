/*import $ from 'jquery'*/
import {Loading} from 'element-ui';
import {mapMutations} from 'vuex'
import localstoreUtil from "@/utils/localstoreUtil";

export default {

    methods: {
        ...mapMutations('datamapStore', ['addDataMap'])
    },

    mounted() {
        //当前路由页面触发数据字典加载，其子组件负责收集


        let getDataMapFun = () => {
            let undisposeedCodes = this.$store.state.datamapStore.undotypecodes;
            if (undisposeedCodes && undisposeedCodes.length > 0) {
                let loading = Loading.service({target: this.$el})
                let thiz = this;

                let xhr = new XMLHttpRequest();
                xhr.open('GET', this.$apicontext + 'permission/dataDictionary/listByActType?typeCodes=' + undisposeedCodes.join(","), false);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.onreadystatechange = function () {
                    // readyState == 4说明请求已完成
                    if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                        // 从服务器获得数据
                        // fn.call(this, xhr.responseText);
                        if (xhr.responseText) {
                            let result = JSON.parse(xhr.responseText);
                            if (result && result.data) {
                                let data = {};
                                result.data.forEach(item => {
                                    data[item.code] = {};
                                    item.appDataList.forEach(child => {
                                        data[item.code][child.code] = child.name
                                    })
                                    data[item.code]['$$disabled'] = item.appDataList.filter(item => item.enabled == 0).map(item => item.code)
                                })
                                thiz.addDataMap(data);
                            }
                        }
                    }
                };
                xhr.send();


                loading.close();
            }
        }


        if (this.$parent && this.$parent.$options.name == 'ElDialog') {

            if (this.$parent.$children[this.$parent.$children.length - 1] == this) {

                getDataMapFun();

            }

        }

        if (this.$route &&
            this.$route.matched.length > 0 &&
            this.$route.matched[this.$route.matched.length - 1].components.default.name == this.$options.name) {


            /*  let uncheckCodes = [];

              let collectDataMapList = (vueComp) => {
                  if (vueComp && vueComp.$props && vueComp.$props.mapTypeCode) {
                      uncheckCodes.push(vueComp.$props.mapTypeCode);
                  }
                  if (vueComp.$children && vueComp.$children.length > 0) {
                      vueComp.$children.forEach(item => {
                          collectDataMapList(item);
                      })
                  }
              }
              collectDataMapList(this);
              console.log("uncheckCodes:", uncheckCodes);*/


            getDataMapFun();

        }


        if (this.$options && this.$options.name == 'IceSelect') {
            if (this.$props && this.$props.mapTypeCode) {
                this.$nextTick(() => {
                    getDataMapFun();
                })

            }
        }

    }
}

