import withBundleAnalyzerImport from '@next/bundle-analyzer';
import { withSentryConfig as withSentryConfigImport } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

type Plugin = (config: NextConfig) => NextConfig;

const withBundleAnalyzer = withBundleAnalyzerImport({
	enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin({
	experimental: {
		// Provide the path to the messages that you're using in `AppConfig`
		createMessagesDeclaration: './messages/en-US.json',
	},
	requestConfig: './src/libs/i18n/request.ts',
});

const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block',
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN',
	},
	{
		key: 'Referrer-Policy',
		value: 'origin-when-cross-origin',
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
];

const nextConfig: NextConfig = {
	reactStrictMode: true,
	transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
	typedRoutes: true,
	reactCompiler: true,
	experimental: {
		optimizePackageImports: ['lodash-es'],
		viewTransition: true,
		authInterrupts: true,
	},
	serverExternalPackages: [],
	typescript: {
		ignoreBuildErrors: true,
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: securityHeaders,
			},
		];
	},
	rewrites: async () => [
		{
			source: '/sitemap-:id.xml',
			destination: '/sitemap.xml/:id',
		},
	],
};

const plugins: Plugin[] = [withBundleAnalyzer];

const nextComposePlugins = plugins.reduce((acc, plugin) => plugin(acc), nextConfig);

export default withSentryConfigImport(withNextIntl(nextComposePlugins), {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	silent: true,
	disableLogger: true,
	sourcemaps: {
		deleteSourcemapsAfterUpload: true,
	},
});
