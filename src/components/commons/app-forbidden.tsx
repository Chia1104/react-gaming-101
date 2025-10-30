'use client';

import { ViewTransition } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

export const AppForbidden = () => {
	const t = useTranslations();

	return (
		<ViewTransition>
			<div className="flex flex-col items-center justify-center w-full p-4 text-center">
				<Avatar className="size-16 mb-4">
					<AvatarImage src="/assets/bot.png" />
					<AvatarFallback>Bot</AvatarFallback>
				</Avatar>
				<h1 className="text-3xl font-bold mb-4">{t('commons.forbidden.title')}</h1>
				<p className="text-gray-500 mb-8 max-w-md">{t('commons.forbidden.description')}</p>
				<div className="flex gap-4">
					<Button variant="outline" aria-label={t('action.back-to-home')} asChild>
						<Link href="/">{t('action.back-to-home')}</Link>
					</Button>
				</div>
			</div>
		</ViewTransition>
	);
};
