import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Wrapper } from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUqrlCleint'
import { toErrorMap } from '../../utils/toErrorMap'
import NextLink from 'next/link'

const ChangePassword: NextPage = () => {
	const [newPassword, setNewPassword] = useState('')
	const [errors, setErros] = useState<Record<string, string>>({})

	const [_, changePassword] = useChangePasswordMutation()
	const router = useRouter()

	return (
		<Wrapper variant="small">
			<form
				className="flex flex-col"
				onSubmit={async e => {
					e.preventDefault()
					const response = await changePassword({
						token:
							typeof router.query.token === 'string'
								? router.query.token
								: '',
						newPassword
					})
					if (response.data?.changePassword.errors) {
						setErros(toErrorMap(response.data.changePassword.errors))
					} else if (response.data?.changePassword.user) {
						router.push('/')
					}
				}}>
				<div className="mt-3">
					<label className="font-semibold text-xl" htmlFor="newPassword">
						New Password
					</label>
					<input
						className="w-full border mt-2 border-green-500 p-3"
						id="newPassword"
						type="password"
						placeholder="new password"
						value={newPassword || ''}
						onChange={e => setNewPassword(e.target.value)}
					/>
					{errors.newPassword ? (
						<p className="text-red-600 mt-1 font-light">
							{errors.newPassword}
						</p>
					) : (
						errors.token && (
							<p className="text-red-600 mt-1 font-light">
								{errors.token}
								<NextLink href="/forgot-password">
									<a className="ml-2 text-black">
										click here to get a new one
									</a>
								</NextLink>
							</p>
						)
					)}
				</div>

				<button
					className="font-semibold mt-3 rounded-lg p-4 bg-green-500 text-white w-48"
					type="submit">
					change password
				</button>
			</form>
		</Wrapper>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: false })(
	ChangePassword
)
