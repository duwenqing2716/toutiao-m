import { request } from './request.js' 


export const getComments = params => {
	return request({
		method:'GET',
		url:'/app/v1_0/comments',
		params
	})
}

export const addCommentLike = target => {
	return request({
		method:'GET',
		url:'/app/v1_0/comment/likings',
		data:{
			target
		}
	})
}

export const deleteCommentLike = commentId => {
	return request({
		method:'DELETE',
		url:`/app/v1_0/comment/likings/${commentId}`
	})
}


export const getArticleById = data => {
	return request({
		method:'POST',
		url:'/app/v1_0/comments',
		data
	})
}