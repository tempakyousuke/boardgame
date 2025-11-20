import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
	return {
		currentDisplayName: locals.user.displayName
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const newDisplayName = formData.get('displayName');

		if (
			typeof newDisplayName !== 'string' ||
			newDisplayName.length < 1 ||
			newDisplayName.length > 50
		) {
			return fail(400, {
				message: 'Display name must be between 1 and 50 characters'
			});
		}

		// Update display name in database
		try {
			await db
				.update(table.user)
				.set({ displayName: newDisplayName })
				.where(eq(table.user.id, locals.user.id));
		} catch (e) {
			console.error('Display name update error:', e);
			return fail(500, {
				message: 'An error occurred while updating display name'
			});
		}

		return redirect(302, '/');
	}
};
