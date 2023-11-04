import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { getStorage } from 'firebase-admin/storage';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';

const storage = getStorage();

export const onUpdated = onDocumentUpdated(
	`${FIREBASE_COLLECTIONS.CATEGORIES.name}/{docId}`,
	async (event: any) => {
		const beforeData = event?.data?.before?.data();
		const afterData = event?.data?.after?.data();

		if (!beforeData || !afterData) {
			return;
		}

		const image = afterData.image;
		const beforePath = beforeData?.image?.path;

		if (beforePath === image?.path) {
			return;
		}
		const file = storage.bucket().file(beforePath);
		const exists = await file.exists();

		if (!exists[0]) {
			return;
		}

		await file.delete();
	},
);
