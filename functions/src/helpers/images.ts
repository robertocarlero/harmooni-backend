import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import * as sharp from 'sharp';
import * as path from 'path';

import { Image } from '../interfaces/image';

const storage = getStorage();

const deleteFile = async ({ path: filePath }: Image) => {
	if (!filePath) return;
	const file = storage.bucket().file(filePath);
	const exists = await file.exists();

	if (!exists[0]) return;

	await file.delete();
};

export const deleteImages = async (data: Image | Image[]) => {
	if (typeof data !== 'object') return;

	const images = Array.isArray(data) ? data : [data];

	for (const image of images) {
		const { thumbnail } = image;
		await deleteFile(image);

		if (!thumbnail) continue;

		await deleteFile(thumbnail);
	}
};

export async function generateThumbnail(image: Image, imageWidth = 200) {
	const { contentType, path: filePath, name } = image;
	const isAnImage = contentType && contentType.startsWith('image/');
	const isAlreadyAThumbnail = name.startsWith('thumb_');

	if (!isAnImage || isAlreadyAThumbnail) return null;

	const fileBucket = storage.bucket();
	const downloadResponse = await fileBucket.file(filePath).download();
	const imageBuffer = downloadResponse[0];

	const { width = 1600, height = 900 } = await sharp(imageBuffer).metadata(); // default to 16:9
	const thumbnailHeight = Math.round(imageWidth / (width / height)); // preserve aspect ratio
	const options = { width: imageWidth, height: thumbnailHeight };

	const thumbnailBuffer = await sharp(imageBuffer).resize(options).toBuffer();
	const thumbFileName = `thumb_${name}`; // thumb_myImage.jpg
	const thumbFilePath = path.join(path.dirname(filePath), thumbFileName); // categories/123/thumb_myImage.jpg
	const file = fileBucket.file(thumbFilePath);
	await file.save(thumbnailBuffer, { metadata: { contentType } });

	const url = await getDownloadURL(file);

	return {
		contentType,
		size: thumbnailBuffer.length,
		path: thumbFilePath,
		name: thumbFileName,
		url,
	} as Image;
}
