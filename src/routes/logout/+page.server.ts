import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as auth from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(locals.session.id);
		auth.deleteSessionTokenCookie(cookies);

		return redirect(302, '/login');
	}
};
