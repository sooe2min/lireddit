import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import microConfig from './mikro-orm.config'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
// import redis from 'redis'
// import connectRedis from 'connect-redis'
import cors from 'cors'
import session from 'express-session'
import { __prod__ } from './constants'
import { MyContext } from './types'

const main = async () => {
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up()

	const app = express()

	// const RedisStore = connectRedis(session)
	// const redisClient = redis.createClient()
	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000'
		})
	)

	app.use(
		session({
			saveUninitialized: false,
			resave: false,
			name: 'qid',
			secret: 'lireddit',
			cookie: {
				sameSite: 'lax', // CSRF
				secure: __prod__, // only HTTPS
				httpOnly: true
			}
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false
		}),
		context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
	})

	apolloServer.applyMiddleware({ app, cors: false })

	app.listen(4000, () => {
		console.log('server started on http://localhost:4000')
	})
}

main().catch(err => {
	console.log(err)
})
