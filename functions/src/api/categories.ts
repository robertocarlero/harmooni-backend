import { getFirestore } from 'firebase-admin/firestore';

import { transFormDoc } from '../helpers/docs';

import { Category } from '../interfaces/category';

import { FIREBASE_COLLECTIONS } from '../constants/collections';

const db = getFirestore();

const COLLECTION = FIREBASE_COLLECTIONS.CATEGORIES.name;

export const getCategory = async (id: string): Promise<Category | null> => {
	const category = await db.collection(COLLECTION).doc(id).get();

	const body = transFormDoc<Category>(category);

	return body;
};

export const getCategories = async ({
	active,
	orderBy = 'name',
	primary,
	order = 'asc',
}: {
	active?: 'true' | 'false' | boolean;
	primary?: 'true' | 'false' | boolean;
	orderBy?: string;
	order?: 'asc' | 'desc';
}): Promise<Category[]> => {
	let ref = db.collection(COLLECTION).orderBy(orderBy, order);

	if (active) {
		const value =
			active === 'true' ? true : active === 'false' ? false : active;
		ref = ref.where('active', '==', value);
	}

	if (primary) {
		const value =
			primary === 'true' ? true : primary === 'false' ? false : primary;
		ref = ref.where('primary', '==', value);
	}

	const data = await ref.get();

	const body = data.docs
		.map((doc) => transFormDoc<Category>(doc))
		.filter((doc) => doc);

	return (body as Category[]) || [];
};
