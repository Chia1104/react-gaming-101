import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets-zod';
import { z } from 'zod';

import { Locale } from '@/enums/locale.enum';

export const getAppEnv = () => {
	if (process.env.NEXT_PUBLIC_APP_ENV) {
		return process.env.NEXT_PUBLIC_APP_ENV;
	}

	return 'development';
};

export const getSiteUrl = () => {
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return 'http://localhost:3000';
};

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'test', 'production']),
		SENTRY_AUTH_TOKEN: z.string().optional(),
		SENTRY_ORG: z.string().optional(),
		SENTRY_PROJECT: z.string().optional(),
	},

	client: {
		NEXT_PUBLIC_SITE_URL: z.string().min(1),
		NEXT_PUBLIC_APP_ENV: z.enum(['development', 'local', 'production', 'beta', 'gamma', 'test']),
		NEXT_PUBLIC_APP_VERSION: z.string().min(1),
		NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
		NEXT_PUBLIC_GTM_ID: z.string().optional(),
		NEXT_PUBLIC_GTM_AUTH: z.string().optional(),
		NEXT_PUBLIC_GTM_PREVIEW: z.string().optional(),
		NEXT_PUBLIC_GA_ID: z.string().optional(),
		NEXT_PUBLIC_DEFAULT_TIME_ZONE: z.string().min(1),
		NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(Locale),
		NEXT_PUBLIC_DEBUG_ZUSTAND_DEVTOOLS: z.string().optional(),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_APP_ENV: getAppEnv(),
		NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? 'develop',
		NEXT_PUBLIC_SITE_URL: getSiteUrl(),
		SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		SENTRY_ORG: process.env.SENTRY_ORG,
		SENTRY_PROJECT: process.env.SENTRY_PROJECT,
		NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
		NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
		NEXT_PUBLIC_GTM_AUTH: process.env.NEXT_PUBLIC_GTM_AUTH,
		NEXT_PUBLIC_GTM_PREVIEW: process.env.NEXT_PUBLIC_GTM_PREVIEW,
		NEXT_PUBLIC_DEFAULT_TIME_ZONE: process.env.NEXT_PUBLIC_DEFAULT_TIME_ZONE || 'Asia/Taipei',
		NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'zh-TW',
		NEXT_PUBLIC_DEBUG_ZUSTAND_DEVTOOLS:
			process.env.NEXT_PUBLIC_APP_ENV === 'production' ? process.env.NEXT_PUBLIC_DEBUG_ZUSTAND_DEVTOOLS : 'true',
	},

	skipValidation: process.env.SKIP_ENV_VALIDATION === 'true' || process.env.SKIP_ENV_VALIDATION === '1',

	emptyStringAsUndefined: true,

	extends: [vercel()],
});

export const IS_PRODUCTION = env.NEXT_PUBLIC_APP_ENV === 'production';
export const IS_DEV = env.NEXT_PUBLIC_APP_ENV === 'development' || env.NEXT_PUBLIC_APP_ENV === 'local';
