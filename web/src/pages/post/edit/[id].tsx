import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/Layout'
import {
	usePostQuery,
	useUpdatePostMutation
} from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUqrlCleint'
import { useGetIntId } from '../../../utils/useGetIntId'

// updatePost 이후엔 캐시가 자동으로 업데이트 된다.
// 하지만 graphql 문서를 동일하게 작성해야 한다.
const EditPost = ({}) => {
	const intId = useGetIntId()
	const [{ data, fetching, error }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId
		}
	})

	const [title, setTitle] = useState('')
	const [text, setText] = useState('')

	// 어떻게 하면 undifined를 피해서 원본 데이터를 initialState으로 할 수 있을까?
	useEffect(() => {
		if (data?.post!) {
			setTitle(data.post.title)
			setText(data.post.text)
		}
	}, [data])

	const [_, updatePost] = useUpdatePostMutation()
	const router = useRouter()

	if (!data && fetching) {
		return <Layout variant="regular">...loading</Layout>
	}

	if (error) {
		return <div>{error.message}</div>
	}

	return (
		<Layout variant="regular">
			<form
				className="flex flex-col"
				onSubmit={async e => {
					e.preventDefault()
					await updatePost({
						id: intId,
						input: {
							title,
							text
						}
					})
					router.back()
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
					update post
				</button>
			</form>
		</Layout>
	)
}

export default withUrqlClient(createUrqlClient)(EditPost)
