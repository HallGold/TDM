<template>
    <el-dialog
            custom-class="ice-dialog"
            title="选择页面"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="680px"
            @close="closeHandler"
            center>
        <div style="width:650px;height:660px;">
            <el-tabs v-model="activeName">
                <el-tab-pane v-if="deptTab" label="部门" name="deptTab" :lazy="true">
                    <org-select ref="depts" :multiple="multiple"></org-select>
                </el-tab-pane>
                <el-tab-pane v-if="userTab" label="用户" name="userTab" :lazy="true">
                    <user-select ref="users" :multiple="multiple" :users="users">
                        <div slot="footer">
                        </div>
                    </user-select>
                </el-tab-pane>
                <el-tab-pane v-if="roleTab" label="角色" name="roleTab" :lazy="true">
                    <role-select ref="roles" :multiple="multiple"></role-select>
                </el-tab-pane>
                <el-tab-pane v-if="positionTab" label="岗位" name="positionTab" :lazy="true">
                    岗位管理
                </el-tab-pane>
            </el-tabs>
            <slot name="footer">
                <el-button type="primary" @click="enter">确定</el-button>
                <el-button type="info" @click="closeHandler()">返回</el-button>
            </slot>
        </div>
    </el-dialog>
</template>

<script>
    import CommSelectTemplate from "./CommSelectTemplate";
    import UserSelect from "@/pages/system/users/UserSelect";
    import OrgSelect from "@/pages/system/organization/OrgSelect";
    import RoleSelect from "@/pages/system/role/RoleSelect";

    export default {
        name: "CommSelect",
        components: {OrgSelect, UserSelect, RoleSelect},
        mixins: [CommSelectTemplate]
    }
</script>

<style scoped>
</style>