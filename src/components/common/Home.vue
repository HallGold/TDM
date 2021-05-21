<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar v-if="!isBlank"></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse&&!isBlank}" :style="isBlank?{'left':0}:{}">
            <v-tags v-if="!isBlank"></v-tags>
            <div style="position:absolute;top:28px;bottom:0;left:0;right:0;background:#fafafa;padding: 4px;display: flex;box-sizing: border-box" class="base-content">
                <div class="content" id="$base-content">
                    <!-- <transition name="move" mode="out-in">-->
                    <keep-alive :include="getCachedTagsList">
                        <router-view></router-view>
                    </keep-alive>
                    <!-- <ice-transfer-tables>

                     </ice-transfer-tables>-->
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import {mapGetters, mapState} from 'vuex';
    import IceTransferTables from "./base/IceTransferTables";
    import IceDynamicPage from '@/components/common/form/IceDynamicPage.vue'
    import Vue from 'vue'

    Vue.component('IceDynamicPage', IceDynamicPage)

    export default {
        data() {
            return {
                isBlank: false
            }
        },
        components: {
            IceTransferTables,
            vHead, vSidebar, vTags
        },
        computed: {
            ...mapState('menuStore', ['collapse']),
            ...mapGetters('menuStore', ['getCachedTagsList'])
        },
        created() {

            if (this.$route.query['_blank']) {
                this.isBlank = true;
            }
        },
        watch: {
            $route(newValue, oldValue) {
                if (newValue.query['_blank']) {
                    this.isBlank = true;
                }
            }
        },
    }
</script>
