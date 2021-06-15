import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/dist/client/router'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { useCreatePostMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUqrlCleint'
import { useIsAuth } from '../utils/useIsAuth'

const CreatePost = ({}) => {
	const [title, setTitle] = useState('')
	const [text, setText] = useState('')

	const [_, createPost] = useCreatePostMutation()
	useIsAuth()

	const router = useRouter()

	return (
		<Layout variant="small">
			<form
				className="flex flex-col"
				onSubmit={async e => {
					e.preventDefault()
					const { error } = await createPost({
						input: {
							title,
							text
						}
					})
					if (!error) {
						router.replace('/')
					}
				}}>
				<div className="mt-3">
					<label className="font-semibold text-xl" htmlFor="title">
						Title
					</label>
					<input
						className="w-full border mt-2 border-green-500 p-3"
						id="title"
						type="text"
						placeholder="title"
						value={title || ''}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>

				<div className="mt-3">
					<label className="font-semibold text-xl" htmlFor="text">
						Text
					</label>
					<textarea
						className="w-full border mt-2 border-green-500 p-3"
						id="textarea"
						placeholder="text..."
						value={text || ''}
						onChange={e => setText(e.target.value)}
					/>
				</div>

				<button
					className="font-semibold mt-3 rounded-lg p-4 bg-green-500 text-white w-48"
					type="submit">
					create post
				</button>
			</form>
		</Layout>
	)
}

export default withUrqlClient(createUrqlClient)(CreatePost)
