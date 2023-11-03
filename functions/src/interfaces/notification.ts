import { Timestamp } from 'firebase-admin/firestore';
import { Notification as FCMNotification } from 'firebase-admin/messaging';

export interface Notification extends FCMNotification {
	user_id?: string;
	topic?: string;
	date?: Timestamp;
	read?: boolean;
}
