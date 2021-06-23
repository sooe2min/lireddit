import {
	dedupExchange,
	errorExchange,
	fetchExchange,
	gql,
	stringifyVariables
} from 'urql'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import {
	RegisterMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	LogoutMutation,
	VoteMutationVariables,
	DeletePostMutationVariables
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import Router from 'next/router'
import { isServer } from './isServer'

export const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info

		const allFields = cache.inspectFields(entityKey) // 'Query'
		const fieldInfos = allFields.filter(
			info => info.fieldName === fieldName // 'posts'
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

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = ''
	if (isServer()) {
		cookie = ctx.req.headers.cookie
	}

	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include' as const,
			headers: cookie
				? {
						cookie
				  }
				: undefined
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					PaginatedPosts: () => null
				},
				resolvers: {
					Query: {
						posts: cursorPagination()
					}
				},
				updates: {
					Mutation: {
						vote: (_result, args, cache) => {
							const { postId, value } = args as VoteMutationVariables
							const data = cache.readFragment(
								gql`
									fragment _ on Post {
										id
										points
										voteStatus
									}
								`,
								{ id: postId } as any
							) // Data or null

							if (data) {
								if (data.voteStatus === value) return
								const newPoints =
									(data.points as number) +
									(!data.voteStatus ? 1 : 2) * value
								cache.writeFragment(
									gql`
										fragment __ on Post {
											id
											points
											voteStatus
										}
									`,
									{
										id: postId,
										points: newPoints,
										voteStatus: value
									} as any
								)
							}
						},

						// With document caching we assume that a result may be invalidated by a mutation that executes on data that has been queried previously.
						createPost: (_result, _, cache) => {
							const allFields = cache.inspectFields('Query')
							const fieldInfos = allFields.filter(
								info => info.fieldName === 'posts'
							)
							fieldInfos.forEach(fi => {
								cache.invalidate('Query', 'posts', fi.arguments)
							})
						},

						deletePost: (_result, args, cache) => {
							cache.invalidate({
								__typename: 'Post',
								id: (args as DeletePostMutationVariables).id
							})
						},

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
	}
}
