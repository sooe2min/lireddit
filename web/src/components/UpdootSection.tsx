import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpdootSectionProps {
	post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
	const [_, vote] = useVoteMutation()

	return (
		<div className="flex flex-col mr-3 items-center min-w-max">
			<div
				className="p-2 bg-yellow-50"
				onClick={() => {
					vote({
						postId: post.id,
						value: 1
					})
				}}>
				<img className="w-3" src="/images/ChevronUpIcon.png" />
			</div>
			{post.points}
			<div
				className="p-2 bg-yellow-50"
				onClick={() => {
					vote({
						postId: post.id,
						value: -1
					})
				}}>
				<img className="w-3" src="/images/ChevronDownIcon.png" />
			</div>
		</div>
	)
}
