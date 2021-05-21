export default {
    replacePathRoot(path) {
        if (path) {
            if (path[0] === '/') {
                return this.replacePathRoot(path.slice(1))
            } else {
                return path;
            }
        } else {
            return '';
        }
    },
    replaceWildcardPath(path) {
        if (path) {
            return path.replace(/:\w*/, '*')
        } else {
            return '';
        }

    }
}