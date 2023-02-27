# Earthstar application formats

Application formats are ways of representing certain kinds of organised data
(e.g. profile info, chat messages, server settings) as Earthstar documents.

For example, a user's display name should be kept on a document with the path
`/about/1.0/displayName`, or their avatar at `/about/1.0/avatar.jpg`.

Having coordinated standards for how to store and retrieve documents means
users' data can be reused across many different applications (e.g. the same
avatar across many apps).

It also makes it easier to build different clients acting on the same kinds of
data — e.g. chatrooms, calendars, or lists — which will hopefully counteract
centralisation around slow-moving, hard-to-modify monolithic clients.

## Formats

- **About**. Personal information associated with author keypairs.
- **Server settings**. Configure which shares an Earthstar server should host.

## Contributing a format

### Namespace

Each application format must have a separate namespace, e.g. `about`, or
`server-settings`.

This namespace must be used as the first path segment of any paths related to
the application format:

```
/about/1.0/~@gwil.b63a5eqlqqkv5im37s6vebgf3ledhkyt63gzt4ylvcyatlxmrprma/displayName`

/chat/1.0/messages/1394832504
```

### Version number

Each application format's second path segment must be a version number, made up
of `{MAJOR_VERSION}.{MINOR_VERSION}`. Both `MAJOR_VERSION` and `MINOR_VERSION`
must be positive integers.

Valid version numbers: `1.0`, `2.0`, `2.1`

Invalid version numbers: `1.0.0`, `2.b`, `latest`.

A separate file should be used for each version of the application format in
this repo, e.g. `/application formats/my_application format/1.0.ts`

#### Determining minor or major version updates

If a application format is updated in such a way where all documents created by
previous versions of the application format are still included in the new
application format, the new version is a minor update (e.g. `1.0` → `1.1`).

If a application format is updated in such a way where documents created or read
by the previous version of the application format are no longer included in the
new application format, the new version is a major update (e.g. `1.0` → `2.0`)
with breaking changes.

### Application format specification

Because implementations can contain bugs and applications' needs vary, a written
specification is required.

The written specification must be a markdown file with a title with with the
format `SPEC_{VERSION}.md`.

The specification MUST detail the application format's namespace and version.

The specification MUST describe the purpose of the application format and how
documents following its application format should be interpreted.

The specification MUST describe how to author documents conformant with its
application format, e.g. how paths should be formatted, valid values for fields
like `text`.

### Example code

An application format MAY provide a module of functions which assist in the
reading and writing of application format-conformant documents.

### Proposal submission

A pull request with a valid specification should be made to the
[application-formats repository](https://github.com/earthstar-project/application-formats).
