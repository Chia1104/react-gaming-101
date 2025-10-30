import { NextResponse } from 'next/server';

import { env } from '@/libs/env';

export const GET = () => {
	return NextResponse.json({
		app_env: env.NEXT_PUBLIC_APP_ENV,
		site_url: env.NEXT_PUBLIC_SITE_URL,
	});
};
