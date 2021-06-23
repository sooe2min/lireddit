import { withUrqlClient } from 'next-urql'
import React from 'react'
import { EditDeletePostButton } from '../../components/EditDeletePostButton'
import { Layout } from '../../components/Layout'
import { createUrqlClient } from '../../utils/createUqrlCleint'
import { useGetPostFromUrl } from '../../utils/useGetFromPostUrl'

const Post = ({}) => {
	const [{ data, fetching, error }] = useGetPostFromUrl()

	if (!data && fetching) {
		return <Layout variant="regular">...loading</Layout>
	}

	if (error) {
		return <div>{error.message}</div>
	}

	if (!data?.post) {
		return (
			<Layout variant="regular">
				<div>could not find post</div>
			</Layout>
		)
	}

	return (
		<Layout variant="regular">
			<div className="mb-6">
				<h1 className="font-medium text-2xl">{data?.post?.title}</h1>
				<p>{data?.post?.text}</p>
			</div>
			<EditDeletePostButton
				id={data.post.id}
				creatorId={data.post.creator.id}
			/>
		</Layout>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
