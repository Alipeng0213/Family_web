import { request } from 'cmn-utils'

async function login(payload) {
    return request.get("/pokemon/queryPokemon", payload).then(rsp=> request.setStore('user', rsp))
}
export {
    login
}