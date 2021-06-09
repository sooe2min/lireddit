import React, { FormEvent, useState } from 'react'
import { Wrapper } from '../components/Wrapper'
import { FieldError, useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErros] = useState<Record<string, string>>({})

	const [_, register] = useRegisterMutation()
	const router = useRouter()

	return (
		<Wrapper variant="small">
			<form
				className="flex flex-col"
				onSubmit={async e => {
					e.preventDefault()
					const response = await register({
						username: username,
						password: password
					})

					if (response.data?.register.errors) {
						setErros(toErrorMap(response.data.register.errors))
						console.log(response)
					} else if (response.data?.register.user) {
						router.push('/')
					}
				}}>
				<div className="mt-3">
					<label className="font-semibold text-xl" htmlFor="username">
						Username
					</label>
					<input
						className="w-full border mt-2 border-green-500 p-3"
						id="username"
						type="text"
						placeholder="username"
						value={username || ''}
						onChange={e => setUsername(e.target.value)}
					/>
					{errors.username && (
						<p className="text-red-600 mt-1 font-light">
							{errors.username}
						</p>
					)}
				</div>
				<div className="mt-3">
					<label className="font-semibold text-xl" htmlFor="password">
						Password
					</label>
					<input
						className="w-full border mt-2 border-green-500 p-3"
						id="password"
						type="password"
						autoComplete="false"
						placeholder="password"
						value={password || ''}
						onChange={e => setPassword(e.target.value)}
					/>
					{errors.password && (
						<p className="text-red-600 mt-1 font-light">
							{errors.password}
						</p>
					)}
				</div>
				<button
					className="font-semibold mt-3 rounded-lg p-4 bg-green-500 text-white w-1/3"
					type="submit">
					register
				</button>
			</form>
		</Wrapper>
	)
}

export default Register
