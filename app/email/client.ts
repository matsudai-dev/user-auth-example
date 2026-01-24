import { Resend } from "resend";

const clientCache = new Map<string, Resend>();

export function getEmailClient(apiKey: string): Resend {
	const cachedClient = clientCache.get(apiKey);

	if (cachedClient) {
		return cachedClient;
	}

	const client = new Resend(apiKey);

	clientCache.set(apiKey, client);

	return client;
}
