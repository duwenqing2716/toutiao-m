import { request } from "./request.js"


export function login (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

export function sendSms (mobile) {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

export function getCurrentUser () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
 
export function getUserProfile () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

export function updateUserProfile (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
		data
  })
}

export function updateUserPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
		data
  })
}