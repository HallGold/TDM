const defaultOptions = {
    path: "/",//跟路径
    maxAge: 60 * 15 //15分钟
}
const cookie = require("cookie")

export function serializeCookie(key, value, options) {
    const mergedOptions = {...defaultOptions, ...options};
    return cookie.serialize(key, value, mergedOptions);
}

export function writeCookie(key, value, options) {
    document.cookie = serializeCookie(key, value, options)
}

export function cleanCookie() {
    let cookieAttrs = readCookie({path: '/icepanda'})
    for (let key in cookieAttrs) {
        writeCookie(key, "", {expires: new Date(), maxAge: 0, path: '/icepanda'})
    }

    cookieAttrs = readCookie({})
    for (let key in cookieAttrs) {
        writeCookie(key, "", {expires: new Date(), maxAge: 0})
    }

}


export function parseCookie(cookieString, options) {
    const mergedOptions = {...defaultOptions, ...options};
    return cookie.parse(cookieString, mergedOptions)
}

export function readCookie(options) {
    return parseCookie(document.cookie, options);
}