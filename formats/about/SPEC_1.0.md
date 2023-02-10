# About format

<dl>
	<dt>Namespace</dt><dd>`about`</dd>
	<dt>Version</dt><dd>1.0</dd>
</dl>

This is an application format for describing personal information (e.g. display
names, avatars, bios) associated with particular author keypairs.

## Keypair association

Personal information should only be publishable and modifiable by the holder of
a specific keypair.

Therefore, each documents following this format is prefixed with the following:

`/about/1.0/~{KEYPAIR_ADDRESS}`

Where `KEYPAIR_ADDRESS` is the full public address of the keypair associated
with this document, e.g.
`@suzy.bo5sotcncvkr7p4c3lnexxpb4hjqi5tcxcov5b4irbnnz2teoifua`.

The presence of an author keypair prefixed with a tilde in a path invokes path
ownership, and only this keypair will be able to write to these paths.

## Display names

Author keypairs begin with a shortname to make the keypair easier to identify,
e.g. `suzy`. These shortnames cannot be changed and are always four characters
long. This makes them unsuitable for most names and the fluctuating nature of
identity.

Therefore it is desirable to have a free-form display name which can be changed
at any time, and which can differ between each share.

### Display name document path

The path format of a display name document is:

```
`/about/1.0/~{KEYPAIR_ADDRESS}/displayName
```

### Display name document fields

The `text` property of the document is the display name the keypair's owner
wishes to use. It can be any UTF-8 string.

## Avatars

An image can be associated with an author keypair.

### Avatar document path

The path format of a display name document is:

```
`/about/1.0/~{KEYPAIR_ADDRESS}`/avatar.{IMAGE_EXTENSION}
```

where `IMAGE_EXTENSION` MUST be the file extension of an image format (e.g.
`gif`, `jpg`, `png`) which allows clients to know how to interpret the
attachment data for this document.

### Avatar document fields

- The `text` property of the document MUST be a textual description of the
  avatar image's contents, for use with screenreaders etc.
- The attachment of the document MUST be an image file.
  - The image SHOULD have a 1:1 aspect ratio.
    - The image SHOULD NOT be larger than 1,000,000 bytes. These images may be
      presented in interfaces where they are rendered alongside many other
      avatars, and which may impact the performance of rendering.

## Status

A status message (e.g. "Away from keyboard") can optionally be associated with
an author keypair.

## Status document path

The path format of a status document is:

```
`/about/1.0/~{KEYPAIR_ADDRESS}`/status
```

## Status document fields

The `text` property of the document is the status message the author wishes to
associate with their keypair. It can be any UTF-8 string. The status message
SHOULD be equal or less to 128 characters.

## Biography

Some biographical information can optionally be associated with an author
keypair.

## Biography document path

The path format of a biography document is:

```
`/about/1.0/~{KEYPAIR_ADDRESS}`/bio
```

## Status document fields

The `text` property of the document is the biography message the author wishes
to associate with their keypair. It can be any UTF-8 string of any length.
