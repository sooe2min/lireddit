import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { Request, Response } from 'express'

export type MyContext = {
	em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
	req: Request
	res: Response
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23
declare module 'express-session' {
	export interface SessionData {
		userId: number
	}
}
