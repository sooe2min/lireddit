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
	MeDocument,
	MeQuery
} from '../generated/graphql'

function betterUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) {
	// updateQuery() can be used to update the data of a given query using an updater function
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
					// 로그인했을 때(=useMeQuery) NavBar의 data = {me: null}
					// 때문에 NavBar에 아무 변화가 없다..
					// 그래서 로그인하고 바로 NavBar에서 data를 사용할 수 있도록
					// MeQuery를 업데이트하고 캐싱하는 거야 with graphcache
					// MeQuery의 me
					// LoginMutation의 result.login.user
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
