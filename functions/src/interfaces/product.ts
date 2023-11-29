import { Timestamp } from 'firebase-admin/firestore';
import { Image } from './image';

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	images?: Image[];
	date: Timestamp;
	active: boolean;
	category_id: string;
}
