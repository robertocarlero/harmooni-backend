import { Timestamp } from 'firebase-admin/firestore';
import { Image } from './image';

export interface Category {
	id: string;
	name: string;
	description: string;
	code: string;
	image?: Image;
	date: Timestamp;
	active: boolean;
	primary: boolean;
}
