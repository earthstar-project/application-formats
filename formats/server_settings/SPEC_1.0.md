# Server settings format

<dl>
	<dt>Namespace</dt><dd>`server-settings`</dd>
	<dt>Version</dt><dd>1.0</dd>
</dl>

This is an application format for describing the configuration of an Earthstar
server's hosted shares.

More settings may be added in future versions.

## Hosted shares

Earthstar peers must know which shares to store and replicate ahead of time.

This application format represents each share for a server to host with a single
document. A share can also be hosted temporarily by using an ephemeral document.

### Hosted share document path

The path format is:

```
/server-settings/1.0/shares/{HASH_OF_SHARE}/{HOST_TYPE}
```

- Where `HASH_OF_SHARE` MUST be a base32 string of the SHA-256 hash of the
  share's public address, prepended with `b`.
- And `HOST_TYPE` is `host` if the setting is not temporary, and `host!` if the
  setting is temporary.

### Hosted share document fields

- The `text` property of the document MUST be the public address of the share to
  be hosted **OR** an empty string, indicating that this share should no longer
  be hosted.
- If the hosted share setting is temporary, the `deleteAfter` field must be the
  timestamp in microseconds for when the share should be hosted until.

### Interpreting hosted documents

Because they have different paths, it is possible for an ephemeral hosted share
document and non-ephemeral hosted share document to co-exist at the same time:

```
/server-settings/1.0/shares/babcd/host!
/server-settings/1.0/shares/babcd/host
```

The documents may also have different values (e.g. one may be empty and one may
be defined).

In this scenario we follow OR logic:

- If both documents have an empty text field, the share must not be hosted.
- If either document has the share address in its text field, the share must be
  hosted.
- If both documents have the share address in their text fields, the share must
  be hosted.

## Notes

A hash of the hosted share's address is used in the path so that a setting which
is later removed (by wiping the `text` property of the document) does not leave
an unremovable history of which shares the server has hosted.
