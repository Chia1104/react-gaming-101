'use client';

import NextError from 'next/error';

import AppLayout from '@/components/layouts/app-layout';
import { Locale } from '@/enums/locale.enum';

export default function NotFound() {
	return (
		<AppLayout
			locale={Locale.EN_US}
			theme="dark"
			bodyProps={{
				className: 'bg-root min-h-screen text-white',
			}}
		>
			<NextError statusCode={404} withDarkMode />
			<style>
				{`.next-error-h1 {
					border-right:1px solid white
				}`}
			</style>
		</AppLayout>
	);
}
