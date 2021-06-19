import { ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	Entity,
	// JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
@Entity('updoots')
export class Updoot extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id!: number

	@Column({ type: 'int' })
	value: number

	@Column()
	userId: number

	@Column()
	postId: number

	@ManyToOne(() => User, user => user.updoot)
	// @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user: User

	@ManyToOne(() => Post, post => post.updoot)
	// @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
	post: Post
}
