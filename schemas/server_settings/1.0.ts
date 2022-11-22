import { Earthstar } from "../../deps.ts";

/** @module Server Settings Schema - v1.0.0
 *
 * 	Specify which shares a replica server should host.
 */

const SERVER_SETTINGS = "server-settings";
const SCHEMA_VERSION = "1.0.0";

/** A template for a document representing a hosted share.
 *
 * Example matching path: `/server-settings/1.0.0/shares/+gardening.bhyux4opeug2ieqcy36exrf4qymc56adwll4zeazm42oamxtr7heq`
 *
 * The presence of this document indicates that the share in the path name should be hosted by the replica server.
 *
 * ```
 * const matchingDocs = queryByTemplate(replica, HOSTED_SHARE_TEMPLATE);
 *
 * const shareName = extractTemplateVariablesFromPath(HOSTED_SHARE_TEMPLATE, examplePath);
 * // +gardening.bhyux4opeug2ieqcy36exrf4qymc56adwll4zeazm42oamxtr7heq
 * ```
 */
export const HOSTED_SHARE_TEMPLATE =
  `/${SERVER_SETTINGS}/1.*/shares/{shareName}`;

/** A template for a document representing a temporarily hosted share.
 *
 * Example matching path: `/server-settings/1.0.0/shares/!+gardening.bhyux4opeug2ieqcy36exrf4qymc56adwll4zeazm42oamxtr7heq`
 *
 * The presence of this document indicates that the share in the path name should be hosted by the replica server until the timestamp indicated in the corresponding document's `deleteAfter` field is reached.
 *
 * ```
 * const matchingDocs = queryByTemplate(replica, TEMPORARY_HOSTED_SHARE_TEMPLATE);
 *
 * const shareName = extractTemplateVariablesFromPath(TEMPORARY_HOSTED_SHARE_TEMPLATE, examplePath);
 * // +gardening.bhyux4opeug2ieqcy36exrf4qymc56adwll4zeazm42oamxtr7heq
 * ```
 */
export const TEMPORARY_HOSTED_SHARE_TEMPLATE =
  `/${SERVER_SETTINGS}/1.*/shares/!{shareName}`;

/** Utility to help create a hosted share document.
 *
 * ```
 * 	const hostedShareInput = createHostedShareDocInput(
 *  	"+gardening.bhyux4opeug2ieqcy36exrf4qymc56adwll4zeazm42oamxtr7heq"
 *  );
 * 	await replica.set(authorKeypair, hostedShareInput)
 *
 * ```
 *
 * @param share - The share to add as a hosted share
 * @param deleteAfter - Optional time in microseconds to delete this configuration by.
 */
export function createHostedShareDocInput(
  share: string,
  deleteAfter?: number,
): Omit<Earthstar.DocInputEs5, "format"> {
  return {
    path: `/${SERVER_SETTINGS}/${SCHEMA_VERSION}/shares/${
      deleteAfter ? "!" : ""
    }${share}`,
    text: JSON.stringify(true),
    deleteAfter,
  };
}

export async function getHostedShares(
  replica: Earthstar.Replica,
): Promise<Earthstar.ShareAddress[]> {
  // Get shares configured by settings.
  const hostedShares = await Earthstar.queryByTemplate(
    replica,
    HOSTED_SHARE_TEMPLATE,
  );

  const temporarilyHostedShares = await Earthstar.queryByTemplate(
    replica,
    TEMPORARY_HOSTED_SHARE_TEMPLATE,
  );

  const shares: Earthstar.ShareAddress[] = [];

  for (const hostedShareDoc of hostedShares) {
    const variables = Earthstar.extractTemplateVariablesFromPath(
      HOSTED_SHARE_TEMPLATE,
      hostedShareDoc.path,
    );

    if (variables && variables["shareName"]) {
      shares.push(variables["shareName"]);
    }
  }

  for (const hostedShareDoc of temporarilyHostedShares) {
    const variables = Earthstar.extractTemplateVariablesFromPath(
      TEMPORARY_HOSTED_SHARE_TEMPLATE,
      hostedShareDoc.path,
    );

    if (variables && variables["shareName"]) {
      shares.push(variables["shareName"]);
    }
  }

  return shares;
}
