import {
	dedupExchange,
	errorExchange,
	fetchExchange,
	stringifyVariables
} from 'urql'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import {
	RegisterMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	LogoutMutation
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import Router from 'next/router'

export const simplePagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info
		const allFields = cache.inspectFields(entityKey)
		const fieldInfos = allFields.filter(
			info => info.fieldName === fieldName
		)

		const size = fieldInfos.length
		if (size === 0) {
			return undefined
		}

		const filedKey = `${fieldName}(${stringifyVariables(fieldArgs)})`

		const isItInTheCache = cache.resolve(
			cache.resolveFieldByKey(entityKey, filedKey) as string,
			'posts'
		)
		info.partial = !isItInTheCache

		const results: string[] = []
		let hasMore = true
		fieldInfos.forEach(fi => {
			const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string

			//
			const data = cache.resolve(key, 'posts') as string[]
			const _hasMore = cache.resolve(key, 'hasMore')
			if (!_hasMore) {
				hasMore = _hasMore as boolean
			}
			results.push(...data)
		})

		return {
			__typename: 'PaginatedPosts',
			posts: results,
			hasMore
		}
	}
}

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
			keys: {
				PaginatedPosts: () => null
			},
			resolvers: {
				Query: {
					posts: simplePagination()
				}
			},
			updates: {
				Mutation: {
					register: (_result, _, cache) => {
						betterUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument }, // gql
							_result,
							(result, query) => {
								if (result.register.errors) {
									return query
								} else {
									return {
										me: result.register.user
									}
								}
							}
						)
					},

					// 로그인했을 때(=useMeQuery) NavBar의 data = {me: null}
					// 때문에 NavBar에 아무 변화가 없다..

					// 그래서 로그인하고 바로 NavBar에서 data를 사용할 수 있도록
					// MeQuery의 locally cached data를 업데이트(캐싱)하는 거다.
					// with graphcache
					login: (_result, _, cache) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument }, // gql
							_result,
							(result, query) => {
								if (result.login.errors) {
									return query
								} else {
									return {
										me: result.login.user
									}
								}
							}
						)
					},

					logout: (_result, _, cache) => {
						betterUpdateQuery<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							() => ({ me: null })
						)
					}
				}
			}
		}),
		errorExchange({
			onError(error) {
				console.log(error)
				if (error?.message.includes('not authenticated')) {
					Router.replace('/login')
				}
			}
		}),
		ssrExchange,
		fetchExchange
	]
})
