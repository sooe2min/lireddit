import { Field, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Updoot } from './Updoot'
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

	@Field()
	@ManyToOne(() => User, user => user.posts)
	@JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
	creator: User

	@OneToMany(() => Updoot, updoot => updoot.post)
	updoot: Updoot

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
