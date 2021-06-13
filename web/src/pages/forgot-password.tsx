import { withUrqlClient } from 'next-urql'
import React, { useState } from 'react'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUqrlCleint'

const ForgotPassword: React.FC<{}> = ({}) => {
	const [email, setEmail] = useState('')
	const [complete, setComplete] = useState(false)

	const [_, forgotPassword] = useForgotPasswordMutation()

	return (
		<Wrapper variant="small">
			{complete ? (
				<div>
					if an account with that email exists, we sent you can email
				</div>
			) : (
				<form
					className="flex flex-col"
					onSubmit={async e => {
						e.preventDefault()
						await forgotPassword({ email })
						setComplete(true)
					}}>
					<div className="mt-3">
						<label className="font-semibold text-xl" htmlFor="email">
							New Password
						</label>
						<input
							className="w-full border mt-2 border-green-500 p-3"
							id="email"
							type="email"
							placeholder="email"
							value={email || ''}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>

					<button
						className="font-semibold mt-3 rounded-lg p-4 bg-green-500 text-white w-48"
						type="submit">
						forgot password
					</button>
				</form>
			)}
		</Wrapper>
	)
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
