import { DocumentSnapshot } from 'firebase-admin/firestore';

export const transFormDoc = <T>(doc: DocumentSnapshot): T | null => {
	if (!doc.exists) return null;

	return {
		id: doc.id,
		...(doc.data() as T),
	} as T;
};
