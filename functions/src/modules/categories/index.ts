import * as functions from 'firebase-functions';

import { getCategories, getCategory } from '../../api/categories';

const cors = require('cors')({ origin: true });

export const all = functions.https.onRequest((request, response) => {
	const params = request.query;

	cors(request, response, async () => {
		const data = await getCategories(params);
		response.send(data);
	});
});

export const one = functions.https.onRequest((request, response) => {
	const { id }: any = request.query;

	cors(request, response, async () => {
		const data = await getCategory(id);
		response.send(data);
	});
});

export * from './onDeleted';
export * from './onFileCreated';
export * from './onUpdated';
