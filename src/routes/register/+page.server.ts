import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { hash } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const displayName = formData.get('displayName');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		if (typeof displayName !== 'string' || displayName.length < 1 || displayName.length > 50) {
			return fail(400, {
				message: 'Display name must be between 1 and 50 characters'
			});
		}

		const userId = crypto.randomUUID();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({
				id: userId,
				username,
				passwordHash,
				displayName
			});

			const token = auth.generateSessionToken();
			const session = await auth.createSession(token, userId);
			auth.setSessionTokenCookie(cookies, token, session.expiresAt);
		} catch (e) {
			console.error('Registration error:', e);
			return fail(500, {
				message: 'An error has occurred'
			});
		}
		return redirect(302, '/');
	}
};
