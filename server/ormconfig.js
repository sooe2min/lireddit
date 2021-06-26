module.exports = {
	type: 'postgres',
	// host: 'localhost',
	// port: 5432,
	// username: 'postgres',
	// password: 'e2e2',
	// database: 'lireddit2',
	url: process.env.DATABASE_URL,
	synchronize: true,
	logging: true,
	entities: ['dist/entities/**/*.js'],
	migrations: ['dist/migrations/**/*.js'],
	cli: {
		entitiesDir: 'dist/entities',
		migrationsDir: 'dist/migrations',
		subscribersDir: 'dist/subscribers'
	}
}
