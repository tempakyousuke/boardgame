import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { hash, verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword');
		const newPassword = formData.get('newPassword');
		const confirmPassword = formData.get('confirmPassword');

		if (
			typeof currentPassword !== 'string' ||
			typeof newPassword !== 'string' ||
			typeof confirmPassword !== 'string'
		) {
			return fail(400, {
				message: 'Invalid form data'
			});
		}

		if (newPassword.length < 6 || newPassword.length > 255) {
			return fail(400, {
				message: 'New password must be between 6 and 255 characters'
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				message: 'New passwords do not match'
			});
		}

		// Get current user from database
		const [user] = await db.select().from(table.user).where(eq(table.user.id, locals.user.id));

		if (!user) {
			return fail(400, {
				message: 'User not found'
			});
		}

		// Verify current password
		const validPassword = await verify(user.passwordHash, currentPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, {
				message: 'Current password is incorrect'
			});
		}

		// Hash new password
		const newPasswordHash = await hash(newPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Update password in database
		try {
			await db
				.update(table.user)
				.set({ passwordHash: newPasswordHash })
				.where(eq(table.user.id, locals.user.id));
		} catch (e) {
			console.error('Password update error:', e);
			return fail(500, {
				message: 'An error occurred while updating password'
			});
		}

		return redirect(302, '/');
	}
};
