import React from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpdootSectionProps {
	post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
	const [_, vote] = useVoteMutation()

	return (
		<div className="flex flex-col mr-3 items-center min-w-max">
			<div
				className={
					post.voteStatus === 1 ? 'bg-green-400 p-2' : 'bg-yellow-50 p-2'
				}
				onClick={() => {
					if (post.voteStatus === 1) return
					vote({
						postId: post.id,
						value: 1
					})
				}}>
				<img className="w-3" src="/images/ChevronUpIcon.png" />
			</div>
			{post.points}
			<div
				className={
					post.voteStatus === -1 ? 'bg-red-400 p-2' : 'bg-yellow-50 p-2'
				}
				onClick={() => {
					if (post.voteStatus === -1) return
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
