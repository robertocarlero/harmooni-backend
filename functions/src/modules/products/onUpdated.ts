import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

import { deleteImages } from '../../helpers/images';

import { Image } from '../../interfaces/image';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';

export const onUpdated = onDocumentUpdated(
	`${FIREBASE_COLLECTIONS.PRODUCTS.name}/{docId}`,
	async (event: any) => {
		const beforeData = event?.data?.before?.data();
		const afterData = event?.data?.after?.data();

		if (!beforeData || !afterData) return;

		const images: Image[] = beforeData.images;

		images.forEach(async (image) => {
			const afterImage = afterData?.images?.find(
				({ path }: Image) => image.path === path,
			);

			if (afterImage) return;

			await deleteImages(image);
		});
	},
);
