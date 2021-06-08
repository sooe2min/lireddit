import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { createClient } from '@urql/core'
import { Provider } from 'urql'

const client = createClient({
	url: 'http://localhost:4000/graphql'
})

function MyApp({ Component, pageProps }: any) {
	return (
		<Provider value={client}>
			<Component {...pageProps} />
		</Provider>
	)
}

export default MyApp
