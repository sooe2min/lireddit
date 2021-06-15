import { MyContext } from 'src/types'
import { AuthChecker } from 'type-graphql'

export const authChecker: AuthChecker<MyContext> = ({
	context: { req }
}) => {
	if (!req.session.userId) throw new Error('not authenticated')
	return true
}
