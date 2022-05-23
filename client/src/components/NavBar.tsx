import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const { data, loading } = useMeQuery({
		// Warning: Did not expect server HTML to contain a <a> in <div>.
		skip: isServer()
	})
	// console.log(data, fetching) // 캐싱 관련 콘솔
	const [logout, { client }] = useLogoutMutation()

	let body = null

	// data is loading
	if (loading) {
		// user not logged in
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href="/login">
					<a className="font-semibold border-yellow-100 border-b-4 p-1 hover:bg-yellow-100 mr-3">
						log in
					</a>
				</NextLink>
				<NextLink href="/register">
					<a className="font-semibold border-yellow-400  border-b-4 p-1 hover:bg-yellow-400 mr-3">
						register
					</a>
				</NextLink>
			</>
		)

		// user is logged in
	} else {
		body = (
			<>
				<NextLink href="/create-post">
					<button className="font-semibold border-yellow-100 border-b-4 p-1 hover:bg-yellow-100 mr-3">
						create post
					</button>
				</NextLink>
				<div className="font-semibold border-yellow-400  border-b-4 p-1 hover:bg-yellow-400 mr-3">
					{data.me.username}
				</div>
				<button
					className="font-semibold border-red-400  border-b-4 p-1 hover:bg-red-400"
					onClick={async () => {
						await logout()
						client.resetStore()
					}}>
					logout
				</button>
			</>
		)
	}

	return (
		<div className="bg-green-100 p-3 sticky top-0 z-10">
			<div className="flex m-auto max-w-3xl items-center">
				<NextLink href="/">
					<a className="font-bold text-5xl flex-1">
						<h1>Lireddit</h1>
					</a>
				</NextLink>
				<div className="flex">{body}</div>
			</div>
		</div>
	)
}
