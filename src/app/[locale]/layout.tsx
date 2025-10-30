import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { getMessages, getTimeZone } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import AppPlugins from '@/components/commons/app-plugins';
import AppLayout from '@/components/layouts/app-layout';
import AppProviders from '@/contexts/app-providers';
import { env } from '@/libs/env';
import { routing } from '@/libs/i18n/routing';
import { initDayjs } from '@/libs/utils/dayjs';

export async function generateMetadata(): Promise<Metadata> {
	const tMeta = await getTranslations('meta');
	return {
		metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
		title: {
			default: `${tMeta('title')}`,
			template: `%s | ${tMeta('title')}`,
		},
		description: tMeta('description'),
	};
}

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

const Layout = async ({ children, params }: { children: ReactNode; params: PageParamsWithLocale }) => {
	const locale = (await params).locale;
	if (!routing.locales.includes(locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const messages = await getMessages();
	const timeZone = await getTimeZone();
	initDayjs(locale, timeZone);

	return (
		<AppLayout
			locale={locale}
			bodyProps={{
				className: 'min-h-screen antialiased',
			}}
		>
			<AppProviders messages={messages} timeZone={timeZone} locale={locale}>
				{children}
				<AppPlugins />
			</AppProviders>
		</AppLayout>
	);
};

export default Layout;
