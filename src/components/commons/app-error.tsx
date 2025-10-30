'use client';

import { ViewTransition } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { withError } from '@/hocs/with-error';
import { logger } from '@/libs/utils/logger';

import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

export const AppError = withError(
	({ reset }) => {
		const t = useTranslations();

		return (
			<ViewTransition>
				<div className="flex flex-col items-center justify-center w-full p-4 text-center">
					<Avatar className="size-16 mb-4">
						<AvatarImage src="/assets/bot.png" />
						<AvatarFallback>Bot</AvatarFallback>
					</Avatar>
					<h1 className="text-3xl font-bold mb-4">{t('commons.error.title')}</h1>
					<p className="text-gray-500 mb-8 max-w-md">{t('commons.error.description')}</p>
					<div className="flex gap-4">
						<Button variant="outline" onClick={() => reset()} aria-label={t('action.back-to-previous')}>
							{t('action.retry')}
						</Button>
					</div>
				</div>
			</ViewTransition>
		);
	},
	{
		onError(error) {
			logger(error, { type: 'error' });
		},
	},
);
