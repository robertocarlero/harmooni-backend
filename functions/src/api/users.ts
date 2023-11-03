import { getFirestore } from 'firebase-admin/firestore';

import { transFormDoc } from '../helpers/docs';

import { User } from '../interfaces/user';

import { FIREBASE_COLLECTIONS } from '../constants/collections';

const db = getFirestore();

export const getUser = async (userId: string): Promise<User | null> => {
	const user = await db
		.collection(FIREBASE_COLLECTIONS.USERS.name)
		.doc(userId)
		.get();

	const body = transFormDoc<User>(user);

	return body;
};
