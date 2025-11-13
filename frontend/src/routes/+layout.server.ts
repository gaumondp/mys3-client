import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
	const lang = request.headers.get('accept-language')?.split(',')[0] || 'en';
	return { lang };
};
