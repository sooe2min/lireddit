import { Field, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { User } from './User'

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('increment')
	id!: number

	@Field()
	@Column()
	title!: string

	@Field()
	@Column()
	text!: string

	@Field()
	@Column({ type: 'int', default: 0 })
	points!: number

	@ManyToOne(() => User, user => user.posts)
	@JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
	creator: User

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
