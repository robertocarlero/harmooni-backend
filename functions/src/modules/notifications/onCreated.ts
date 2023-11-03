import { onDocumentCreated } from 'firebase-functions/v2/firestore';

import { sendNotification } from '../../api/notifications';
import { transFormDoc } from '../../helpers/docs';

import { Notification } from '../../interfaces/notification';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';

export const onCreated = onDocumentCreated(
	`${FIREBASE_COLLECTIONS.NOTIFICATIONS.name}/{docId}`,
	async (event: any) => {
		const notification = transFormDoc<Notification>(event.data);
		if (!notification?.user_id) return;

		await sendNotification(notification);
	},
);
