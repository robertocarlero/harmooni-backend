import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

import { onObjectFinalized } from 'firebase-functions/v2/storage';

import { FIREBASE_COLLECTIONS } from '../../constants/collections';

const db = getFirestore();
const storage = getStorage();

export const onFileUpload = onObjectFinalized({ cpu: 2 }, async (event) => {
	const { contentType, size, name: filePath } = event.data;

	const nameParts = filePath.split('/');
	if (nameParts[0] !== FIREBASE_COLLECTIONS.CATEGORIES.name) return;

	const fileName = nameParts[nameParts.length - 1];
	const fileNameParts = fileName.split('-');
	const id = fileNameParts[0];
	const name = fileNameParts.slice(1).join('-');

	const file = storage.bucket().file(filePath);
	const url = await getDownloadURL(file);

	const path = `${FIREBASE_COLLECTIONS.CATEGORIES.name}/${id}`;

	const body = {
		image: {
			contentType,
			size,
			path: filePath,
			name,
			url,
		},
		date: Timestamp.now(),
	};

	await db.doc(path).set(body, { merge: true });
});
