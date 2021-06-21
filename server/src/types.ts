import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { createUserLoader } from './utils/createUserLoader'
import { createUpdootLoader } from './utils/createUpdootLoader'

export type MyContext = {
	req: Request
	res: Response
	redis: Redis
	userLoader: ReturnType<typeof createUserLoader>
	updootLoader: ReturnType<typeof createUpdootLoader>
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23
declare module 'express-session' {
	export interface SessionData {
		userId: number
	}
}
