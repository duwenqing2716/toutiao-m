import { request } from "./request.js"

export const getUserChannels = () => {
  return request({
		  method: 'GET',
      url: '/app/v1_0/user/channels'
  })
}
	
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
		params
  })
}

export const getAllChannels = () => {
  return request({
		method: 'GET',
    url: '/app/v1_0/channels'
  })
}
  
	export const addUserChannel = (data) => {
	  return request({
			method: 'PATCH',
	    url: '/app/v1_0/user/channels',
			data
	  })
	}
	
	export const deleteUserChannel = channeId =>{
		return request({
			method:'DELETE',
			url:'/app/v1_0/user/channels/${channeId}'
		})
	}