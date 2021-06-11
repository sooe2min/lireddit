import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { createClient } from '@urql/core'
import { dedupExchange, fetchExchange, Provider } from 'urql'
import {
	cacheExchange,
	Cache,
	QueryInput
} from '@urql/exchange-graphcache'
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation
} from '../generated/graphql'

function betterUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) {
	// updateQuery() can be used to update the data of a given query using an updater function
	// data: locally cached data, gql으로 접근한다.
	return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' },
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
		fetchExchange
	]
})

function MyApp({ Component, pageProps }: any) {
	return (
		<Provider value={client}>
			<Component {...pageProps} />
		</Provider>
	)
}

export default MyApp
