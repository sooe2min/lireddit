import {
	EntityManager,
	IDatabaseDriver,
	Connection
} from '@mikro-orm/core'
import { Request, Response } from 'express'
import { Redis } from 'ioredis'

export type MyContext = {
	em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
	req: Request
	res: Response
	redis: Redis
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23
declare module 'express-session' {
	export interface SessionData {
		userId: number
	}
}
