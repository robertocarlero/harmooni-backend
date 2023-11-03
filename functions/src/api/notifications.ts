import { MulticastMessage, getMessaging } from 'firebase-admin/messaging';

import { getUser } from './users';

import { Notification } from '../interfaces/notification';
import { getFirestore } from 'firebase-admin/firestore';
import { FIREBASE_COLLECTIONS } from '../constants/collections';

const messaging = getMessaging();
const db = getFirestore();

export async function getUserTokens(userId: string): Promise<string[]> {
	const { fcm_tokens } = (await getUser(userId)) || {};

	return fcm_tokens || [];
}

export async function sendNotification(message: Notification) {
	try {
		const tokens = await getUserTokens(message.user_id || '');
		if (!tokens.length) return;

		const body: MulticastMessage = {
			tokens,
			notification: {
				title: message.title,
				body: message.body,
				imageUrl: message.imageUrl,
			},
		};

		const { successCount, failureCount } =
			await messaging.sendEachForMulticast(body);
		console.log(
			`Successfully sent: ${successCount} -- Failed: ${failureCount}`,
		);
	} catch (error) {
		console.log('Error sending notification:', error);
	}
}

export async function addNotification(message: Notification) {
	return await db
		.collection(FIREBASE_COLLECTIONS.NOTIFICATIONS.name)
		.add(message);
}
