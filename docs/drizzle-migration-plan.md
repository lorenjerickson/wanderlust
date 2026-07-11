# Drizzle ORM Migration Plan

## Outcome

Make the Drizzle TypeScript schema the new source of truth, establish the existing v0–v5 database as a baseline, and then migrate query modules incrementally. Do not regenerate the existing database from scratch or replay both migration systems against the same database.

The repository currently has:

- Six handwritten migrations tracked through `SCHEMA_VERSION`
- Direct access through `sqlite` and `sqlite3`
- Raw SQL spread across user, role, campaign, scenario, encounter, media, settings, authentication, and world-artifact services
- A 24-table actor-domain migration that should become the baseline for the aggregate Drizzle schema

## Recommended driver

Use Drizzle's `node:sqlite` integration and standardize the web application on Node 22. This avoids adding another native SQLite package and matches the current development environment.

If Node 18 compatibility must remain, choose `better-sqlite3` instead. That decision should be made before implementation because it changes connection creation and migration execution.

## 1. Establish safety and acceptance criteria

Before changing database code:

- Back up a representative `local-data.sqlite`.
- Capture the complete existing schema from `sqlite_master`.
- Record row counts and foreign-key checks.
- Add integration fixtures covering both a fresh database and a database already migrated through v5.
- Define success as:
  - no table or data loss;
  - zero foreign-key violations;
  - existing application behavior remains intact;
  - fresh and existing databases reach the same schema;
  - Drizzle Kit detects no unexpected schema drift.

## 2. Add Drizzle dependencies and configuration

Planned dependencies:

- Runtime: `drizzle-orm`
- Development: `drizzle-kit`

Add `apps/web/drizzle.config.ts` with:

- `dialect: "sqlite"`
- schema path under `src/lib/db/schema`
- migrations output under `apps/web/drizzle`
- database URL supplied through configuration rather than duplicated path logic

Add package scripts along these lines:

- `db:generate`
- `db:migrate`
- `db:check`
- `db:studio`
- `db:pull`
- `db:export`

