import { Post } from '../entities/Post'
import {
	Query,
	Arg,
	Mutation,
	Resolver,
	Field,
	InputType,
	Ctx,
	Authorized,
	Int
} from 'type-graphql'
import { MyContext } from 'src/types'
import { User } from '../entities/User'
import { getConnection } from 'typeorm'

@InputType()
class PostInput {
	@Field()
	title: string
	@Field()
	text: string
}

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null
	): Promise<Post[]> {
		const realLimit = Math.min(limit, 50)
		const cb = getConnection()
			.getRepository(Post)
			.createQueryBuilder('p')
			.orderBy('"createdAt"', 'DESC')
			.take(realLimit)

		if (cursor) {
			cb.where('"createAt" < :cursor', {
				cursor: new Date(parseInt(cursor))
			})
		}

		return cb.getMany()
	}

	@Query(() => Post, { nullable: true })
	post(@Arg('id') id: number): Promise<Post | undefined> {
		return Post.findOne(id)
	}

	@Authorized()
	@Mutation(() => Post)
	async createPost(
		@Arg('input') input: PostInput,
		@Ctx() { req }: MyContext
	): Promise<Post> {
		return Post.create({
			...input,
			creator: await User.findOne({ where: { id: req.session.userId } })
		}).save()
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(@Arg('id') id: number, @Arg('input') input: PostInput) {
		const post = await Post.findOne(id)
		if (!post) {
			return null
		}
		return Post.update(id, { ...input })
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg('id') id: number): Promise<boolean> {
		await Post.delete(id)
		return true
	}
}
