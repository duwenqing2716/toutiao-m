import { request } from './request.js' 

export const getArticleById = articleId => {
	return request({
		method:'GET',
		url:`/app/v1_0/articles/${articleId}`
	})
}


export const addFollow = target => {
	return request({
		method:'POST',
		url:'/app/v1_0/user/followings',
		data:{
			target 
		}
	})
}

export const deleteFollow = userId => {
	return request({
		method:'DELETE',
		url:`/app/v1_0/user/followings/${userId}`
	})
}

export const addCollect = target => {
	return request({
		method:'POST',
		url:'/app/v1_0/article/collections',
		data:{
			target 
		}
	})
}

export const deleteCollect = articleId => {
	return request({
		method:'DELETE',
		url:`/app/v1_0/user/collections/${articleId}`
	})
}

export const addLike = target => {
	return request({
		method:'POST',
		url:'/app/v1_0/article/likings',
		data:{
			target 
		}
	})
}

export const deleteLike = articleId => {
	return request({
		method:'DELETE',
		url:`/app/v1_0/article/likings/${articleId}`
	})
}

