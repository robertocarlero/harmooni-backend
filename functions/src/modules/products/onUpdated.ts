import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { getStorage } from 'firebase-admin/storage';

import { Image } from '../../interfaces/image';
import { FIREBASE_COLLECTIONS } from '../../constants/collections';

const storage = getStorage();

export const onUpdated = onDocumentUpdated(
	`${FIREBASE_COLLECTIONS.PRODUCTS.name}/{docId}`,
	async (event: any) => {
		const beforeData = event?.data?.before?.data();
		const afterData = event?.data?.after?.data();

		if (!beforeData || !afterData) {
		}

		const images: Image[] = beforeData.images;

		images.forEach(async ({ path }) => {
			const afterImage = afterData?.images?.find(
				(img: Image) => img.path === path,
			);

			if (afterImage) return;

			const file = storage.bucket().file(path);
			await file.delete();
		});
	},
);
