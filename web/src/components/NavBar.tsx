import React from 'react'
import Link from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery({
		// Warning: Did not expect server HTML to contain a <a> in <div>.
		// pause: isServer()
	})
	// console.log(data, fetching) // 캐싱 관련 콘솔
	const [_, logout] = useLogoutMutation()

	let body = null

	// data is loading
	if (fetching) {
		// user not logged in
	} else if (!data?.me) {
		body = (
			<>
				<Link href="/login">
					<a className="mr-4 border ring-4 ring-green-300 rounded-lg p-2">
						log in
					</a>
				</Link>
				<Link href="/register">
					<a className="mr-2 border ring-4 ring-green-300 rounded-lg p-2">
						register
					</a>
				</Link>
			</>
		)

		// user is logged in
	} else {
		body = (
			<>
				<div className="border ring-4 ring-yellow-500 rounded-lg p-2 mr-3">
					{data.me.username}
				</div>
				<button
					className="border ring-4 ring-red-400 rounded-lg p-2"
					onClick={() => logout()}>
					logout
				</button>
			</>
		)
	}

	return (
		<div className="bg-green-100 p-3 sticky top-0 w-full flex z-10">
			<div className="ml-auto flex">{body}</div>
		</div>
	)
}
