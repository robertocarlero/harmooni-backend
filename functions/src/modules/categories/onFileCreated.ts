import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

import { onObjectFinalized } from 'firebase-functions/v2/storage';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';
import { generateThumbnail } from '../../helpers/images';
import { Image } from '../../interfaces/image';

const db = getFirestore();
const storage = getStorage();

export const onFileUpload = onObjectFinalized({ cpu: 2 }, async (event) => {
	const { contentType = '', size, name: filePath } = event.data;

	const nameParts = filePath.split('/');
	if (nameParts[0] !== FIREBASE_COLLECTIONS.CATEGORIES.name) return;

	const fileName = nameParts[nameParts.length - 1];
	if (fileName.startsWith('thumb_')) return;

	const id = nameParts[1];

	const file = storage.bucket().file(filePath);
	const url = await getDownloadURL(file);

	const path = `${FIREBASE_COLLECTIONS.CATEGORIES.name}/${id}`;
	const image: Image = {
		contentType,
		size: Number(size),
		path: filePath,
		name: fileName,
		url,
	};

	const thumbnail = await generateThumbnail(image);

	image.thumbnail = thumbnail;

	const body = {
		image,
		date: Timestamp.now(),
	};

	await db.doc(path).set(body, { merge: true });
});
