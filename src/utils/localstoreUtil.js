const Username_Last_Login = "username-last-login"
export default {
    /**
     * 记住登陆用户名
     * @param userInfo
     */
    setLastLoginUser(userInfo) {
        if (userInfo && userInfo.userCode) {
            localStorage.setItem(Username_Last_Login, userInfo.userCode);
        }
    },
    getLastLoginUserName() {
        let username = localStorage.getItem(Username_Last_Login);
        return username ? username : '';
    }
}
