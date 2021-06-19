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
	Int,
	FieldResolver,
	Root,
	ObjectType
} from 'type-graphql'
import { MyContext } from 'src/types'
import { User } from '../entities/User'
import { getConnection } from 'typeorm'
import { Updoot } from '../entities/Updoot'

@ObjectType()
class PaginatedPosts {
	@Field(() => [Post])
	posts: Post[]
	@Field()
	hasMore: boolean
}

@InputType()
class PostInput {
	@Field()
	title: string
	@Field()
	text: string
}

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(@Root() root: Post) {
		return root.text.slice(0, 500)
	}

	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null
	): Promise<PaginatedPosts> {
		const realLimit = Math.min(limit, 50)
		const realLimitPlusOne = realLimit + 1

		const cb = getConnection()
			.getRepository(Post)
			.createQueryBuilder('p')
			.leftJoinAndSelect('p.creator', 'u', 'p.creatorId = u.id')
			.orderBy('p.createdAt', 'DESC')
			.take(realLimitPlusOne)

		if (cursor) {
			// 내림차순, cursor 값보다 작은 createdAt
			cb.where('p.createdAt < :cursor', {
				cursor: new Date(parseInt(cursor))
			})
		}
		const posts = await cb.getMany()

		return {
			posts: posts.slice(0, realLimit),
			hasMore: posts.length === realLimitPlusOne
		}
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

	@Mutation(() => Boolean)
	async vote(
		@Arg('postId', () => Int) postId: number,
		@Arg('value', () => Int) value: number,
		@Ctx() { req }: MyContext
	) {
		const isUpdoot = value !== -1
		console.log(isUpdoot)

		const realValue = isUpdoot ? 1 : -1
		console.log(realValue)

		const { userId } = req.session

		const test = await Updoot.insert({
			value: realValue,
			userId: userId,
			postId: postId
		})
		console.log(test)

		const post = await Post.findOne(postId)
		post!.points++
		post?.save()

		return true
	}
}
