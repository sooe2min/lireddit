import { withApollo as withClientApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { PaginatedPosts } from '../generated/graphql'
import { NextPageContext } from 'next'

const client = (ctx: NextPageContext | undefined) =>
	new ApolloClient({
		uri: process.env.NEXT_PUBLIC_API_URL as string,
		credentials: 'include',
		headers: {
			cookie:
				(typeof window === 'undefined'
					? ctx?.req?.headers.cookie
					: undefined) || ''
		},
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						posts: {
							// Don't cache separate results based on
							// any of this field's arguments.
							keyArgs: false,
							// Concatenate the incoming list items with
							// the existing list items.
							merge(
								existing: PaginatedPosts | undefined,
								incoming: PaginatedPosts
							): PaginatedPosts {
								return {
									...incoming,
									posts: [...(existing?.posts || []), ...incoming.posts]
								}
							}
						}
					}
				}
			}
		})
	})

export const withApollo = withClientApollo(client)
