import { useRouter } from 'next/dist/client/router'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { useCreatePostMutation } from '../generated/graphql'
import { useIsAuth } from '../utils/useIsAuth'
import { withApollo } from '../utils/withApollo'

const CreatePost: React.FC<{}> = ({}) => {
	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const router = useRouter()

	const [createPost] = useCreatePostMutation()
	useIsAuth()

	return (
		<Layout variant="small">
			<form
				className="flex flex-col"
				onSubmit={async e => {
					e.preventDefault()
					const { errors } = await createPost({
						variables: {
							input: {
								title,
								text
							}
						},
						update(cache) {
							cache.evict({ fieldName: 'posts' })
						}
					})
					if (!errors) {
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

export default withApollo({ ssr: false })(CreatePost)
