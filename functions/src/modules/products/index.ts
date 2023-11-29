import * as functions from 'firebase-functions';
import { getProduct, getProducts } from '../../api/products';

const cors = require('cors')({ origin: true });

export const all = functions.https.onRequest((request, response) => {
	const params = request.query;

	cors(request, response, async () => {
		const data = await getProducts(params);
		response.send(data);
	});
});

export const one = functions.https.onRequest((request, response) => {
	const { id }: any = request.query;

	cors(request, response, async () => {
		const data = await getProduct(id);
		response.send(data);
	});
});

export * from './onDeleted';
export * from './onFileCreated';
export * from './onUpdated';
