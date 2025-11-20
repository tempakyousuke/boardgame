import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

export const load: PageServerLoad = async () => {
	const users = await db.select().from(table.user);
	return {
		users
	};
};

export const actions: Actions = {
	updatePassword: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const newPassword = formData.get('newPassword');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { message: 'Invalid user ID' });
		}

		if (typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 255) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			const passwordHash = await hash(newPassword, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, userId));

			return { success: true };
		} catch (e) {
			console.error('Update password error:', e);
			return fail(500, { message: 'An error occurred while updating the password' });
		}
	}
};
