import React from 'react'
import { useMeQuery, useDeletePostMutation } from '../generated/graphql'
import NextLink from 'next/link'

interface EditDeletePostButtonProps {
	id: number
	creatorId: number
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonProps> = ({
	id,
	creatorId
}) => {
	const [{ data: meData }] = useMeQuery()
	const [_, deletePost] = useDeletePostMutation()

	if (meData?.me?.id !== creatorId) {
		return null
	}

	return (
		<>
			<div className="flex items-center mb-auto">
				<NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
					<img
						className="h-8 mr-3 cursor-pointer"
						aria-label="Edit Post"
						src="/images/EditIcon.png"
					/>
				</NextLink>
				<img
					className="h-8 cursor-pointer"
					aria-label="Delete Post"
					src="/images/DeleteIcon.png"
					onClick={async () => {
						await deletePost({
							id
						})
					}}
				/>
			</div>
		</>
	)
}
