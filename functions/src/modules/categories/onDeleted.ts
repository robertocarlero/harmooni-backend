import { onDocumentDeleted } from 'firebase-functions/v2/firestore';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';
import { deleteImages } from '../../helpers/images';

export const onDeleted = onDocumentDeleted(
	`${FIREBASE_COLLECTIONS.CATEGORIES.name}/{docId}`,
	async (event: any) => {
		const snap = event.data;
		const { image } = snap.data() || {};
		if (!image) return;

		await deleteImages(image);
	},
);
