import 'reflect-metadata'
import 'dotenv-safe/config'
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
import { authChecker } from './utils/authChecker'
import { createUserLoader } from './utils/createUserLoader'
import { createUpdootLoader } from './utils/createUpdootLoader'
// import { Updoot } from './entities/Updoot'
// import { Post } from './entities/Post'

const main = async () => {
	const app = express()

	const RedisStore = connectRedis(session)
	const redis = new Redis(process.env.REDIS_URL)
	app.use(
		cors({
			credentials: true,
			origin: process.env.CORS_ORIGIN
		})
	)

	app.use(
		session({
			saveUninitialized: false,
			resave: false,
			name: COOKIE_NAME,
			secret: process.env.SESSION_SECRET,
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
			validate: false,
			authChecker: authChecker
		}),
		context: ({ req, res }): MyContext => ({
			req,
			res,
			redis,
			userLoader: createUserLoader(),
			updootLoader: createUpdootLoader()
		})
	})

	apolloServer.applyMiddleware({ app, cors: false })

	app.listen(+process.env.PORT, async () => {
		console.log('server started on http://localhost:4000')
		try {
			const conn = await createConnection()
			await conn.runMigrations()
			// Updoot.delete({})
			// Post.delete({})
			console.log('Database connected!')
		} catch (error: unknown) {
			console.log(error)
		}
	})
}

main().catch(err => {
	console.log(err)
})
