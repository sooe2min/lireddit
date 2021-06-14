import { Post } from '../entities/Post'
import { Query, Arg, Mutation, Resolver } from 'type-graphql'

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	async posts(): Promise<Post[]> {
		return Post.find({})
	}

	@Query(() => Post, { nullable: true })
	post(@Arg('id') id: number): Promise<Post | undefined> {
		return Post.findOne(id)
	}

	@Mutation(() => Post)
	createPost(@Arg('title') title: string): Promise<Post> {
		return Post.create({ title }).save()
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('title', () => String, { nullable: true }) title: string
	): Promise<Post | null> {
		const post = await Post.findOne(id)
		if (!post) {
			return null
		}
		if (typeof title !== 'undefined') {
			Post.update(id, { title })
		}
		return post
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg('id') id: number): Promise<boolean> {
		await Post.delete(id)
		return true
	}
}
