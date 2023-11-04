import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { getStorage } from 'firebase-admin/storage';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';

const storage = getStorage();

export const onDeleted = onDocumentDeleted(
	`${FIREBASE_COLLECTIONS.CATEGORIES.name}/{docId}`,
	async (event: any) => {
		const snap = event.data;
		const { image } = snap.data() || {};
		if (!image) return;

		const { path } = image;
		const file = storage.bucket().file(path);
		await file.delete();
	},
);
