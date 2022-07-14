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
        }
    })
}

async function getOrder() {
    return request.get("/order/12")
}
export {
    login,
    getOrder

}