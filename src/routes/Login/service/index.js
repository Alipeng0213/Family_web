import { request, store } from 'cmn-utils'


async function login(username, password) {
    let data = {
        "username": username,
        "password": password
    }
    return request.post("/power/login", data, {
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        prefix: ''
    }).then(rsp=>{
        if(rsp.code == 200) {
            store.setStore("token", rsp.data.access_token)
            store.setStore("refresh_token", rsp.data.refresh_token)
            store.setStore("expiration", rsp.data.expiration)
            store.setStore("user", rsp.data.user)
        }
        return rsp;
    })
}

async function loginOut() {
    request.get("/order/22", {
        "password": "223"
    })
}

export {
    login,
    loginOut

}