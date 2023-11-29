import { onDocumentDeleted } from 'firebase-functions/v2/firestore';

import { deleteImages } from '../../helpers/images';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';

export const onDeleted = onDocumentDeleted(
	`${FIREBASE_COLLECTIONS.PRODUCTS.name}/{docId}`,
	async (event: any) => {
		const snap = event.data;
		const { images } = snap.data() || {};
		if (!images?.length) return;

		await deleteImages(images);
	},
);
