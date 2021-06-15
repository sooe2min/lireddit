import { dedupExchange, errorExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import {
	RegisterMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	LogoutMutation
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import Router from 'next/router'

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
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
				} else {
					Router.push('/')
				}
			}
		}),
		ssrExchange,
		fetchExchange
	]
})
