import { init, replayIntegration, captureRouterTransitionStart } from '@sentry/nextjs';

import { env } from '@/libs/env';
import { logger } from '@/libs/utils/logger';

export const onRouterTransitionStart = captureRouterTransitionStart;

init({
	dsn: env.NEXT_PUBLIC_SENTRY_DSN,
	integrations: [replayIntegration()],
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	enabled: ['production', 'beta'].includes(env.NEXT_PUBLIC_APP_ENV),
	environment: env.NEXT_PUBLIC_APP_ENV,
});

logger('Client instrumentation initialized');
