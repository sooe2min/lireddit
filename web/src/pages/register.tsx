import React, { FormEvent, useState } from 'react'
import { useMutation } from 'urql'
import { Wrapper } from '../components/Wrapper'

interface registerProps {}

const REGISTER_MUT = `
mutation Register($username: String!, $password: String!) {
  register(options: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`

const Register: React.FC<registerProps> = ({}) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [_, register] = useMutation(REGISTER_MUT)

	return (
		<Wrapper variant="small">
			<form
				className="flex flex-col"
				onSubmit={async e => {
					e.preventDefault()
					console.log(e)
					const response = await register({
						username: username,
						password: password
					})
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
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
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
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
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
