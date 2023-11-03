import { initializeApp } from 'firebase-admin/app';

initializeApp();

import * as categories from './modules/categories';
import * as notifications from './modules/notifications';

export { categories, notifications };
