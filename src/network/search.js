import { request } from './request.js' 

export const getSearchSuggestions = q => {
	return request({
		method:'GET',
		url:'/app/v1_0/suggestion',
		params:{
			q
		}
	})
}

export const getSearchResult = params => {
	return request({
		method:'GET',
		url:'/app/v1_0/search',
		params
	})
}

export const getSearchHistroies = () => {
	return request({
		method:'GET',
		url:'/app/v1_0/search/histories'
	})
}