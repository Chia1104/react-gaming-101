'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { HelmetProvider } from 'react-helmet-async';

import { getQueryClient } from '@/libs/query-client';

interface Props {
	children?: React.ReactNode;
	messages: AbstractIntlMessages;
	timeZone?: string;
	locale: Locale;
}

const AppProviders = (props: Props) => {
	const queryClient = getQueryClient();
	return (
		<NextIntlClientProvider messages={props.messages} timeZone={props.timeZone} locale={props.locale}>
			<QueryClientProvider client={queryClient}>
				<NuqsAdapter>
					<NextThemeProvider defaultTheme="dark" enableSystem attribute="class">
						<HelmetProvider>{props.children}</HelmetProvider>
					</NextThemeProvider>
				</NuqsAdapter>
			</QueryClientProvider>
		</NextIntlClientProvider>
	);
};

export default AppProviders;
