import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
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
		const password = formData.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid username or password'
			});
		}

		const [user] = await db.select().from(table.user).where(eq(table.user.username, username));

		if (!user) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await verify(user.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const token = auth.generateSessionToken();
		const session = await auth.createSession(token, user.id);
		auth.setSessionTokenCookie(cookies, token, session.expiresAt);

		return redirect(302, '/');
	}
};
