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
					login: (result, args, cache, info) => {
						console.log(result, args, cache, info)
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							result,
							(result, query) => {
								if (result.login.errors) {
									console.log(111)

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
