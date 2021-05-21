<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu"
                 :default-active="onRoutes"
                 :collapse="collapse"
                 unique-opened
                 background-color="#242626"
                 text-color="#fff"
                 active-text-color="#0091b0"
                 @select="menuSelected">

            <template v-for="item in menus">
                <template v-if="item.children && item.children.length > 0">
                    <el-submenu :index="item.name" :key="item.oid">

                        <template slot="title">
                            <!--<el-image :src="$showImage(item.smallIconUrl)"-->
                                      <!--style="display: inline-block;width: 24px;height: 24px;margin-right: 5px;border-radius: 12px"-->
                                      <!--v-if="item.smallIconUrl">-->
                            <!--</el-image>-->
                            <i :class="'el-icon-menu'" v-if="item.smallIconUrl"></i>
                            <i :class="'el-icon-menu'" v-if="!item.smallIconUrl"></i>
                            <span slot="title">{{ item.name}}</span>
                        </template>

                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children && subItem.children.length > 0"
                                        :index="subItem.sequencing" :key="subItem.index">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="threeItem.pageId"
                                              :index="threeItem.pageId">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.pageId" :key="subItem.oid">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>

                <template v-else>
                    <el-menu-item :index="item.pageId" :key="item.oid">
                        <img :src="$showImage(item.smallIconUrl)"
                             style="display: inline-block;width: 24px;height: 24px;margin-right: 5px;border-radius: 12px"
                             v-if="item.smallIconUrl">
                        <!--<i :class="'el-icon-menu'" v-if="!item.smallIconUrl"></i>-->
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>

            </template>

        </el-menu>
    </div>
</template>

<script>

    import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'
    import pathUtil from '@/utils/pathUtil'
    import localstoreUtil from '@/utils/localstoreUtil'

    export default {
        data() {
            return {
                //menus: [],
                appCode: ''
            }
        },
        computed: {
            ...mapState('menuStore', ['collapse']),
            ...mapGetters('menuStore', ['menus', 'flatMenus']),

            /*...mapState('menuStore', ['menus']),*/
            onRoutes() {
                const page = this.getPagePermissionByUrl()(this.$route.path)
                if (page) {
                    return page.pageId;
                } else {
                    return ''
                }
            },
            /*  flatMenus() {
                  let flatMenus = [];
                  this.menuFlat(flatMenus, this.menus);
                  return flatMenus;
              }*/
        },
        created() {

        },
        methods: {
            ...mapActions("menuStore", ['loadAppMenus']),
            ...mapMutations("menuStore", ['collapseChage']),
            ...mapActions('permissionStore', ['openPageById', "getPagePermissionByUrl"]),
            ...mapGetters('permissionStore', ["getPagePermissionByUrl"]),
            //提取所有叶子菜单

            menuSelected(index, indexPath) {
                const menu = this.flatMenus.find(item => {
                    if (item.pageId === index) {
                        return true
                    }
                    return false;
                })

                if (menu) {
                    if (menu.pageId != this.onRoutes) {
                        this.openPageById({
                            id: menu.pageId, next: pageInfo => {
                                this.$router.push({
                                    path: pageInfo.$url,
                                    params: {$index_title: menu.name, $showTag: true}
                                });
                            }
                        });

                    }


                }


            }
        },
        mounted() {
            // this.loadAppMenus("123")
            //this.menus = localstoreUtil.getDefaultMenus();

        },
        watch: {
            menus: {
                handler(value) {
                    if (!value || value.length <= 0) {
                        this.collapseChage(true);
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style lang="css" scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
