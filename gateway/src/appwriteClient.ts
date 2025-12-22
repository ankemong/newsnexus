import { Client, Databases, Account, Avatars, Functions } from 'appwrite';

/*
 * Centralised Appwrite SDK instance for server-side use only.
 * NEVER import this file in browser code – it contains the secret API Key
 * provided via environment variable.
 */

const endpoint = process.env.APPWRITE_ENDPOINT;
const project  = process.env.APPWRITE_PROJECT;
const apiKey   = process.env.APPWRITE_SECRET_KEY;

if (!endpoint || !project || !apiKey) {
  throw new Error('Appwrite env vars missing: APPWRITE_ENDPOINT / APPWRITE_PROJECT / APPWRITE_SECRET_KEY');
}

// Note: `setKey` is available at runtime for server-side Appwrite SDK,
// but the current type definitions don't include it, so we cast to `any`.
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(project);

(client as any).setKey(apiKey);

export const databases  = new Databases(client);
export const account    = new Account(client);
export const avatars    = new Avatars(client);
export const functions  = new Functions(client);
export default client;

