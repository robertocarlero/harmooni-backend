import { getFirestore } from 'firebase-admin/firestore';

import { transFormDoc } from '../helpers/docs';

import { Product } from '../interfaces/product';

import { FIREBASE_COLLECTIONS } from '../constants/collections';

const db = getFirestore();

const COLLECTION = FIREBASE_COLLECTIONS.PRODUCTS.name;

export const getProduct = async (id: string): Promise<Product | null> => {
	const Product = await db.collection(COLLECTION).doc(id).get();

	const body = transFormDoc<Product>(Product);

	return body;
};

export const getProducts = async ({
	category,
	active,
	orderBy = 'name',
	order = 'asc',
}: {
	category?: string;
	active?: 'true' | 'false' | boolean;
	orderBy?: string;
	order?: 'asc' | 'desc';
}): Promise<Product[]> => {
	let ref = db.collection(COLLECTION).orderBy(orderBy, order);

	if (active) {
		const value =
			active === 'true' ? true : active === 'false' ? false : active;
		ref = ref.where('active', '==', value);
	}

	if (category) {
		ref = ref.where('category', '==', category);
	}

	const data = await ref.get();

	const body = data.docs
		.map((doc) => transFormDoc<Product>(doc))
		.filter((doc) => doc);

	return (body as Product[]) || [];
};
