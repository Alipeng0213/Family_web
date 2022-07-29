const $$ = require('cmn-utils')
const UserService = require('../user')

async function login(username, password) {
    let data = {
        "username": username,
        "password": password
    }
    return $$.request.post("/power/login", data, {
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        prefix: ''
    }).then(rsp=>{
        if(rsp.code == 200) {
            $$.store.setStore("token", rsp.data.access_token)
            $$.store.setStore("refresh_token", rsp.data.refresh_token)
            $$.store.setStore("expiration", rsp.data.expiration)
            return UserService.getCurrentUser().then(user=> {
                $$.store.setStore("user", user)
                return user;
            })
        }
    })
}

function logout() {
    $$.store.removeStore("token")
    $$.store.removeStore("refresh_token")
    $$.store.removeStore("expiration")
    $$.store.removeStore("user")
    window.location.href = "/"
}

export {
    login,
    logout
}