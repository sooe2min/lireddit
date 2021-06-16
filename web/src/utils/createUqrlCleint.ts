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
		console.log(info)
		console.log(allFields)
		console.log(fieldArgs)

		const filedKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
		console.log(filedKey)

		const isItInTheCache = cache.resolve(entityKey, filedKey)
		console.log(isItInTheCache)

		info.partial = !isItInTheCache

		const results: string[] = []
		fieldInfos.forEach(fi => {
			const data = cache.resolve(entityKey, fi.fieldKey) as string[]
			results.push(...data)
		})
		console.log(results)
		return results
		//   const visited = new Set();
		//   let result: NullArray<string> = [];
		//   let prevOffset: number | null = null;

		//   for (let i = 0; i < size; i++) {
		//     const { fieldKey, arguments: args } = fieldInfos[i];
		//     if (args === null || !compareArgs(fieldArgs, args)) {
		//       continue;
		//     }

		//     const links = cache.resolve(entityKey, fieldKey) as string[];
		//     const currentOffset = args[offsetArgument];

		//     if (
		//       links === null ||
		//       links.length === 0 ||
		//       typeof currentOffset !== 'number'
		//     ) {
		//       continue;
		//     }

		//     const tempResult: NullArray<string> = [];

		//     for (let j = 0; j < links.length; j++) {
		//       const link = links[j];
		//       if (visited.has(link)) continue;
		//       tempResult.push(link);
		//       visited.add(link);
		//     }

		//     if (
		//       (!prevOffset || currentOffset > prevOffset) ===
		//       (mergeMode === 'after')
		//     ) {
		//       result = [...result, ...tempResult];
		//     } else {
		//       result = [...tempResult, ...result];
		//     }

		//     prevOffset = currentOffset;
		//   }

		//   const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
		//   if (hasCurrentPage) {
		//     return result;
		//   } else if (!(info as any).store.schema) {
		//     return undefined;
		//   } else {
		//     info.partial = true;
		//     return result;
		//   }
		// };
	}
}

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
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
