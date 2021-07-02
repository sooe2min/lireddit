import { ApolloCache, gql } from '@apollo/client'
import React from 'react'
import {
	PostSnippetFragment,
	useVoteMutation,
	VoteMutation
} from '../generated/graphql'

interface UpdootSectionProps {
	post: PostSnippetFragment
}

const updateAfterVote = (
	cache: ApolloCache<VoteMutation>,
	postId: number,
	value: number
) => {
	const data = cache.readFragment<{
		id: number
		points: number
		voteStatus: number | null
	}>({
		id: 'Post:' + postId,
		fragment: gql`
			fragment _ on Post {
				id
				points
				voteStatus
			}
		`
	})

	if (data) {
		if (data.voteStatus === value) return
		const newPoints =
			(data.points as number) + (!data.voteStatus ? 1 : 2) * value
		cache.writeFragment({
			id: 'Post:' + postId,
			fragment: gql`
				fragment __ on Post {
					points
					voteStatus
				}
			`,
			data: {
				points: newPoints,
				voteStatus: value
			}
		})
	}
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
	const [vote] = useVoteMutation()

	return (
		<div className="flex flex-col mr-3 items-center min-w-max">
			<div
				className={
					post.voteStatus === 1 ? 'bg-green-400 p-2' : 'bg-yellow-50 p-2'
				}
				onClick={() => {
					if (post.voteStatus === 1) return
					vote({
						variables: {
							postId: post.id,
							value: 1
						},
						update(cache) {
							updateAfterVote(cache, post.id, 1)
						}
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
						variables: {
							postId: post.id,
							value: -1
						},
						update(cache) {
							updateAfterVote(cache, post.id, -1)
						}
					})
				}}>
				<img className="w-3" src="/images/ChevronDownIcon.png" />
			</div>
		</div>
	)
}
