'use client';

import { ViewTransition } from 'react';

import { useTranslations } from 'next-intl';

export const Sudoku = () => {
	const t = useTranslations();

	return (
		<ViewTransition>
			<div className="rounded-2xl shadow-2xl p-8 max-w-4xl w-full bg-foreground/5 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
				<h2 className="text-4xl font-bold text-center">{t('routes.sudoku.title')}</h2>

				<div className="flex flex-col items-center justify-center gap-4 p-12 text-center text-muted-foreground">
					<p className="text-lg">{t('routes.sudoku.description')}</p>
					<p className="text-sm">遊戲開發中...</p>
				</div>
			</div>
		</ViewTransition>
	);
};

