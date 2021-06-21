import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUqrlCleint'
import { usePostsQuery } from '../generated/graphql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 5,
		cursor: null as null | string
	})
	const [{ data, fetching }] = usePostsQuery({
		variables
	})
	console.log(data)

	if (!data && !fetching)
		return <div>you got query failed for some reason</div>

	return (
		<>
			<Layout variant="regular">
				<div className="flex items-center mb-7">
					<h1 className="font-bold text-5xl mt-4">Lireddit</h1>
					<NextLink href="/create-post">
						<a className="ml-auto font-semibold border-yellow-100 border-b-4 p-1 hover:bg-yellow-100">
							create post
						</a>
					</NextLink>
				</div>
				{!data && fetching ? (
					<div>...loading</div>
				) : (
					data!.posts.posts.map(p => (
						<div
							className="flex border-2 p-4 mb-6 shadow-md hover:border-yellow-100 hover:shadow-none"
							key={p.id}>
							<UpdootSection post={p} />
							<div>
								<div className="font-medium text-2xl">{p.title}</div>
								<p className="text-gray-400">
									Posted by {p.creator.username}
								</p>
								<div className="pt-3">{p.textSnippet}</div>
							</div>
						</div>
					))
				)}
				{data && data.posts.hasMore ? (
					<div className="flex">
						<button
							className="m-auto ring-4 rounded-lg ring-yellow-100 p-4"
							onClick={() => {
								setVariables({
									limit: variables.limit,
									// DESC, 마지막 글의 createdAt
									cursor:
										data.posts.posts[data.posts.posts.length - 1].createdAt
								})
							}}>
							load more
						</button>
					</div>
				) : null}
			</Layout>
		</>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
// SSR 의문1.. post 요청없이 데이터를 어떻게 가지고 있는 거지?
// 우선 codegen의 use..Query는 자동 요청이고,
// SSR은 서버로부터 모든 요청 데이터를 가져와서
// 그 이후에 페이지를 로드하기 때문에, post 요청이 없는 거다.

// 첫 페이지 로드 때 클라이언트에서 원하는!!
// 요청 쿼리 데이터를 전부 받아와서 한 번에 로드한다.

// page source로 확인할 수 있고 resolver에 딜레이를 걸어서도 확인할 수 있다.
// ..SSR이 아닌 경우 딜레이 시간이 끝나고 fetch 데이터가 페이지에 로드된다.

// SSR의 장점은 무엇이고 어떻게 활용할 수 있을지..
// SSR의 장점을 활용하여 렌더링하면 좋은 데이터가 무엇인지..
// 미리 받아 놓으면 좋은 데이터는 SSR을 설정하고 정적으로 렌더링한다.
