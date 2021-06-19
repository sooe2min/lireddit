import { Field, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Post } from './Post'
import { Updoot } from './Updoot'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('increment')
	id!: number

	@Field()
	@Column({ unique: true })
	email!: string

	@Field()
	@Column({ unique: true })
	username!: string

	@Column()
	password!: string

	@OneToMany(() => Post, post => post.creator)
	posts: Post[]

	@OneToMany(() => Updoot, updoot => updoot.post)
	updoot: Updoot

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
