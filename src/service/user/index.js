const $$ = require('cmn-utils')

async function getCurrentUser() {
    return $$.request.post("/user/me").then(rsp=> rsp.data)
}

export {
    getCurrentUser
}