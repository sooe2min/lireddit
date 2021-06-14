import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import cors from 'cors'
import session from 'express-session'
import { COOKIE_NAME, __prod__ } from './constants'
import { MyContext } from './types'

const main = async () => {
	const app = express()

	const RedisStore = connectRedis(session)
	const redis = new Redis()
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
			name: COOKIE_NAME,
			secret: 'lireddit',
			store: new RedisStore({
				client: redis,
				disableTouch: true
			}),
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
		context: ({ req, res }): MyContext => ({
			req,
			res,
			redis
		})
	})

	apolloServer.applyMiddleware({ app, cors: false })

	app.listen(4000, async () => {
		console.log('server started on http://localhost:4000')
		try {
			await createConnection()
			console.log('Database connected!')
		} catch (error: unknown) {
			console.log(error)
		}
	})
}

main().catch(err => {
	console.log(err)
})
