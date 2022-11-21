# Earthstar Schemas

Earthstar schemas are ways of representing certain kinds of organised data (e.g.
profile info, chat messages, server configs) as Earthstar documents.

For example, a user's display name should be kept on a document with the path
`/about/1.0.0/displayName`, or their avatar at `/about/1.0.0/avatar.jpg`.

Having coordinated standards for how to store and retrieve documents means
users' data can be reused across many applications using Earthstar under the
hood (e.g. the same avatar across many apps).

It also makes it easier to build different clients acting on the same kinds of
data, e.g. chatrooms, calendars, or todo lists.

This is a repo of Earthstar community endorsed and maintained schemas.

## Layers

- **Server settings**. Configure which shares an Earthstar server should host.

### Todo

- **About**. Display name, avatar, user-definable profile fields.

## Contributing a schema

### Namespace

Each schema must have a separate namespace, e.g. `about`, or `server-settings`.

This namespace must be used as the first path segment of any paths related to
the schema:

```
/about/1.0.0/~@gwil.b63a5eqlqqkv5im37s6vebgf3ledhkyt63gzt4ylvcyatlxmrprma/displayName`

/chat/1.0.0/messages/1394832504
```

### Version number

Each schema's second path segment must be a version number, made up of
`{MAJOR_VERSION}.{MINOR_VERSION}`. Both `MAJOR_VERSION` and `MINOR_VERSION` must
be positive integers.

Valid version numbers: `1.0`, `2.0`, `2.1`

Invalid version numbers: `1.0.0`, `2.b`, `latest`.

A separate file should be used for each version of the schema in this repo, e.g.
`/schemas/my_schema/1.0.ts`

### Schema contents

A valid schema includes exports which assist in _querying_ and _writing_ data
relevant to the schema to an Earthstar replica. Some examples:

- Path templates to be used with `Earthstar.queryByTemplate` or
  `extractTemplateVariablesFromPaths`
- Globs to be used with `Earthstar.queryByGlob`
- Helper functions or classes to generate new documents which belong to this
  schema
- Helper functions or classes to read and process documents belonging to this
  schema

If the schema is complex, a specification goes a long way.

#### Determining minor or major version updates

If a schema is updated in such a way where all documents created by previous
versions of the schema are still included in the new schema, the new version is
a minor update (e.g. `1.0` → `1.1`).

If a schema is updated in such a way where documents created or read by the
previous version of the schema are no longer included in the new schema, the new
version is a major update (e.g. `1.0` → `2.0`) with breaking changes.
