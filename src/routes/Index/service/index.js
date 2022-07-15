import { request, store } from 'cmn-utils'

async function getOrder() {
  return request.get("/order/12")
}

export {
  getOrder
}