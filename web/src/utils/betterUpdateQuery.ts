import { Cache, QueryInput } from '@urql/exchange-graphcache'

export function betterUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) {
	// updateQuery() can be used to update the data of a given query using an updater function
	// data: locally cached data, gql으로 접근한다.
	return cache.updateQuery(qi, data => fn(result, data as any) as any)
}
