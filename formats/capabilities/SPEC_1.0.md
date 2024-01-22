# Capability format

<dl>
	<dt>Namespace</dt><dd>`capabilities`</dd>
	<dt>Version</dt><dd>1.0</dd>
</dl>

This is an application format for continuous sharing and minting of capability information

## Subspace

### Communal Namespaces

Capabilities are issued by an entity, and are therefore published under the issuing entities subspace.

### Owned Namespaces

The use of an owned Namespace depends on the owner - so they should set the rules on which subspace to use.
In practice - if you only have the ability to write in one subspace, you'd presumably publish the capabilities there.

## Public capabilities

The knowledge that you've issued capabilities to the receiver will be public for all. The contents, however, will be encrypted, so the capabilities / subspaces / paths they've been granted access to will not be public.

`/capabilities/1.0/public/{receiver-pubkey}/{id}`

## Private Capabilities

You may want to publish these entries to all (e.g. You'd like help from everyone in the network to distribute, because you don't have a direct peer with the recipient),
while not allowing people to know who you're actually granting these to.

More formally, given the issuer, a path a capability is published under, and a proposed receiver, it should not be possible for anyone else to know if that is the correct receiver.

For such cases instead of publishing these under the pubkey of the receiving entity, they are instead published under `encrypt(receiver, concat(receiver-pubkey, nonce))`. The receiver must attempt to decrypt all paths until they find their one. The issuer should save and use the same nonce in future so this only needs to happen once.

`/capabilities/1.0/private/{encrypt(receiver, concat(receiver-pubkey, nonce))}/{id}`

## Capability document IDs

You may want one, or many, depending on the application, if you want to coordinate between multiple client devices etc. These are opaque to the receiver, who should decode all documents under the path prefix.

A suggested scheme for this would be using `/1`, `/2` etc. If you're merely extending the lifetime of an existing cap, then you can write to the same path. It doesn't matter if you have two clients that independently do this. If you want to change the contents, you should increment the number, and tombstone older entries. This behaviour doesn't handle the same user making changes to the same receiver's caps concurrently on two devices they own - only one will win.

## Payload format

These should be encrypted under the pubkey of the receiver of the capability. This prevents anyone from knowing which Namespace/Subspace/Path the capability is for

This should be a list of `McCapability` (TODO whatever the standard encoding of this is)

## Use cases

### week-by-week caps

Imagine you want to grant someone access to your social media posts (e.g. a private Twitter account), but you want to be able to revoke this in future. Granting someone an infinite length of time in a capability prevents you from ever being able to revoke this access. But while giving someone a capability document once is feasible, being able to continually do this while you're both offline is a challenge.

The solution is to grant two capabilities, first:

```
CommunalCapability:
  access_mode: read
  namespace_key: gardening.xxx...
  user_key: UserPublicKey
  delegations:
  - times: forever
    path: /capabilities/1.0/private/{their-bit}...
    subspace: you
```

This will allow them forever access - but only to capabilities specific to them.

Then you can put the actual week by week capability in there. Each time you make an entry, or regularly on expiry (whichever makes sense for your app), overwrite the entry at that path with a new capability, extending the time. This prevents there being lots of documents, and the first thing they can do on sync is get the latest capability, and then use that to sync all entries in the past. This could likely be done by the same client you're using to make the entries - if you aren't making you entries, the existing caps are sufficient. If you make an entry outside of the current end time, you'll want to update them all. Any peer will get the updated caps in the same sync as the new entries, whether that's a direct peer or via some pub/relay.

To stop someone accessing future Entries, stop updating the capability (and optionally tombstone the old one).

### Granting public access

For this to work, we generally want to get our capabilities into the hands of our desired recipient, but how do we bootstrap this? People can't request an entity without proving a right to receive it first. For online things, your website could mint the desired capabilitiy entry for their key - but we have the same problem as above for week-by-week caps, needing to update it continually. This means you need to know all your followers. For a generally-public account, this may be undesirable.

Grant a capability as follows:

```
CommunalCapability:
  access_mode: read
  namespace_key: gardening.xxx...
  user_key: btnaix46fptu7nj4hwhkusutly6vhjgbigi6ewnapykza66ucf24a
  delegations:
  - times: forever
    path: /capabilities/1.0/public/btnaix46fptu7nj4hwhkusutly6vhjgbigi6ewnapykza66ucf24a/default
    subspace: you
```

Publish this on your website, in your bio, etc.

This public key matches the secret key `bhxh7emac7wtpbwqog4k24kfgmvjwoejexb5523g6mg7tzi7uyiwa`

This will allow anyone who knows the secret (i.e. everyone. This could well be encoded into client apps by default) to sync the public-access capability.

You can then put the week-by-week caps into `/capabilities/1.0/public/btnaix46fptu7nj4hwhkusutly6vhjgbigi6ewnapykza66ucf24a/default`, for all the content you want to make public. This will sync to everyone else who's opted-in to syncing the public capability Namespace.
