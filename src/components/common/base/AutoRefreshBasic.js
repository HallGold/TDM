export default {
    beforeRouteEnter(to, from, next) {
        next();
        if (to &&
            to.matched.length > 0) {
            const vueInst = to.matched[to.matched.length - 1].instances.default;
            if (vueInst && vueInst.$refresh) {
                vueInst.$refresh();
            }
        }
        // console.log("beforeRouteEnter")
    }
}