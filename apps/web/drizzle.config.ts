import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL ?? 'file:local-data.sqlite'

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/lib/db/schema/index.ts',
    out: './drizzle',
    dbCredentials: {
        url: databaseUrl,
    },
    strict: true,
    verbose: true,
})