Use `generate` and `migrate` for committed migrations. Reserve `push` for disposable development databases; it should not be the normal migration workflow. Drizzle officially supports schema generation, migration application, introspection, and migration consistency checking through these commands. See the [Drizzle Kit overview](https://orm.drizzle.team/docs/kit-overview).

## 3. Convert the aggregate schema into modules

Split the schema by domain instead of creating one enormous file:

```text
src/lib/db/
  schema/
    auth.ts
    users.ts
    campaigns.ts
    worlds.ts
    actors.ts
    catalogs.ts
    professions.ts
    inventory.ts
    effects.ts
    images.ts
    generation.ts
    relations.ts
    index.ts
```

Convert all existing v0–v5 tables, not only actor tables. The existing database is the compatibility contract.

Each module should define:

- `sqliteTable` declarations
- foreign keys and delete behavior
- check constraints
- ordinary, unique, expression, and partial indexes
- inferred select/insert types
- relations used by relational queries

Keep database names in their current snake/camel casing initially. Renaming legacy columns while introducing Drizzle would unnecessarily combine ORM migration with data migration.

## 4. Model values deliberately

Use:

- SQLite `text` for IDs and timestamps, preserving the current database representation
- typed text columns for status/category unions
- integer booleans with `{ mode: "boolean" }` where compatible
- JSON-mode text columns for tags, variants, contexts, and generation outputs
- explicit checks for JSON validity and domain limits
- reusable audit-column helpers to keep the 24 actor-domain tables consistent

Do not model calculated values as stored columns:

- effective attributes
- abilities
- current health
- defense
- derived movement speeds
- active modifier totals

These remain query/domain calculations over stored base values and effect records.

## 5. Preserve SQL that Drizzle cannot express completely

The current schema includes features requiring special attention:

- FTS5 virtual tables
- FTS synchronization triggers
- immutable actor-name trigger
- expression indexes such as `lower(name)`
- partial unique indexes
- `CHECK` constraints containing cross-column logic
- SQLite pragmas

Represent supported indexes and checks in the Drizzle schema. Preserve unsupported or awkward constructs in custom SQL migrations. Drizzle Kit explicitly supports custom SQL migrations for DDL it cannot generate itself. See [Custom migrations](https://orm.drizzle.team/docs/kit-custom-migrations).

## 6. Create the Drizzle baseline

This is the most important transition step.

The existing v0–v5 schema has already been applied to some databases, while Drizzle normally tracks migrations in its own migration journal. Therefore:

1. Build the Drizzle schema until its exported DDL matches the schema produced by v0–v5.
2. Generate an initial Drizzle migration and snapshot.
3. Treat that migration as the baseline for brand-new databases.
4. Create a one-time adoption procedure for existing databases that marks the baseline as applied without executing its table-creation SQL.
5. Verify that the Drizzle baseline and a legacy v5 database are structurally equivalent.
6. Freeze the handwritten migration system after v5.

Do not run the generated baseline normally against an existing v5 database; `CREATE TABLE` collisions and migration-history divergence would result.

Drizzle Kit's `generate` command compares the current TypeScript schema with its stored schema snapshots, so creating a correct initial snapshot is essential for every later migration. See [Drizzle Kit generate](https://orm.drizzle.team/docs/drizzle-kit-generate).

## 7. Replace migration execution

Replace the custom `SCHEMA_VERSION` runner with one Drizzle migration path.

Recommended deployment behavior:

- Generate migration SQL during development.
- Commit SQL and Drizzle metadata.
- Run migrations once during deployment/startup under an explicit migration command.
- Avoid having every application instance race to migrate on startup.
- Retain:
  - `foreign_keys = ON`
  - WAL mode
  - a busy timeout
  - consistent connection pragmas

Keep `SCHEMA_VERSION` temporarily for compatibility and diagnostics, but stop using it to decide future migrations. Remove it only in a later cleanup migration after all known databases have adopted the Drizzle journal.

## 8. Introduce the Drizzle database boundary

Refactor `getDb()` to return a typed Drizzle database while keeping the underlying connection private.

The database module should own:

- database path resolution
- connection singleton/lifecycle
- pragmas
- schema binding
- migration entry point
- test database creation

Prevent server modules from importing the raw SQLite client. Raw SQL should go through Drizzle's SQL template when necessary.

## 9. Migrate queries incrementally

Suggested order:

1. Roles and settings
2. Users and authentication
3. Media
4. Worlds and world artifacts
5. Campaigns, scenarios, and encounters
6. Actor catalogs
7. Actors and participation
8. Inventory, grants, effects, images, and AI records

For each module:

- replace manual row interfaces with `$inferSelect` and `$inferInsert`;
- translate CRUD queries;
- preserve existing mapping functions at the API boundary initially;
- add transaction boundaries for multi-table writes;
- compare old and new query results against the same fixture database;
- remove raw-driver access only after parity tests pass.

This incremental cutover avoids one large application rewrite.

## 10. Validate the actor schema specifically

Add schema-level tests for:

- case-insensitive active actor-name uniqueness;
- name reuse after soft deletion;
- immutable names;
- exactly one active campaign per actor;
- one ethnicity, primary profession, optional secondary profession, and optional talent;
- deduplicated trait and quirk snapshots with multiple grant sources;
- profession-rank advancement uniqueness;
- inventory stack limits and occupied container slots;
- equipment-slot uniqueness;
- effect refresh identity;
- one active portrait and token;
- token MIME restrictions and 5 MB file limit;
- cascade behavior when users, actors, campaigns, and catalog records are deleted.

Also test the limitations that remain application-enforced, such as container capacity, slot compatibility, catalog subtype correctness, and required finalized-actor artifacts.

## 11. CI and operating workflow

CI should run:

1. Typecheck.
2. `drizzle-kit check`.
3. Apply all migrations to an empty temporary database.
4. Run `PRAGMA foreign_key_check`.
5. Apply the legacy-to-Drizzle adoption path to a v5 fixture.
6. Compare both resulting schemas.
7. Run repository and integration tests.

Normal future workflow:

1. Edit the Drizzle schema.
2. Run `drizzle-kit generate`.
3. Review generated SQL.
4. Add custom SQL when needed.
5. Run migration tests.
6. Commit schema, SQL, and Drizzle snapshots together.

## Suggested implementation phases

- **Phase 1:** dependencies, configuration, aggregate schema, baseline, and schema-equivalence tests
- **Phase 2:** Drizzle connection and migration runner
- **Phase 3:** incremental raw-query conversion
- **Phase 4:** remove the old migration runner and direct `sqlite` access
- **Phase 5:** remove obsolete dependencies and eventually retire `SCHEMA_VERSION`

The primary risk is not translating tables into Drizzle—it is safely reconciling Drizzle's migration journal with databases that already reached handwritten schema version 5. The baseline/adoption procedure should therefore be implemented and tested before any query layer is converted.
