'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface Props<TError extends Error> {
	error?: TError | null;
	fallback?: React.ReactNode;
	onRetry?: () => void;
	enabledSentry?: boolean;
}

export const ErrorFallback = <TError extends Error>({ error, fallback, onRetry }: Props<TError>) => {
	const t = useTranslations();

	return (
		fallback ?? (
			<div className="w-full rounded-medium flex flex-col gap-4 bg-danger-100/50 border border-danger-100 text-foreground p-5">
				<h2 className="text-lg font-medium">{t('commons.error.title')}</h2>
				<p className="text-sm text-default-500">{t('commons.error.description')}</p>
				<code>{error?.message}</code>
				{onRetry && (
					<Button variant="destructive" onClick={onRetry}>
						{t('action.retry')}
					</Button>
				)}
			</div>
		)
	);
};
