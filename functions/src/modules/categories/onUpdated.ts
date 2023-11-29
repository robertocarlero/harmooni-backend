import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';
import { deleteImages } from '../../helpers/images';

export const onUpdated = onDocumentUpdated(
	`${FIREBASE_COLLECTIONS.CATEGORIES.name}/{docId}`,
	async (event: any) => {
		const beforeData = event?.data?.before?.data();
		const afterData = event?.data?.after?.data();

		if (!beforeData || !afterData) {
			return;
		}

		const image = afterData.image;
		const beforeImage = beforeData.image;

		if (beforeImage.path === image?.path) {
			return;
		}

		await deleteImages(beforeImage);
	},
);
