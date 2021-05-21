<template>
    <div class="tags" v-if="showTags"><!---->
        <ul ref="tagsul">
            <li class="tags-home" title="返回首页" @click="$router.push('/home')">
                <i class="el-icon-s-home"></i>
            </li>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index" @dblclick="closeTags(index)">
                    <router-link :to="{path:item.path,params: {$tag_click:true}}" class="tags-li-title" :title="item.title">
                        {{item.title}}
                    </router-link>
                    <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>

        <!-- <el-tabs  type="card" closable >&lt;!&ndash;@tab-remove="closeTags"&ndash;&gt;
             <el-tab-pane
                     v-for="(item, index) in tagsList"
                     :key="index"
                     :label="item.title"
                     :name="item.path">
                 {{item.content}}
             </el-tab-pane>
         </el-tabs>-->


        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary" unauth>
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapState} from 'vuex';

    export default {
        data() {
            return {
                //tagsList: []
            }
        },
        methods: {
            ...mapMutations('menuStore', ['setTagsList', "getTagsList", 'addTags', 'shiftTag',
                , 'closeTag', 'closeAllTags', 'closeOtherTags']),
            ...mapGetters("permissionStore", ["getPagePermissionByUrl"]),
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {

                this.closeTag(index);
                let item;
                if (this.tagsList[index]) {//检查当前位置是否还存在tag，不存在向前移动一位
                    item = this.tagsList[index]
                } else {
                    if ((index - 1) > -1) {
                        item = this.tagsList[index - 1]
                    }
                }

                if (item) {
                    item.path !== this.$route.fullPath && this.$router.push(item.path);
                } else {
                    //没有tag则跳转首页
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll() {
                this.closeAllTags();
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOther() {
                this.closeOtherTags(this.$route.fullPath)
            },
            // 设置标签
            setTags(route, menu) {
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath
                })
                if (!isExist) {
                    let $ul = this.$refs['tagsul'];
                    if ($ul) {
                        let length = parseInt($ul.offsetWidth / 110);
                        if (this.tagsList.length >= length) {
                            this.shiftTag();
                        }
                    }
                    if (route.params.$index_title) {
                        route.meta.title = route.params.$index_title;
                    }
                    let exitIndex = this.tagsList.findIndex(c=>{
                        return c.sortpath === route.path
                    })
                    if (exitIndex>=0) {
                        let obj = {
                            title: menu.name ? menu.name : route.meta.title,
                            path: route.fullPath,
                            sortpath: route.path,
                            name: route.matched[route.matched.length - 1].components.default.name,
                            refresh: route.meta.refresh,
                            tagClick: route.params.$tag_click
                        };
                        this.tagsList.splice(exitIndex, 1, obj);
                        this.setTagsList(this.tagsList);
                        // window.location.reload();
                        return
                    }
                    this.addTags({
                        title: menu.name ? menu.name : route.meta.title,
                        path: route.fullPath,
                        sortpath: route.path,
                        name: route.matched[route.matched.length - 1].components.default.name,
                        refresh: route.meta.refresh,
                        tagClick: route.params.$tag_click
                    })


                } else {
                    let tag = this.tagsList.find(item => {
                        return item.path === route.fullPath;
                    });
                    tag.tagClick = route.params.$tag_click;
                }
                // this.setTagsList(this.tagsList);
            },
            handleTags(command) {
                command === 'other' ? this.closeOther() : this.closeAll();
            },
            getPathRoot(path) {
                if (!path) {
                    return "";
                }

                if (path.indexOf("?") != -1) {
                    return path.split("?")[0]
                }
                return path;
            },
            getPageIdByUrl(url) {
                const page = this.getPagePermissionByUrl()(url);
                if (page) {
                    return page.pageId;
                }
                return ''
            }
        },
        computed: {
            ...mapState("menuStore", ["tagsList"]),
            ...mapGetters('menuStore', ['flatMenus']),
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch: {
            $route: {
                handler(newValue, oldValue) {
                    const menu = this.flatMenus.find(item => item.pageId === this.getPageIdByUrl(newValue.path))
                    if (newValue.params['$showTag']) {//表示是菜单点打开的
                        this.setTags(newValue, menu);
                    } else {//非菜单点打开的
                        //const menu = this.flatMenus.find(item => item.url === newValue.fullPath || item.path === newValue.fullPath)
                        if (newValue.meta.isShowTag) {
                            let cusMenu = {

                            }
                            this.setTags(newValue, cusMenu);
                            return
                        }
                        if (menu) {
                            this.setTags(newValue, menu);
                        }
                    }
                    //this.setTagsList([...this.tagsList]);
                },
                immediate: true
            }
        },
        created() {
            // debugger
            //this.tagsList = this.getAllTags();
            //this.setTags(this.$route);
            // 监听关闭当前页面的标签页
        },
        mounted() {
            const menu = this.flatMenus.find(item => item.url === this.getPathRoot(this.$route.fullPath))
            if (menu) {
                this.setTags(this.$route);
            }
        }
    }

</script>


<style scoped lang="less">
    .tags {
        position: relative;
        height: 28px;
        overflow: hidden;
        background: #d6d6d6;
        padding-right: 120px;
        box-shadow: 0 5px 10px #ddd;
        flex-grow: 0;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 1px 1px 0px 0px;
        /*border-radius: 3px;*/
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        border: 1px solid #e9eaec;
        background: #d6d6d6;
        padding: 0 5px 0 5px;
        vertical-align: middle;
        color: #333;
        width: 90px;
        overflow: hidden;
    }

    .tags-home {
        float: left;
        height: 25px;
        line-height: 19px;
        width: 30px;
        font-size: 19px;
        padding: 3px 5px;
        box-sizing: border-box;
        color: #0091B0;
        cursor: pointer;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        color: #333;
        border: 1px solid #fff;
        background-color: #fff;
    }

    .tags-li-title {
        float: left;
        width: 72px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
        text-align: center;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        /*   background: #fff;*/
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }

    .tags-li-icon:hover {

        .el-icon-close {
            color: #006b83;
        }

    }


</style>
