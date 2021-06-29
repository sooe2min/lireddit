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
	app.set('trust proxy', 1)
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
				httpOnly: true,
				sameSite: 'lax', // CSRF
				secure: __prod__, // only HTTPS
				domain: __prod__ ? 'https://lireddit.ddns.net' : undefined
			}
		})
	)
	// qid=s:MOfAjyCGh1WRVfTEn4p6kV-f_optsJub.wvA+GwoKk6HsUqCrBH33EYZrkhKXK77yauquQ7T4uEE; Domain=.liredditweb.ddns.net; Path=/; HttpOnly; Secure; SameSite=Lax
	// 도메인이 있을 때
	// this set-cookie was blocked because its domain attribute was invalid with regards to the cureent host url.

	// 도메인은 없고 lax
	// this set-cookie was blocked because it had the "samesite=lax" attribute but came from a cross-site response which was not the response to a top-level navigation.

	// 서버와 클라이언트의 도메인 주소가 다르다. 때문에 서브 도메인의 쿠키 접근을 허용하는 domain 옵션으로는 해결할 수 없다. DNS로부터 비롯된 문제이고 당장은 'samesite=none'으로 해결했다.
	// qid=s:aE2MiYNkclNwDTjDehu0uxSC6tnomG45.G5XnDqI3ffUmfG1S9Tq4l2N+roycn8kSYeSGjdjliM4; Path=/; HttpOnly; Secure; SameSite=None

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
